import os
import json
import datetime
import uuid
import firebase_admin
from firebase_admin import credentials, firestore

# -----------------------------
# 1. Initialize Firebase (SAFE)
# -----------------------------

if not firebase_admin._apps:
    firebase_creds = os.getenv("FIREBASE_SERVICE_ACCOUNT")

    if firebase_creds:
        # ✅ Render / Production (Env Variable)
        cred = credentials.Certificate(json.loads(firebase_creds))
    else:
        # ✅ Local development fallback
        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        CERT_PATH = os.path.join(BASE_DIR, "serviceAccountKey.json")

        if not os.path.exists(CERT_PATH):
            raise RuntimeError(
                "Firebase credentials not found. "
                "Set FIREBASE_SERVICE_ACCOUNT env variable or add serviceAccountKey.json locally."
            )

        cred = credentials.Certificate(CERT_PATH)

    firebase_admin.initialize_app(cred)

db = firestore.client()

# --------------------------------
# 2. Local Image Storage (OK)
# --------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)


def upload_image_and_get_url(file_content, filename):
    """Saves image locally and returns relative path"""
    try:
        ext = os.path.splitext(filename)[1] or ".jpg"
        unique_filename = f"{uuid.uuid4()}{ext}"
        file_path = os.path.join(UPLOADS_DIR, unique_filename)

        with open(file_path, "wb") as f:
            f.write(file_content)

        return f"/uploads/{unique_filename}"
    except Exception as e:
        print(f"File Storage Error: {e}")
        return None


# --------------------------------
# 3. Firestore Operations
# --------------------------------

def save_water_report(
    ph=None,
    turbidity=None,
    analysis_result="",
    image_url="",
    lat=22.7196,
    lng=75.8577,
    ward=None,
    description=None,
    status_label=None
):
    """Saves water quality report to Firestore"""
    if db is None:
        print("Database not available - skipping save")
        return str(uuid.uuid4())
        
    try:
        status = status_label or "Safe"

        if not status_label:
            if ph is not None and (float(ph) < 6.5 or float(ph) > 8.5):
                status = "Dangerous"
            if turbidity is not None and float(turbidity) > 5.0:
                status = "Dangerous"

        report_data = {
            "id": str(uuid.uuid4()),
            "sensor_data": {"ph": ph, "turbidity": turbidity},
            "citizen_data": {"ward": ward, "description": description},
            "gemini_analysis": analysis_result,
            "image_url": image_url,
            "location": {"lat": lat, "lng": lng},
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "status": status
        }

        db.collection("reports").add(report_data)
        return report_data["id"]

    except Exception as e:
        print(f"Firestore Error: {e}")
        return None


def get_heatmap_data():
    if db is None:
        return []
        
    try:
        docs = db.collection("reports").stream()
        heatmap_list = []

        for doc in docs:
            d = doc.to_dict()
            if "location" in d:
                heatmap_list.append({
                    "lat": d["location"]["lat"],
                    "lng": d["location"]["lng"],
                    "status": d.get("status", "Safe")
                })

        return heatmap_list

    except Exception as e:
        print(f"Heatmap Error: {e}")
        return []


def get_all_reports():
    if db is None:
        return []
        
    try:
        docs = (
            db.collection("reports")
            .order_by("timestamp", direction=firestore.Query.DESCENDING)
            .stream()
        )
        return [doc.to_dict() for doc in docs]
    except Exception:
        return []


def save_shutdown_alert(ward, reason, severity="High"):
    if db is None:
        print("Database not available - skipping alert save")
        return None
        
    try:
        alert_data = {
            "id": str(uuid.uuid4()),
            "ward": ward,
            "pipeline_id": f"PL-{str(uuid.uuid4())[:4].upper()}",
            "reason": reason,
            "severity": severity,
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "acknowledged": False
        }

        db.collection("shutdown_alerts").add(alert_data)
        return alert_data

    except Exception as e:
        print(f"Firestore Alert Error: {e}")
        return None


def get_recent_alerts(limit=5):
    if db is None:
        return []
        
    try:
        time_threshold = (
            datetime.datetime.utcnow() - datetime.timedelta(hours=24)
        ).isoformat()

        docs = (
            db.collection("shutdown_alerts")
            .where("timestamp", ">=", time_threshold)
            .order_by("timestamp", direction=firestore.Query.DESCENDING)
            .limit(limit)
            .stream()
        )

        return [doc.to_dict() for doc in docs]

    except Exception as e:
        print(f"Firestore Get Alerts Error: {e}")
        return []
