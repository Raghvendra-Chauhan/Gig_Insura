const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });


// POST /api/auth/register
router.post('/register', async (req, res) => {
    const {
        name, phone, password, city, delivery_platform,
        delivery_zone, work_schedule, weekly_income_baseline
    } = req.body;

    if (!name || !phone || !password || !city ||
        !delivery_platform || !delivery_zone || !weekly_income_baseline) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const existing = await client.query(
            'SELECT id FROM users WHERE phone = $1', [phone]
        );
        if (existing.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Phone number already registered' });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const userResult = await client.query(
            `INSERT INTO users (name, phone, password_hash, city, delivery_platform)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, phone, city, delivery_platform, role`,
            [name, phone, password_hash, city, delivery_platform]
        );
        const user = userResult.rows[0];

        await client.query(
            `INSERT INTO rider_profiles
         (user_id, delivery_zone, work_schedule, weekly_income_baseline)
       VALUES ($1, $2, $3, $4)`,
            [user.id, delivery_zone, work_schedule || 'full-day', weekly_income_baseline]
        );

        await client.query('COMMIT');

        res.status(201).json({
            message: 'Registration successful',
            token: generateToken(user.id),
            user
        });

    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: err.message });
    } finally {
        client.release();
    }
});


// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { phone, password } = req.body;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE phone = $1', [phone]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid phone or password' });
        }

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({ message: 'Invalid phone or password' });
        }

        res.json({
            message: 'Login successful',
            token: generateToken(user.id),
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                city: user.city,
                delivery_platform: user.delivery_platform,
                role: user.role
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// GET /api/auth/profile
router.get('/profile', protect, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
         u.id, u.name, u.phone, u.city, u.delivery_platform, u.role,
         rp.delivery_zone, rp.work_schedule,
         rp.weekly_income_baseline, rp.active_plan, rp.risk_score
       FROM users u
       LEFT JOIN rider_profiles rp ON rp.user_id = u.id
       WHERE u.id = $1`,
            [req.user.id]
        );
        res.json({ profile: result.rows[0] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;