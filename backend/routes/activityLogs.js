import { Router } from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const { user_id, entity_type, entity_id, limit = 50 } = req.query;
    let sql = `SELECT al.*, u.full_name AS user_name
               FROM activity_logs al JOIN users u ON al.user_id = u.id WHERE 1=1`;
    const params = [];
    if (user_id) { sql += ' AND al.user_id = ?'; params.push(user_id); }
    if (entity_type) { sql += ' AND al.entity_type = ?'; params.push(entity_type); }
    if (entity_id) { sql += ' AND al.entity_id = ?'; params.push(entity_id); }
    sql += ' ORDER BY al.created_at DESC LIMIT ?';
    params.push(parseInt(limit));
    const [rows] = await pool.query(sql, params);
    return res.json(rows);
  } catch (err) {
    console.error('Activity logs list error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
