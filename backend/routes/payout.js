const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { protect } = require('../middleware/authMiddleware');


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

module.exports = router;