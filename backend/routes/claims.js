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
         p.plan_type, p.payout_cap
       FROM claims c
       JOIN trigger_events te ON te.id = c.trigger_event_id
       JOIN policies p        ON p.id  = c.policy_id
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
         te.event_type, te.zone, te.raw_value
       FROM claims c
       JOIN users u            ON u.id  = c.user_id
       JOIN trigger_events te  ON te.id = c.trigger_event_id
       ORDER BY c.created_at DESC`
        );
        res.json({ claims: result.rows });
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
            message: `✅ Manual ${event_type} trigger fired in ${zone}`,
            note: 'Claims auto-created for all workers with active policies in this zone'
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