import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib, os

np.random.seed(42)
n = 500

data = {
    'zone_disruption_freq': np.random.uniform(0, 1, n),
    'aqi_30day_avg':        np.random.uniform(50, 500, n),
    'rainfall_seasonal':    np.random.uniform(0, 200, n),
    'temp_max_avg':         np.random.uniform(25, 50, n),
    'hours_per_day':        np.random.uniform(2, 10, n),
    'months_active':        np.random.randint(1, 24, n),
}
df = pd.DataFrame(data)

df['risk_raw'] = (
    df['zone_disruption_freq'] * 0.35 +
    (df['aqi_30day_avg']     / 500) * 0.25 +
    (df['rainfall_seasonal'] / 200) * 0.20 +
    (df['temp_max_avg']      /  50) * 0.20
)

df['risk_label'] = pd.cut(
    df['risk_raw'], bins=[0, 0.35, 0.65, 1.0], labels=[0, 1, 2]
).astype(int)

features = ['zone_disruption_freq','aqi_30day_avg','rainfall_seasonal',
            'temp_max_avg','hours_per_day','months_active']

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(df[features], df['risk_label'])

os.makedirs('models', exist_ok=True)
joblib.dump(model, 'models/risk_model.pkl')
print(f"✅ Risk model saved | Accuracy: {model.score(df[features], df['risk_label']):.2f}")