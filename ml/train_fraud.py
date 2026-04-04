import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
import joblib, os

np.random.seed(42)
n = 400

normal = pd.DataFrame({
    'gps_velocity_kmh':       np.random.uniform(0, 40, int(n * 0.9)),
    'os_mock_flag':           np.zeros(int(n * 0.9)),
    'ip_change_count':        np.random.randint(3, 15, int(n * 0.9)),
    'claim_count_30d':        np.random.randint(0, 4, int(n * 0.9)),
    'time_since_trigger_min': np.random.uniform(0, 30, int(n * 0.9)),
})
fraud = pd.DataFrame({
    'gps_velocity_kmh':       np.random.uniform(200, 1000, int(n * 0.1)),
    'os_mock_flag':           np.ones(int(n * 0.1)),
    'ip_change_count':        np.random.randint(0, 1, int(n * 0.1)),
    'claim_count_30d':        np.random.randint(8, 20, int(n * 0.1)),
    'time_since_trigger_min': np.random.uniform(0, 2, int(n * 0.1)),
})

df = pd.concat([normal, fraud], ignore_index=True)
features = ['gps_velocity_kmh','os_mock_flag','ip_change_count',
            'claim_count_30d','time_since_trigger_min']

model = IsolationForest(contamination=0.1, random_state=42)
model.fit(df[features])

os.makedirs('models', exist_ok=True)
joblib.dump(model, 'models/fraud_model.pkl')
print("✅ Fraud model saved")