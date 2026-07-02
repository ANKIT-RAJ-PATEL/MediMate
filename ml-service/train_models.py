import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

def generate_synthetic_data(n_samples=1000, disease="diabetes"):
    np.random.seed(42)
    if disease == "diabetes":
        data = pd.DataFrame({
            "glucose": np.random.normal(140, 40, n_samples).clip(70, 250),
            "insulin": np.random.normal(80, 30, n_samples).clip(10, 300),
            "bmi": np.random.normal(28, 6, n_samples).clip(15, 50),
            "age": np.random.randint(20, 80, n_samples),
            "bloodPressure": np.random.normal(80, 15, n_samples).clip(50, 140),
            "target": np.random.binomial(1, 0.35, n_samples)
        })
    elif disease == "heart_disease":
        data = pd.DataFrame({
            "cholesterol": np.random.normal(220, 40, n_samples).clip(100, 400),
            "bloodPressure": np.random.normal(130, 20, n_samples).clip(80, 200),
            "maxHeartRate": np.random.normal(150, 25, n_samples).clip(60, 220),
            "age": np.random.randint(25, 80, n_samples),
            "exerciseAngina": np.random.binomial(1, 0.3, n_samples),
            "target": np.random.binomial(1, 0.25, n_samples)
        })
    elif disease == "liver_disease":
        data = pd.DataFrame({
            "alt": np.random.normal(30, 15, n_samples).clip(5, 200),
            "ast": np.random.normal(25, 12, n_samples).clip(5, 150),
            "bilirubin": np.random.normal(1.0, 0.5, n_samples).clip(0.1, 5),
            "albumin": np.random.normal(4.0, 0.5, n_samples).clip(2, 5.5),
            "alkalinePhosphatase": np.random.normal(80, 20, n_samples).clip(30, 300),
            "target": np.random.binomial(1, 0.2, n_samples)
        })
    elif disease == "kidney_disease":
        data = pd.DataFrame({
            "creatinine": np.random.normal(1.0, 0.4, n_samples).clip(0.3, 5),
            "bun": np.random.normal(15, 5, n_samples).clip(5, 50),
            "gfr": np.random.normal(90, 25, n_samples).clip(10, 150),
            "sodium": np.random.normal(140, 5, n_samples).clip(120, 160),
            "potassium": np.random.normal(4.0, 0.5, n_samples).clip(2.5, 6),
            "target": np.random.binomial(1, 0.15, n_samples)
        })
    elif disease == "stroke":
        data = pd.DataFrame({
            "bloodPressure": np.random.normal(130, 20, n_samples).clip(80, 200),
            "cholesterol": np.random.normal(220, 40, n_samples).clip(100, 400),
            "glucose": np.random.normal(120, 30, n_samples).clip(60, 250),
            "bmi": np.random.normal(28, 6, n_samples).clip(15, 50),
            "smokingStatus": np.random.binomial(1, 0.3, n_samples),
            "target": np.random.binomial(1, 0.1, n_samples)
        })
    return data

def train_model(disease):
    print(f"\nTraining {disease} model...")
    data = generate_synthetic_data(2000, disease)
    X = data.drop("target", axis=1)
    y = data["target"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    model = GradientBoostingClassifier(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)

    y_pred = model.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"  Accuracy: {accuracy:.4f}")

    scores = cross_val_score(model, X_train_scaled, y_train, cv=5)
    print(f"  Cross-val accuracy: {scores.mean():.4f} (+/- {scores.std() * 2:.4f})")

    model_path = os.path.join(MODELS_DIR, f"{disease}_model.pkl")
    scaler_path = os.path.join(MODELS_DIR, f"{disease}_scaler.pkl")
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    print(f"  Model saved to {model_path}")

def train_all():
    diseases = ["diabetes", "heart_disease", "liver_disease", "kidney_disease", "stroke"]
    for disease in diseases:
        train_model(disease)
    print("\nAll models trained successfully!")

if __name__ == "__main__":
    train_all()
