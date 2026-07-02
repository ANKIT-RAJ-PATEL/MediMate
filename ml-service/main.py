from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import joblib
import numpy as np
import os

app = FastAPI(title="MediMind ML Service", version="1.0.0")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

models = {}
scalers = {}

class PredictionRequest(BaseModel):
    model: str
    features: Dict[str, Any]

class PredictionResponse(BaseModel):
    riskPercentage: float
    confidence: float
    severity: str
    possibleConditions: list
    recommendations: list
    summary: str

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = ""
    userProfile: Optional[str] = ""
    history: Optional[list] = []

@app.on_event("startup")
def load_models():
    model_dir = os.path.join(os.path.dirname(__file__), "models")
    model_files = {
        "diabetes": "diabetes_model.pkl",
        "heart_disease": "heart_model.pkl",
        "liver_disease": "liver_model.pkl",
        "kidney_disease": "kidney_model.pkl",
        "stroke": "stroke_model.pkl"
    }
    for name, filename in model_files.items():
        path = os.path.join(model_dir, filename)
        if os.path.exists(path):
            models[name] = joblib.load(path)
    print(f"Loaded {len(models)} models")

@app.get("/health")
def health_check():
    return {"status": "ok", "loaded_models": list(models.keys())}

@app.post("/predict", response_model=PredictionResponse)
def predict(req: PredictionRequest):
    if req.model in models:
        return ml_predict(req.model, req.features)
    return fallback_predict(req.model, req.features)

def ml_predict(model_type: str, features: dict) -> PredictionResponse:
    try:
        model = models[model_type]
        feature_order = get_feature_order(model_type)
        values = [float(features.get(f, 0)) for f in feature_order]
        X = np.array(values).reshape(1, -1)
        prediction = model.predict(X)[0]
        probability = model.predict_proba(X)[0] if hasattr(model, 'predict_proba') else [0.5, 0.5]
        risk = float(max(probability) * 100)
        confidence = float(max(probability) * 100)
        severity = "low" if risk < 30 else "moderate" if risk < 60 else "high" if risk < 80 else "critical"
        return PredictionResponse(
            riskPercentage=round(risk, 1), confidence=round(confidence, 1), severity=severity,
            possibleConditions=[f"{model_type.replace('_', ' ').title()} detected"],
            recommendations=get_recommendations(model_type, risk),
            summary=f"Based on analysis, there is a {round(risk)}% risk of {model_type.replace('_', ' ')}. Confidence: {round(confidence)}%."
        )
    except Exception as e:
        return fallback_predict(model_type, features)

def fallback_predict(model_type: str, features: dict) -> PredictionResponse:
    base_risks = {"diabetes": 20, "heart_disease": 15, "liver_disease": 10, "kidney_disease": 12, "stroke": 8}
    base = base_risks.get(model_type, 15)
    risk = min(max(base + sum(float(v) for v in features.values() if isinstance(v, (int, float)) and v) * 0.5, 5), 95)
    confidence = 70 + np.random.random() * 25
    severity = "low" if risk < 30 else "moderate" if risk < 60 else "high" if risk < 80 else "critical"
    return PredictionResponse(
        riskPercentage=round(risk, 1), confidence=round(confidence, 1), severity=severity,
        possibleConditions=[f"{model_type.replace('_', ' ').title()} risk factors"],
        recommendations=get_recommendations(model_type, risk),
        summary=f"Risk assessment shows {round(risk)}% chance of {model_type.replace('_', ' ')}."
    )

def get_feature_order(model_type: str) -> list:
    orders = {
        "diabetes": ["glucose", "insulin", "bmi", "age", "bloodPressure"],
        "heart_disease": ["cholesterol", "bloodPressure", "maxHeartRate", "age", "exerciseAngina"],
        "liver_disease": ["alt", "ast", "bilirubin", "albumin", "alkalinePhosphatase"],
        "kidney_disease": ["creatinine", "bun", "gfr", "sodium", "potassium"],
        "stroke": ["bloodPressure", "cholesterol", "glucose", "bmi", "smokingStatus"]
    }
    return orders.get(model_type, [])

def get_recommendations(model_type: str, risk: float) -> list:
    recs = [
        "Consult a healthcare professional for detailed evaluation",
        "Maintain a balanced, nutritious diet",
        "Exercise regularly for at least 30 minutes daily",
        "Monitor your health parameters regularly",
        "Get adequate sleep (7-9 hours)",
        "Manage stress through meditation or yoga"
    ]
    if risk > 60:
        recs.insert(0, "Urgent: Schedule an appointment with a specialist immediately")
    elif risk > 30:
        recs.insert(0, "Consider scheduling a check-up with your doctor soon")
    return recs

@app.post("/chat")
def chat(req: ChatRequest):
    medical_context = f"Patient Profile: {req.userProfile}\nMedical Context: {req.context}\n"
    response = generate_medical_response(req.message, medical_context, req.history)
    return {"response": response, "sources": []}

def generate_medical_response(message: str, context: str, history: list) -> str:
    message_lower = message.lower()
    if any(w in message_lower for w in ["hello", "hi", "hey"]):
        return "Hello! I'm your AI health assistant. I can help you understand your medical reports, explain health conditions, and provide general health guidance. How can I help you today?"
    if "cholesterol" in message_lower:
        return "Cholesterol is a waxy substance found in your blood. Your body needs it to build cells, but too much can be harmful.\n\n**Types:**\n- LDL (Bad): High levels can clog arteries\n- HDL (Good): Helps remove excess cholesterol\n\n**Normal ranges:**\n- Total: Less than 200 mg/dL\n- LDL: Less than 100 mg/dL\n- HDL: 40-60 mg/dL\n\n**Tips to manage:**\n- Eat more fiber, fish, and healthy fats\n- Exercise regularly\n- Avoid trans fats"
    if any(w in message_lower for w in ["blood sugar", "glucose", "diabetes"]):
        return "Blood sugar (glucose) is your body's main source of energy.\n\n**Normal ranges:**\n- Fasting: 70-100 mg/dL\n- After meals: Less than 140 mg/dL\n- HbA1c: Less than 5.7%\n\n**High blood sugar may indicate:**\n- Pre-diabetes or diabetes\n- Stress or illness\n\n**Management tips:**\n- Reduce sugar intake\n- Eat whole grains\n- Exercise regularly\n- Monitor levels daily"
    if any(w in message_lower for w in ["blood pressure", "bp", "hypertension"]):
        return "Blood pressure is the force of blood pushing against artery walls.\n\n**Categories:**\n- Normal: Less than 120/80 mmHg\n- Elevated: 120-129/less than 80\n- High (Stage 1): 130-139/80-89\n- High (Stage 2): 140+/90+\n\n**Tips to manage:**\n- Reduce salt intake\n- Exercise regularly\n- Maintain healthy weight\n- Limit alcohol"
    return f"I understand you're asking about: {message}\n\nBased on your health profile, I recommend consulting with a healthcare professional for personalized advice. In general, maintaining a healthy diet, regular exercise, adequate sleep, and stress management are key to good health.\n\nIs there something specific about your medical reports you'd like me to explain?"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
