const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { protect } = require('../middleware/authMiddleware');
const { manualTrigger } = require('../services/triggerEngine');


// GET /api/claims/my
router.get('/my', protect, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
         c.id, c.status, c.expected_payout, c.fraud_score,
         c.created_at, c.updated_at,
         te.event_type, te.zone, te.raw_value, te.data_source,
         p.plan_type, p.payout_cap,
         po.razorpay_txn_id, po.payment_mode, po.payout_status,
         fl.gps_velocity_flag, fl.os_mock_flag, fl.ip_consistency_flag, fl.duplicate_flag
       FROM claims c
       JOIN trigger_events te ON te.id = c.trigger_event_id
       JOIN policies p        ON p.id  = c.policy_id
       LEFT JOIN payouts po   ON po.claim_id = c.id
       LEFT JOIN fraud_logs fl ON fl.claim_id = c.id
       WHERE c.user_id = $1
       ORDER BY c.created_at DESC`,
            [req.user.id]
        );
        res.json({ claims: result.rows });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// GET /api/claims/all (Admin)
router.get('/all', protect, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    try {
        const result = await pool.query(
            `SELECT
         c.id, c.status, c.expected_payout, c.fraud_score, c.created_at,
         u.name, u.phone, u.delivery_platform,
         te.event_type, te.zone, te.raw_value,
         po.razorpay_txn_id, po.payout_status,
         fl.gps_velocity_flag, fl.os_mock_flag, fl.ip_consistency_flag, fl.duplicate_flag
       FROM claims c
       JOIN users u            ON u.id  = c.user_id
       JOIN trigger_events te  ON te.id = c.trigger_event_id
       LEFT JOIN payouts po    ON po.claim_id = c.id
       LEFT JOIN fraud_logs fl ON fl.claim_id = c.id
       ORDER BY c.created_at DESC`
        );
        res.json({ claims: result.rows });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// GET /api/claims/stats (Admin)
router.get('/stats', protect, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    try {
        const totals = await pool.query(
            `SELECT
         COUNT(*) AS total,
         COUNT(*) FILTER (WHERE status = 'approved') AS approved,
         COUNT(*) FILTER (WHERE status = 'paid')     AS paid,
         COUNT(*) FILTER (WHERE status = 'escrow')   AS escrow,
         COUNT(*) FILTER (WHERE status = 'rejected') AS rejected,
         COALESCE(SUM(expected_payout) FILTER (WHERE status IN ('approved','paid')), 0) AS total_payout
       FROM claims`
        );
        const fraud = await pool.query(
            `SELECT
         COUNT(*) FILTER (WHERE gps_velocity_flag = TRUE) AS gps_flagged,
         COUNT(*) FILTER (WHERE os_mock_flag = TRUE)      AS os_flagged,
         COUNT(*) FILTER (WHERE ip_consistency_flag = TRUE) AS ip_flagged
       FROM fraud_logs`
        );
        res.json({ stats: totals.rows[0], fraud: fraud.rows[0] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// POST /api/claims/trigger/manual
router.post('/trigger/manual', protect, async (req, res) => {
    const { zone, event_type, value } = req.body;
    try {
        await manualTrigger(
            zone || 'delhi-south',
            event_type || 'rainfall',
            value || 60
        );
        res.json({
            message: `Manual ${event_type} trigger fired in ${zone}`,
            note: 'Claims auto-created for all workers with active policies in this zone',
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// PATCH /api/claims/:id/review (Admin)
router.patch('/:id/review', protect, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    const { decision, notes } = req.body;
    if (!['approved', 'rejected'].includes(decision)) {
        return res.status(400).json({ message: 'decision must be approved or rejected' });
    }
    try {
        const result = await pool.query(
            `UPDATE claims
       SET status = $1, reviewer_notes = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
            [decision, notes || null, req.params.id]
        );
        res.json({ message: `Claim ${decision}`, claim: result.rows[0] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;