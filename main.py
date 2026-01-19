import os
import io
import json
import uvicorn
from PIL import Image
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import google.generativeai as genai
import google.api_core.exceptions
import traceback

# Import your local DB functions
from database import (
    upload_image_and_get_url, 
    save_water_report, 
    get_heatmap_data, 
    get_all_reports, 
    save_shutdown_alert, 
    get_recent_alerts
)

# Load .env explicitly from the same directory as this script
dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
load_dotenv(dotenv_path)

app = FastAPI(title="JalRakshak API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure Uploads Directory exists
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, "server", "uploads") # Unified path
if not os.path.exists(UPLOADS_DIR):
    os.makedirs(UPLOADS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# Configure Gemini
GENAI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GENAI_API_KEY:
    print("⚠️ WARNING: GEMINI_API_KEY not found in environment variables. AI features will not work.")

genai.configure(api_key=GENAI_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash') # Default to 2.0 Flash

@app.get("/")
def read_root():
    return {"status": "online", "system": "JalRakshak Backend (v2.0)"}

@app.post("/process-sample")
async def process_sample(
    file: UploadFile = File(...), 
    ph: str = Form(None), 
    turb: str = Form(None)
):
    try:
        content = await file.read()
        image_url = upload_image_and_get_url(content, file.filename)
        
        img = Image.open(io.BytesIO(content))
        img.thumbnail((800, 800))

        # Load Reference Image
        reference_img = None
        ref_path = os.path.join(BASE_DIR, "server", "reference_clean.jpg")
        if os.path.exists(ref_path):
            try:
                reference_img = Image.open(ref_path)
                reference_img.thumbnail((800, 800))
            except Exception as e:
                print(f"Failed to load reference image: {e}")

        has_sensors = ph and turb and ph != "null" and turb != "null"

        if has_sensors:
            prompt_context = f"Sensor readings are: pH {ph} and Turbidity {turb} NTU."
        else:
            prompt_context = "SENSORS NOT AVAILABLE. Based on the visual appearance of the water in the image, ESTIMATE the pH and Turbidity levels."

        prompt = f"""
        Analyze the water sample (Image 2). 
        Image 1 is a REFERENCE of perfectly clean water. Compare the sample against this reference.
        
        Context: {prompt_context}
        
        Provide the result in JSON format:
        {{
            "estimated_ph": float,
            "estimated_turbidity": float,
            "visual_analysis": "string describing what you see",
            "status": "Safe/Warning/Dangerous",
            "shutdown_recommended": boolean,
            "shutdown_reason": "string (only if shutdown_recommended is true)",
            "recommendations": "string"
        }}
        Return ONLY the JSON.
        """

        try:
            model = genai.GenerativeModel('gemini-1.5-flash') # Using 1.5 Flash for better availability
            
            inputs = [prompt]
            if reference_img:
                inputs.append(reference_img) # Image 1
            inputs.append(img) # Image 2

            response = await model.generate_content_async(
                inputs,
                generation_config={"response_mime_type": "application/json"}
            )
            ai_data = json.loads(response.text)
            
            final_ph = float(ph) if has_sensors else ai_data.get("estimated_ph", 7.0)
            final_turb = float(turb) if has_sensors else ai_data.get("estimated_turbidity", 0.5)
            
        except Exception as e:
            print(f"AI Error: {e}")
            ai_data = {"status": "Manual Check", "visual_analysis": "AI Failed"}
            final_ph, final_turb = 7.0, 1.0

        report_id = save_water_report(
            ph=final_ph, 
            turbidity=final_turb, 
            analysis_result=ai_data.get("visual_analysis"), 
            image_url=image_url,
            status_label=ai_data.get("status")
        )
        
        # Shutdown Trigger
        if ai_data.get("shutdown_recommended", False):
            print(f"DEBUG: Triggering Shutdown Alert: {ai_data.get('shutdown_reason')}")
            save_shutdown_alert(
                ward="Unknown (Sample)",
                reason=ai_data.get("shutdown_reason", "Dangerous Contamination Detected"),
                severity="Critical"
            )
        
        return {
            "success": True,
            "report_id": report_id, 
            "data": ai_data,
            "image_url": image_url
        }
    except Exception as e:
        print(f"General Error: {e}")
        return {"success": False, "error": str(e)}

    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/process-citizen-report")
async def process_citizen_report(
    file: UploadFile = File(...), 
    ward: str = Form(...), 
    description: str = Form(None)
):
    try:
        content = await file.read()
        image_url = upload_image_and_get_url(content, file.filename)
        
        img = Image.open(io.BytesIO(content))
        img.thumbnail((800, 800))
        
        # Load Reference Image
        reference_img = None
        ref_path = os.path.join(BASE_DIR, "server", "reference_clean.jpg")
        if os.path.exists(ref_path):
            try:
                reference_img = Image.open(ref_path)
                reference_img.thumbnail((800, 800))
            except Exception as e:
                print(f"Failed to load reference image: {e}")

        ai_data = None
        
        # DEFINED MODEL PRIORITY LIST
        # Based on check_models.py output
        model_candidates = [
            "gemini-2.0-flash",       # Primary
            "gemini-2.0-flash-lite",  # Lite version (valid per list)
            "gemini-flash-latest",    # 1.5 Flash equivalent
            "gemini-1.5-flash"        # Fallback just in case
        ]

        prompt = f"""
        Analyze water sample (Image 2) from Ward: {ward}. Description: {description}. 
        Image 1 is a REFERENCE of perfectly clean water. Compare the sample against this reference.
        
        Identify contaminants and danger level.
        
        Return JSON: {{
            'cleanlinessScore': float (0.0 to 100.0), 
            'statusLabel': str (Safe, Caution, Unsafe), 
            'analysis': str,
            'shutdown_recommended': boolean,
            'shutdown_reason': str,
            'estimated_ph': float (estimate 0-14 based on visual),
            'estimated_turbidity': float (estimate NTU based on visual)
        }}
        """
        
        inputs = [prompt]
        if reference_img:
            inputs.append(reference_img)
        inputs.append(img)

        # Try models in sequence
        for model_name in model_candidates:
            try:
                print(f"DEBUG: Attempting AI analysis with model: {model_name}")
                model = genai.GenerativeModel(model_name)
                response = await model.generate_content_async(
                    inputs,
                    generation_config={"response_mime_type": "application/json"}
                )
                ai_data = json.loads(response.text)
                print(f"DEBUG: Success with {model_name}")
                break # Stop if successful
            except google.api_core.exceptions.ResourceExhausted:
                print(f"WARNING: Quota exceeded for {model_name}. Trying next...")
                continue # Try next model
            except Exception as e:
                print(f"WARNING: Error with {model_name}: {e}")
                if "404" in str(e) or "not found" in str(e).lower():
                     continue # Model not found, try next
                # For other errors, might be worth trying next too, but log it
                continue

        # If all failed or exhausted
        if not ai_data:
             print("CRITICAL: All AI models failed or quota exceeded.")
             # Check if it was purely quota issues (we can't easily know from here without tracking, 
             # but we'll assume if we got here it's bad)
             ai_data = {
                "cleanlinessScore": 0.0,
                "statusLabel": "AI Busy / Quota Exceeded",
                "analysis": "The AI service is currently experiencing high traffic. Please try again later.",
                "shutdown_recommended": False,
                "estimated_ph": 7.0,
                "estimated_turbidity": 5.0
             }
        else:
            # Normalize Score
            raw_score = ai_data.get("cleanlinessScore", 0)
            if raw_score <= 1.0 and raw_score > 0:
                 ai_data["cleanlinessScore"] = raw_score * 100
        
        # Save Report
        report_id = save_water_report(
            analysis_result=ai_data.get("analysis", ""), 
            image_url=image_url,
            ward=ward,
            description=description,
            status_label=ai_data.get("statusLabel"),
            ph=ai_data.get("estimated_ph", 7.0),
            turbidity=ai_data.get("estimated_turbidity", 5.0)
        )
        
        # Shutdown Trigger
        if ai_data.get("shutdown_recommended", False):
             save_shutdown_alert(
                ward=ward,
                reason=ai_data.get("shutdown_reason", "High Contamination Reported by Citizen"),
                severity="Critical"
            )
        
        return {"success": True, "data": ai_data, "report_id": report_id}

    except Exception as e:
        print(f"Unhandled Error in process_citizen_report: {e}")
        return {"success": False, "error": str(e)}

@app.get("/get-incidents")
def get_incidents():
    """Fetches real reports from Firestore and formats them as incidents for the map."""
    try:
        reports = get_all_reports()
        incidents = []
        
        for report in reports:
             # Extract lat/lng safely
             loc = report.get("location", {})
             lat = loc.get("lat")
             lng = loc.get("lng")
             
             # Skip if no valid location (e.g. if default 0,0 or missing)
             if not lat or not lng:
                 continue

             # Flatten structure for frontend
             incidents.append({
                 "id": report.get("id"),
                 "lat": lat,
                 "lng": lng,
                 "score": report.get("cleanlinessScore", 0) if "cleanlinessScore" in report else 
                          (report.get("data", {}).get("cleanlinessScore", 0)), # Handle nested or flat data
                 "ward": report.get("citizen_data", {}).get("ward") or report.get("ward") or "Unknown",
                 "status": report.get("status", "Safe"),
                 "ph": report.get("sensor_data", {}).get("ph", 7.0),
                 "turbidity": report.get("sensor_data", {}).get("turbidity", 1.0)
             })
             
        return {"incidents": incidents}
    except Exception as e:
        print(f"Error getting incidents: {e}")
        return {"incidents": []}

@app.get("/heatmap-data")
def get_heatmap():
    return {"heatmap": get_heatmap_data()}

@app.get("/reports")
def get_reports():
    return {"reports": get_all_reports()}

@app.get("/get-alerts")
def get_alerts():
    """Fetches notification alerts for the dashboard."""
    try:
        return {"alerts": get_recent_alerts()}
    except Exception as e:
        return {"error": str(e), "alerts": []}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
