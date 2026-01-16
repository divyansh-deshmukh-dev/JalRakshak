import os
import datetime
import uuid
import json

# 1. Local Storage Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SERVER_DIR = os.path.join(BASE_DIR, "server")
UPLOADS_DIR = os.path.join(SERVER_DIR, "uploads")
DATA_DIR = os.path.join(SERVER_DIR, "data")
REPORTS_FILE = os.path.join(DATA_DIR, "reports.json")

# Ensure directories exist
os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

# Initialize reports file if it doesn't exist
if not os.path.exists(REPORTS_FILE):
    with open(REPORTS_FILE, "w") as f:
        json.dump([], f)

def upload_image_and_get_url(file_content, filename):
    """Saves water sample image to local server uploads folder and returns relative URL"""
    try:
        # Generate a unique filename
        ext = os.path.splitext(filename)[1] or ".jpg"
        unique_filename = f"{uuid.uuid4()}{ext}"
        file_path = os.path.join(UPLOADS_DIR, unique_filename)
        
        # Save file locally
        with open(file_path, "wb") as f:
            f.write(file_content)
        
        # Return the local URL path (will be served by FastAPI)
        return f"/uploads/{unique_filename}"
    except Exception as e:
        print(f"File Storage Error: {e}")
        return None

def save_water_report(ph=None, turbidity=None, analysis_result="", image_url="", lat=22.75, lng=75.89, ward=None, description=None):
    """Saves the final analysis report to local JSON file"""
    try:
        # Determine status based on available data
        status = "Safe"
        if ph is not None and (ph < 6.5 or ph > 8.5):
            status = "Danger"
        if turbidity is not None and turbidity > 5:
            status = "Danger"
        if "danger" in analysis_result.lower() or "unsafe" in analysis_result.lower():
            status = "Danger"

        report_data = {
            "id": str(uuid.uuid4()),
            "sensor_data": {
                "ph": ph,
                "turbidity": turbidity
            },
            "citizen_data": {
                "ward": ward,
                "description": description
            },
            "gemini_analysis": analysis_result,
            "image_url": image_url,
            "location": {
                "lat": lat,
                "lng": lng
            },
            "timestamp": datetime.datetime.now().isoformat(),
            "status": status
        }
        
        # Read existing reports
        with open(REPORTS_FILE, "r") as f:
            reports = json.load(f)
        
        # Add new report
        reports.append(report_data)
        
        # Save back to file
        with open(REPORTS_FILE, "w") as f:
            json.dump(reports, f, indent=4)
            
        return report_data["id"]
    except Exception as e:
        print(f"Local DB Error: {e}")
        return None

def get_heatmap_data():
    """Fetches all reports from local JSON to show on Google Maps heatmap"""
    try:
        if not os.path.exists(REPORTS_FILE):
            return []
            
        with open(REPORTS_FILE, "r") as f:
            reports = json.load(f)
            
        # Sort by timestamp descending and limit to 50
        sorted_reports = sorted(reports, key=lambda x: x["timestamp"], reverse=True)[:50]
        
        heatmap_list = []
        for d in sorted_reports:
            heatmap_list.append({
                "lat": d['location']['lat'],
                "lng": d['location']['lng'],
                "status": d['status']
            })
        return heatmap_list
    except Exception as e:
        print(f"Heatmap Data Error: {e}")
        return []

def get_all_reports():
    """Fetches all reports from local JSON file"""
    try:
        if not os.path.exists(REPORTS_FILE):
            return []
            
        with open(REPORTS_FILE, "r") as f:
            reports = json.load(f)
            
        # Sort by timestamp descending
        return sorted(reports, key=lambda x: x["timestamp"], reverse=True)
    except Exception as e:
        print(f"Get Reports Error: {e}")
        return []