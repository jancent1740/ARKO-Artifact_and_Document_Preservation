import { Router } from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/read', authenticate, async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]);
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/read-all', authenticate, async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [req.user.id]);
    res.json({ message: 'All marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
