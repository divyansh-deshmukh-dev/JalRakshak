import os
import datetime
import uuid
import firebase_admin
from firebase_admin import credentials, firestore

# 1. Initialize Firebase
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Path to your downloaded service account key
CERT_PATH = os.path.join(BASE_DIR, "serviceAccountKey.json")

if not firebase_admin._apps:
    cred = credentials.Certificate(CERT_PATH)
    firebase_admin.initialize_app(cred)

db = firestore.client()

# 2. Local Image Storage Config (Still keeping images local)
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)

def upload_image_and_get_url(file_content, filename):
    """Saves image locally and returns path for Firestore"""
    try:
        ext = os.path.splitext(filename)[1] or ".jpg"
        unique_filename = f"{uuid.uuid4()}{ext}"
        file_path = os.path.join(UPLOADS_DIR, unique_filename)
        
        with open(file_path, "wb") as f:
            f.write(file_content)
        
        # Note: React will need http://localhost:8000 prefix to see this
        return f"/uploads/{unique_filename}"
    except Exception as e:
        print(f"File Storage Error: {e}")
        return None

def save_water_report(ph=None, turbidity=None, analysis_result="", image_url="", 
                      lat=22.7196, lng=75.8577, ward=None, description=None, status_label=None):
    """Saves the report to Firebase Firestore"""
    try:
        status = status_label or "Safe"
        
        # Simple Logic if AI didn't provide status
        if not status_label:
            if ph and (float(ph) < 6.5 or float(ph) > 8.5): status = "Dangerous"
            if turbidity and float(turbidity) > 5.0: status = "Dangerous"

        report_data = {
            "id": str(uuid.uuid4()),
            "sensor_data": {"ph": ph, "turbidity": turbidity},
            "citizen_data": {"ward": ward, "description": description},
            "gemini_analysis": analysis_result,
            "image_url": image_url,
            "location": {"lat": lat, "lng": lng},
            "timestamp": datetime.datetime.now().isoformat(),
            "status": status
        }
        
        # SAVE TO FIRESTORE (Collection name is 'reports')
        # .add() automatically creates a unique ID in Firestore
        db.collection("reports").add(report_data)
            
        return report_data["id"]
    except Exception as e:
        print(f"Firestore Error: {e}")
        return None

def get_heatmap_data():
    try:
        # Firestore se saare records uthayein
        docs = db.collection("reports").stream()
        heatmap_list = []
        for doc in docs:
            d = doc.to_dict()
            if 'location' in d:
                heatmap_list.append({
                    "lat": d['location']['lat'],
                    "lng": d['location']['lng'],
                    "status": d.get('status', 'Safe')
                })
        return heatmap_list
    except Exception as e:
        print(f"Heatmap Error: {e}")
        return []

def get_all_reports():
    """Fetches all reports from Firestore"""
    try:
        docs = db.collection("reports").order_by("timestamp", direction=firestore.Query.DESCENDING).stream()
        return [doc.to_dict() for doc in docs]
    except Exception as e:
        return []

def save_shutdown_alert(ward, reason, severity="High"):
    """Saves a shutdown alert to Firestore"""
    try:
        alert_data = {
            "id": str(uuid.uuid4()),
            "ward": ward,
            "pipeline_id": f"PL-{str(uuid.uuid4())[:4].upper()}", # Mock Pipeline ID
            "reason": reason,
            "severity": severity,
            "timestamp": datetime.datetime.now().isoformat(),
            "acknowledged": False
        }
        db.collection("shutdown_alerts").add(alert_data)
        return alert_data
    except Exception as e:
        print(f"Firestore Alert Error: {e}")
        return None

def get_recent_alerts(limit=5):
    """Fetches recent unacknowledged alerts"""
    try:
        # Get alerts from last 24 hours
        time_threshold = (datetime.datetime.now() - datetime.timedelta(hours=24)).isoformat()
        
        docs = db.collection("shutdown_alerts")\
            .where("timestamp", ">=", time_threshold)\
            .order_by("timestamp", direction=firestore.Query.DESCENDING)\
            .limit(limit)\
            .stream()
            
        return [doc.to_dict() for doc in docs]
    except Exception as e:
        print(f"Firestore Get Alerts Error: {e}")
        return []
