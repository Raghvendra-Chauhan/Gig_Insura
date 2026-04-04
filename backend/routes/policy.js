const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

const PLAN_CONFIG = {
    basic: { base_price: 15, payout_cap: 200 },
    standard: { base_price: 30, payout_cap: 400 },
    pro: { base_price: 50, payout_cap: 700 },
};


// POST /api/policy/quote
router.post('/quote', protect, async (req, res) => {
    const { plan_type } = req.body;

    if (!PLAN_CONFIG[plan_type]) {
        return res.status(400).json({ message: 'Invalid plan. Choose basic, standard, or pro' });
    }

    try {
        const profileResult = await pool.query(
            `SELECT rp.*, u.city
       FROM rider_profiles rp
       JOIN users u ON u.id = rp.user_id
       WHERE rp.user_id = $1`,
            [req.user.id]
        );

        if (profileResult.rows.length === 0) {
            return res.status(404).json({ message: 'Rider profile not found' });
        }

        const profile = profileResult.rows[0];

        const mlRes = await axios.post(
            `${process.env.ML_SERVICE_URL}/predict-risk`,
            {
                zone_disruption_freq: 0.5,
                aqi_30day_avg: 150,
                rainfall_seasonal: 60,
                temp_max_avg: 38,
                hours_per_day: profile.weekly_income_baseline / 7 / 100,
                months_active: 6,
                plan_type,
            }
        );

        const { risk_label, risk_score, adjusted_premium, payout_cap, adjustment } = mlRes.data;

        // Upsert risk profile
        await pool.query(
            `INSERT INTO risk_profiles
         (user_id, risk_score, risk_label, premium_adjustment, model_version)
       VALUES ($1, $2, $3, $4, 'v1.0')
       ON CONFLICT (user_id)
       DO UPDATE SET
         risk_score         = EXCLUDED.risk_score,
         risk_label         = EXCLUDED.risk_label,
         premium_adjustment = EXCLUDED.premium_adjustment,
         updated_at         = NOW()`,
            [req.user.id, risk_score, risk_label, adjustment]
        );

        await pool.query(
            'UPDATE rider_profiles SET risk_score = $1 WHERE user_id = $2',
            [risk_score, req.user.id]
        );

        res.json({
            plan_type,
            risk_label,
            risk_score,
            base_premium: PLAN_CONFIG[plan_type].base_price,
            adjustment,
            adjusted_premium,
            payout_cap,
            message: `Your AI-adjusted ${plan_type} plan costs ₹${adjusted_premium}/week`
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// POST /api/policy/create
router.post('/create', protect, async (req, res) => {
    const { plan_type, premium_paid, payout_cap } = req.body;

    if (!PLAN_CONFIG[plan_type]) {
        return res.status(400).json({ message: 'Invalid plan type' });
    }

    try {
        const existing = await pool.query(
            `SELECT id FROM policies WHERE user_id = $1 AND status = 'active'`,
            [req.user.id]
        );

        if (existing.rows.length > 0) {
            return res.status(400).json({ message: 'You already have an active policy this week' });
        }

        const now = new Date();
        const weekEnd = new Date(now);
        weekEnd.setDate(weekEnd.getDate() + 7);

        const result = await pool.query(
            `INSERT INTO policies
         (user_id, plan_type, premium_paid, payout_cap,
          coverage_week_start, coverage_week_end, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'active')
       RETURNING *`,
            [req.user.id, plan_type, premium_paid, payout_cap, now, weekEnd]
        );

        await pool.query(
            'UPDATE rider_profiles SET active_plan = $1 WHERE user_id = $2',
            [plan_type, req.user.id]
        );

        res.status(201).json({
            message: `✅ ${plan_type} policy activated until ${weekEnd.toDateString()}`,
            policy: result.rows[0]
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// GET /api/policy/active
router.get('/active', protect, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM policies
       WHERE user_id = $1 AND status = 'active'
       ORDER BY created_at DESC LIMIT 1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No active policy found' });
        }

        res.json({ policy: result.rows[0] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// GET /api/policy/all
router.get('/all', protect, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM policies WHERE user_id = $1 ORDER BY created_at DESC`,
            [req.user.id]
        );
        res.json({ policies: result.rows });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;