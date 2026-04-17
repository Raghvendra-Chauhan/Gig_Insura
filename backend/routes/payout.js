const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { protect } = require('../middleware/authMiddleware');
const { processPayout } = require('../services/triggerEngine');


// GET /api/payout/my
router.get('/my', protect, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
         p.id, p.amount, p.payout_status, p.razorpay_txn_id,
         p.payment_mode, p.created_at,
         c.status AS claim_status,
         te.event_type, te.zone
       FROM payouts p
       JOIN claims c          ON c.id  = p.claim_id
       JOIN trigger_events te ON te.id = c.trigger_event_id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC`,
            [req.user.id]
        );

        const total = result.rows
            .filter(r => r.payout_status === 'success')
            .reduce((sum, r) => sum + parseFloat(r.amount), 0);

        res.json({ payouts: result.rows, totalPaid: total });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// POST /api/payout/simulate  (Admin — Razorpay test-mode simulation)
router.post('/simulate', protect, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }

    const { claim_id } = req.body;
    if (!claim_id) {
        return res.status(400).json({ message: 'claim_id is required' });
    }

    try {
        // Fetch claim details
        const claimResult = await pool.query(
            `SELECT c.id, c.user_id, c.expected_payout, c.status
             FROM claims c WHERE c.id = $1`,
            [claim_id]
        );

        if (claimResult.rows.length === 0) {
            return res.status(404).json({ message: 'Claim not found' });
        }

        const claim = claimResult.rows[0];

        if (claim.status === 'paid') {
            return res.status(400).json({ message: 'Claim has already been paid' });
        }

        if (!['approved', 'escrow'].includes(claim.status)) {
            return res.status(400).json({ message: 'Only approved or escrow claims can be paid out' });
        }

        // Run the payout simulation
        await processPayout(claim.id, claim.user_id, claim.expected_payout);

        // Fetch the resulting payout record
        const payoutResult = await pool.query(
            `SELECT * FROM payouts WHERE claim_id = $1 ORDER BY created_at DESC LIMIT 1`,
            [claim_id]
        );

        res.json({
            message: 'Razorpay payout simulated successfully',
            payout: payoutResult.rows[0],
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// GET /api/payout/all (Admin)
router.get('/all', protect, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    try {
        const result = await pool.query(
            `SELECT
         p.id, p.amount, p.payout_status, p.razorpay_txn_id,
         p.payment_mode, p.created_at,
         u.name, u.phone,
         te.event_type, te.zone
       FROM payouts p
       JOIN claims c          ON c.id  = p.claim_id
       JOIN users u           ON u.id  = p.user_id
       JOIN trigger_events te ON te.id = c.trigger_event_id
       ORDER BY p.created_at DESC`
        );

        const total = result.rows
            .filter(r => r.payout_status === 'success')
            .reduce((sum, r) => sum + parseFloat(r.amount), 0);

        res.json({ payouts: result.rows, totalPaid: total });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;