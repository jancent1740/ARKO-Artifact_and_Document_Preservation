import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import 'dotenv/config';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'arko_jwt_secret_2026';

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const [rows] = await pool.query(
      `SELECT u.*, r.name AS role_name FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email = ? AND u.is_active = 1`, [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role_name, name: user.full_name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id, email: user.email, name: user.full_name, role: user.role_name,
        username: user.username, avatarUrl: user.avatar_url, assignedMuseum: user.assigned_museum
      }
    });
  } catch (err) {
    console.error('Auth error:', err?.message || err || 'unknown');
    res.status(500).json({ error: err?.message || 'Unknown error' });
  }
});

export default router;
