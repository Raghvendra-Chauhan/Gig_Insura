from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib, numpy as np

app = Flask(__name__)
CORS(app)

risk_model  = joblib.load('models/risk_model.pkl')
fraud_model = joblib.load('models/fraud_model.pkl')

PLAN_CONFIG = {
    'basic':    {'base_price': 15, 'payout_cap': 200},
    'standard': {'base_price': 30, 'payout_cap': 400},
    'pro':      {'base_price': 50, 'payout_cap': 700},
}
ADJUSTMENT = {0: 0, 1: 5, 2: 10}
LABEL_MAP  = {0: 'low', 1: 'medium', 2: 'high'}


@app.route('/health')
def health():
    return jsonify({'status': 'ML service running ✅'})


@app.route('/predict-risk', methods=['POST'])
def predict_risk():
    try:
        d = request.json
        features = [[
            d.get('zone_disruption_freq', 0.5),
            d.get('aqi_30day_avg',        150),
            d.get('rainfall_seasonal',     50),
            d.get('temp_max_avg',          35),
            d.get('hours_per_day',          6),
            d.get('months_active',          6),
        ]]

        label      = int(risk_model.predict(features)[0])
        proba      = risk_model.predict_proba(features)[0]
        risk_score = float(proba[label])
        plan       = d.get('plan_type', 'standard')

        return jsonify({
            'risk_score':       round(risk_score, 3),
            'risk_label':       LABEL_MAP[label],
            'base_premium':     PLAN_CONFIG[plan]['base_price'],
            'adjustment':       ADJUSTMENT[label],
            'adjusted_premium': PLAN_CONFIG[plan]['base_price'] + ADJUSTMENT[label],
            'payout_cap':       PLAN_CONFIG[plan]['payout_cap'],
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/detect-fraud', methods=['POST'])
def detect_fraud():
    try:
        d = request.json
        features = [[
            d.get('gps_velocity_kmh',       20),
            d.get('os_mock_flag',            0),
            d.get('ip_change_count',         5),
            d.get('claim_count_30d',         1),
            d.get('time_since_trigger_min', 10),
        ]]

        raw_score   = float(fraud_model.decision_function(features)[0])
        fraud_score = max(0.0, min(1.0, (-raw_score + 0.5)))
        decision    = 'approve' if fraud_score < 0.4 else 'escrow' if fraud_score < 0.7 else 'reject'

        return jsonify({
            'fraud_score': round(fraud_score, 3),
            'decision':    decision,
            'is_anomaly':  bool(fraud_model.predict(features)[0] == -1),
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(port=8000, debug=True)