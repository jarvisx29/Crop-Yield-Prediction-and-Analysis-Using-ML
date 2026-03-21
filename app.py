"""
app.py — Flask backend for Crop Yield Prediction
Run: python app.py
API:
  GET  /            → health check
  GET  /countries   → list of valid country names
  POST /predict     → { predicted_yield, category, yield_hg_ha }
  POST /compare     → { current, compared, change_percent, direction }
"""

import os
import numpy as np
import pandas as pd
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

# ── App setup ──────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)

# ── Load model artifacts ───────────────────────────────────────────────
BASE      = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE, "model")

model           = joblib.load(os.path.join(MODEL_DIR, "model.pkl"))
scaler          = joblib.load(os.path.join(MODEL_DIR, "scaler.pkl"))
crop_columns    = joblib.load(os.path.join(MODEL_DIR, "crop_columns.pkl"))
country_columns = joblib.load(os.path.join(MODEL_DIR, "country_columns.pkl"))
feature_columns = joblib.load(os.path.join(MODEL_DIR, "feature_columns.pkl"))
label_stats     = joblib.load(os.path.join(MODEL_DIR, "label_stats.pkl"))
countries_list  = joblib.load(os.path.join(MODEL_DIR, "countries.pkl"))

P33 = label_stats["p33"]
P66 = label_stats["p66"]
NUMERIC_COLS = ["Year", "Rainfall (mm)", "Temperature (Celsius)", "Pesticides (tonnes)"]


def categorise(yield_hg_ha: float) -> str:
    if yield_hg_ha >= P66:   return "good"
    elif yield_hg_ha >= P33: return "average"
    return "low"


def run_prediction(country, crop, rainfall, temperature, pesticide, year):
    """Build feature row and predict. Returns (result_dict, error_string)."""
    row = {col: 0 for col in feature_columns}

    # Numeric
    row["Year"]                  = year
    row["Rainfall (mm)"]         = rainfall
    row["Temperature (Celsius)"] = temperature
    row["Pesticides (tonnes)"]   = pesticide

    # One-hot: crop
    crop_key = f"Item_{crop}"
    if crop_key not in feature_columns:
        match = next((c for c in crop_columns if c.lower() == crop_key.lower()), None)
        if not match:
            return None, f"Unknown crop '{crop}'"
        row[match] = 1
    else:
        row[crop_key] = 1

    # One-hot: country
    country_key = f"Country_{country}"
    if country_key not in feature_columns:
        # Try case-insensitive
        match = next((c for c in country_columns if c.lower() == country_key.lower()), None)
        if not match:
            return None, f"Unknown country '{country}'. Use /countries to see valid names."
        row[match] = 1
    else:
        row[country_key] = 1

    df_row = pd.DataFrame([row])[feature_columns]
    df_row[NUMERIC_COLS] = scaler.transform(df_row[NUMERIC_COLS])

    yield_hg_ha = float(model.predict(df_row)[0])
    return {
        "predicted_yield": round(yield_hg_ha / 10000, 2),
        "yield_hg_ha":     round(yield_hg_ha, 1),
        "category":        categorise(yield_hg_ha),
    }, None


# ── Health check ───────────────────────────────────────────────────────
@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "ok", "message": "Crop Yield Prediction API is running."})


# ── Countries list ─────────────────────────────────────────────────────
@app.route("/countries", methods=["GET"])
def get_countries():
    return jsonify({"countries": countries_list})


# ── Predict ────────────────────────────────────────────────────────────
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(force=True)

    required = ["country", "crop", "rainfall", "temperature", "pesticide"]
    missing  = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    try:
        country     = str(data["country"]).strip()
        crop        = str(data["crop"]).strip()
        rainfall    = float(data["rainfall"])
        temperature = float(data["temperature"])
        pesticide   = float(data["pesticide"])
        year        = int(data["year"]) if data.get("year") else 2016
    except (ValueError, TypeError) as e:
        return jsonify({"error": f"Invalid input: {e}"}), 400

    result, err = run_prediction(country, crop, rainfall, temperature, pesticide, year)
    if err:
        return jsonify({"error": err}), 400
    return jsonify(result)


# ── Compare ────────────────────────────────────────────────────────────
@app.route("/compare", methods=["POST"])
def compare():
    data = request.get_json(force=True)

    required = ["country", "crop", "rainfall", "temperature", "pesticide"]
    missing  = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    try:
        country      = str(data["country"]).strip()
        crop         = str(data["crop"]).strip()
        rainfall     = float(data["rainfall"])
        temperature  = float(data["temperature"])
        pesticide    = float(data["pesticide"])
        current_year = int(data.get("current_year") or 2016)
        compare_year = int(data["compare_year"])
    except (KeyError, ValueError, TypeError) as e:
        return jsonify({"error": f"Invalid input: {e}"}), 400

    # Current (future) year prediction
    current, err = run_prediction(country, crop, rainfall, temperature, pesticide, current_year)
    if err:
        return jsonify({"error": err}), 400
    current["year"] = current_year

    # Baseline (data year) prediction
    compared, err = run_prediction(country, crop, rainfall, temperature, pesticide, compare_year)
    if err:
        return jsonify({"error": err}), 400
    compared["year"]  = compare_year
    compared["label"] = str(compare_year)

    # Percentage change: (future - baseline) / baseline × 100
    base = compared["predicted_yield"]
    curr = current["predicted_yield"]
    if base == 0:
        change_percent, direction = 0.0, "same"
    else:
        raw = round(((curr - base) / base) * 100, 1)
        change_percent = abs(raw)
        direction = "increase" if raw > 0 else ("decrease" if raw < 0 else "same")

    return jsonify({
        "current":        current,
        "compared":       compared,
        "change_percent": change_percent,
        "direction":      direction,
    })


# ── Run ────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 50)
    print("  Crop Yield Prediction API")
    print("  http://localhost:5001")
    print("=" * 50)
    app.run(host="0.0.0.0", port=5001, debug=False)
