import { Router } from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM museums ORDER BY name');
    return res.json(rows);
  } catch (err) {
    console.error('Museums list error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
