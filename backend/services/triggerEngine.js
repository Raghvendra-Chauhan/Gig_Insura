const axios = require('axios');
const cron = require('node-cron');
const pool = require('../config/db');

const THRESHOLDS = {
    rainfall_mm: 50,
    aqi: 400,
    temperature_c: 45,
};

const ZONES = [
    { name: 'delhi-south', lat: 28.5355, lon: 77.3910 },
    { name: 'delhi-north', lat: 28.7041, lon: 77.1025 },
    { name: 'noida', lat: 28.5355, lon: 77.3910 },
    { name: 'mumbai-central', lat: 19.0760, lon: 72.8777 },
];

// Generate realistic per-claim fraud signals for demo purposes
function generateFraudSignals() {
    const gps_velocity_kmh = parseFloat((Math.random() * 75 + 5).toFixed(1));
    const os_mock_flag = Math.random() < 0.25 ? 1 : 0;
    const ip_change_count = Math.floor(Math.random() * 12);
    const claim_count_30d = Math.floor(Math.random() * 4) + 1;
    const time_since_trigger_min = Math.floor(Math.random() * 20) + 1;
    return { gps_velocity_kmh, os_mock_flag, ip_change_count, claim_count_30d, time_since_trigger_min };
}


async function checkWeather(zone) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather` +
            `?lat=${zone.lat}&lon=${zone.lon}` +
            `&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;

        const { data } = await axios.get(url);
        const rainfall = data.rain?.['1h'] || 0;
        const temp = data.main?.temp || 30;

        if (rainfall > THRESHOLDS.rainfall_mm) {
            await saveTriggerAndCreateClaims(
                zone.name, 'rainfall', rainfall, THRESHOLDS.rainfall_mm, 'OpenWeatherMap'
            );
        }
        if (temp > THRESHOLDS.temperature_c) {
            await saveTriggerAndCreateClaims(
                zone.name, 'heatwave', temp, THRESHOLDS.temperature_c, 'OpenWeatherMap'
            );
        }
    } catch (err) {
        console.error(`Weather check failed [${zone.name}]:`, err.message);
    }
}


async function saveTriggerAndCreateClaims(zone, eventType, rawValue, threshold, source) {
    try {
        const triggerResult = await pool.query(
            `INSERT INTO trigger_events
         (zone, event_type, severity, data_source, raw_value, threshold_value, threshold_breached)
       VALUES ($1, $2, $3, $4, $5, $6, TRUE)
       RETURNING *`,
            [zone, eventType, rawValue, source, rawValue, threshold]
        );

        const trigger = triggerResult.rows[0];
        console.log(`Trigger [${eventType}] in ${zone} | Value: ${rawValue}`);

        const workers = await pool.query(
            `SELECT p.id AS policy_id, p.user_id, p.payout_cap
       FROM policies p
       JOIN rider_profiles rp ON rp.user_id = p.user_id
       WHERE rp.delivery_zone = $1 AND p.status = 'active'`,
            [zone]
        );

        for (const worker of workers.rows) {
            await autoCreateClaim(worker, trigger);
        }

    } catch (err) {
        console.error('saveTriggerAndCreateClaims error:', err.message);
    }
}


async function autoCreateClaim(worker, trigger) {
    try {
        const existing = await pool.query(
            `SELECT id FROM claims WHERE policy_id = $1 AND trigger_event_id = $2`,
            [worker.policy_id, trigger.id]
        );
        if (existing.rows.length > 0) return;

        // Generate real per-claim fraud signals
        const signals = generateFraudSignals();

        const fraudRes = await axios.post(
            `${process.env.ML_SERVICE_URL}/detect-fraud`,
            signals
        );

        const { fraud_score, decision } = fraudRes.data;
        const statusMap = { approve: 'approved', escrow: 'escrow', reject: 'rejected' };
        const status = statusMap[decision];

        const claimResult = await pool.query(
            `INSERT INTO claims
         (policy_id, user_id, trigger_event_id, expected_payout, fraud_score, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [worker.policy_id, worker.user_id, trigger.id, worker.payout_cap, fraud_score, status]
        );

        const claim = claimResult.rows[0];
        console.log(`Claim [${claim.id}] -> Status: ${status} | Fraud Score: ${fraud_score} | GPS: ${signals.gps_velocity_kmh}km/h | OS Mock: ${signals.os_mock_flag}`);

        // Store detailed fraud signals in fraud_logs
        await pool.query(
            `INSERT INTO fraud_logs
         (claim_id, gps_velocity_flag, os_mock_flag, ip_consistency_flag, duplicate_flag)
       VALUES ($1, $2, $3, $4, $5)`,
            [
                claim.id,
                signals.gps_velocity_kmh > 50,
                signals.os_mock_flag === 1,
                signals.ip_change_count > 8,
                false,
            ]
        );

        if (status === 'approved') {
            await processPayout(claim.id, worker.user_id, worker.payout_cap);
        }

    } catch (err) {
        console.error('autoCreateClaim error:', err.message);
    }
}


async function processPayout(claimId, userId, amount) {
    try {
        const txnId = `rzp_test_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

        await pool.query(
            `INSERT INTO payouts
         (claim_id, user_id, amount, payment_mode, razorpay_txn_id, payout_status)
       VALUES ($1, $2, $3, 'razorpay_upi', $4, 'success')`,
            [claimId, userId, amount, txnId]
        );

        await pool.query(
            `UPDATE claims SET status = 'paid', updated_at = NOW() WHERE id = $1`,
            [claimId]
        );

        console.log(`Payout Rs.${amount} | TxnID: ${txnId}`);
    } catch (err) {
        console.error('processPayout error:', err.message);
    }
}


async function manualTrigger(zone, eventType, value) {
    console.log(`Manual trigger: ${eventType} in ${zone} (value: ${value})`);
    const thresholdMap = {
        rainfall: THRESHOLDS.rainfall_mm,
        aqi: THRESHOLDS.aqi,
        heatwave: THRESHOLDS.temperature_c,
        curfew: 1,
        flood: 1,
    };
    await saveTriggerAndCreateClaims(
        zone, eventType, value, thresholdMap[eventType] || 1, 'manual-demo'
    );
}


function startTriggerEngine() {
    console.log('Trigger engine started — polling every 2 minutes');
    cron.schedule('*/2 * * * *', async () => {
        console.log(`[${new Date().toLocaleTimeString()}] Checking disruption feeds...`);
        for (const zone of ZONES) {
            await checkWeather(zone);
        }
    });
}

module.exports = { startTriggerEngine, manualTrigger, processPayout };