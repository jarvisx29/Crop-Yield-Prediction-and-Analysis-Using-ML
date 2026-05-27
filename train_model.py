"""
train_model.py
Trains a RandomForestRegressor on the crop yield dataset and saves:
  - model/model.pkl            (trained model)
  - model/scaler.pkl           (MinMaxScaler for numeric features)
  - model/crop_columns.pkl     (ordered list of one-hot crop columns)
  - model/country_columns.pkl  (ordered list of one-hot country columns)
  - model/countries.pkl        (sorted list of valid country names for frontend)
  - model/feature_columns.pkl  (full ordered feature list)
  - model/label_stats.pkl      (percentile thresholds for Good/Avg/Low)
"""

import os
import numpy as np
import pandas as pd
import joblib
from scipy import stats
from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_absolute_error

# ── Paths ──────────────────────────────────────────────────────────────
BASE = os.path.dirname(os.path.abspath(__file__))
RES  = os.path.join(BASE, "res")
OUT  = os.path.join(BASE, "model")
os.makedirs(OUT, exist_ok=True)

# ── Load datasets ──────────────────────────────────────────────────────
print("Loading datasets...")
rainfall_df    = pd.read_csv(os.path.join(RES, "rainfall_yearly.csv"))
temperature_df = pd.read_csv(os.path.join(RES, "temperature_yearly.csv"))
yield_df       = pd.read_csv(os.path.join(RES, "yield_final.csv"))
pesticides_df  = pd.read_csv(os.path.join(RES, "pesticides_clean.csv"))

# ── Rename columns ─────────────────────────────────────────────────────
rainfall_df.rename(columns={"Rainfall": "Rainfall (mm)"}, inplace=True)
temperature_df.rename(columns={"Temperature": "Temperature (Celsius)"}, inplace=True)
pesticides_df.rename(columns={"Pesticides": "Pesticides (tonnes)"}, inplace=True)

# ── Merge all datasets on Country + Year ───────────────────────────────
print("Merging datasets...")
df = (
    rainfall_df[["Country", "Year", "Rainfall (mm)"]]
    .merge(temperature_df[["Country", "Year", "Temperature (Celsius)"]], on=["Country", "Year"])
    .merge(yield_df[["Country", "Year", "Item", "Yield (hg/ha)"]], on=["Country", "Year"])
    .merge(pesticides_df[["Country", "Year", "Pesticides (tonnes)"]], on=["Country", "Year"])
)
print(f"  Merged shape: {df.shape}")

# ── Save valid country list for the frontend dropdown ──────────────────
countries = sorted(df["Country"].unique().tolist())
joblib.dump(countries, os.path.join(OUT, "countries.pkl"))
print(f"  Countries in dataset: {len(countries)}")

# ── One-hot encode Country and Item (crop) ─────────────────────────────
print("One-hot encoding Country + Item...")
df_enc = pd.get_dummies(df, columns=["Country", "Item"], prefix=["Country", "Item"])

crop_columns    = [c for c in df_enc.columns if c.startswith("Item_")]
country_columns = [c for c in df_enc.columns if c.startswith("Country_")]

joblib.dump(crop_columns,    os.path.join(OUT, "crop_columns.pkl"))
joblib.dump(country_columns, os.path.join(OUT, "country_columns.pkl"))
print(f"  Crop dummies:    {len(crop_columns)}")
print(f"  Country dummies: {len(country_columns)}")

# ── Features / Target ─────────────────────────────────────────────────
TARGET = "Yield (hg/ha)"
y = df_enc[TARGET].astype(float)
X = df_enc.drop(columns=[TARGET])

# ── Remove outliers (z-score < 11 on numeric cols) ────────────────────
print("Removing outliers...")
numeric_cols = ["Year", "Rainfall (mm)", "Temperature (Celsius)", "Pesticides (tonnes)"]
z    = np.abs(stats.zscore(X[numeric_cols]))
mask = (z < 11).all(axis=1)
X, y = X[mask], y[mask]
print(f"  After outlier removal: {X.shape[0]} rows")

# ── Scale numeric features ─────────────────────────────────────────────
print("Scaling features...")
scaler = MinMaxScaler()
X = X.copy()
X[numeric_cols] = scaler.fit_transform(X[numeric_cols])
joblib.dump(scaler, os.path.join(OUT, "scaler.pkl"))

# Save full ordered feature list
feature_columns = list(X.columns)
joblib.dump(feature_columns, os.path.join(OUT, "feature_columns.pkl"))
print(f"  Total feature columns: {len(feature_columns)}")

# ── Train / Test split ─────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# ── Train Random Forest ────────────────────────────────────────────────
print("Training RandomForestRegressor (this may take ~60 seconds)...")
model = RandomForestRegressor(n_estimators=30, random_state=42, n_jobs=-1)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
r2  = r2_score(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)
print(f"  R²  = {r2:.4f}")
print(f"  MAE = {mae:,.0f} hg/ha  ({mae/10000:.2f} tons/ha)")

# ── Save category thresholds ───────────────────────────────────────────
p33 = float(np.percentile(y_train, 33))
p66 = float(np.percentile(y_train, 66))
joblib.dump({"p33": p33, "p66": p66}, os.path.join(OUT, "label_stats.pkl"))
print(f"  Thresholds (hg/ha): Low < {p33:.0f} <= Average < {p66:.0f} <= Good")

# ── Save model ─────────────────────────────────────────────────────────
joblib.dump(model, os.path.join(OUT, "model.pkl"))
print("\nAll artifacts saved to model/")
print("  model.pkl  scaler.pkl  crop_columns.pkl  country_columns.pkl")
print("  countries.pkl  feature_columns.pkl  label_stats.pkl")
print("\nTraining complete!")
