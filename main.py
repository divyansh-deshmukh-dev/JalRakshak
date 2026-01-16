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
from pydantic import BaseModel
import google.api_core.exceptions

# Import your local DB functions
from database import upload_image_and_get_url, save_water_report, get_heatmap_data, get_all_reports

load_dotenv()

app = FastAPI(title="JalRakshak API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure Uploads Directory exists
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads") # Simplified path
os.makedirs(UPLOADS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# Configure Gemini
GENAI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GENAI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found.")

genai.configure(api_key=GENAI_API_KEY)

# Define models for structured AI output
class AnalysisResult(BaseModel):
    cleanlinessScore: float
    statusLabel: str
    analysis: str

@app.get("/")
def read_root():
    return {"status": "online", "system": "JalRakshak Local Storage"}

@app.post("/process-citizen-report")
async def process_citizen_report(
    file: UploadFile = File(...), 
    ward: str = Form(...), 
    description: str = Form(None)
):
    try:
        content = await file.read()
        image_url = upload_image_and_get_url(content, file.filename)
        
        # 1. Open and Resize Image (Saves tokens and bandwidth)
        img = Image.open(io.BytesIO(content))
        img.thumbnail((800, 800)) # Resize to max 800px width/height
        
        # 2. Try AI Analysis with Fallback
        try:
            # Try 1.5 Flash as it's more reliable for free tier
            model = genai.GenerativeModel('gemini-2.5-flash') 
            
            prompt = f"Analyze water sample: {ward}. Description: {description}. Return JSON: {{'cleanlinessScore': float (0-100), 'statusLabel': str (Safe, Caution, Unsafe), 'analysis': str}}"
            
            response = await model.generate_content_async(
                [prompt, img],
                generation_config={"response_mime_type": "application/json"}
            )
            ai_data = json.loads(response.text)
            
        except google.api_core.exceptions.ResourceExhausted:
            print("⚠️ Gemini Quota Exceeded. Using Fallback logic.")
            # FALLBACK: Provide a basic response if AI is unavailable
            ai_data = {
                "cleanlinessScore": 0.0,
                "statusLabel": "Analysis Pending",
                "analysis": "AI is currently at capacity. Report has been saved for manual review by authorities."
            }
        except Exception as e:
            print(f"AI Error: {e}")
            ai_data = {"cleanlinessScore": 0.5, "statusLabel": "Error", "analysis": "Could not process image."}

        # 3. Save to Local DB (Even if AI failed, the report is saved!)
        report_id = save_water_report(
            analysis_result=ai_data["analysis"], 
            image_url=image_url,
            ward=ward,
            description=description
        )
        
        return {"success": True, "data": ai_data, "report_id": report_id}

    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/heatmap-data")
def get_heatmap():
    return {"heatmap": get_heatmap_data()}

@app.get("/reports")
def get_reports():
    return {"reports": get_all_reports()}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)