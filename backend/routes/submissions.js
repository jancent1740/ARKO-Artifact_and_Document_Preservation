import { Router } from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const { status } = req.query;
    let sql = `SELECT s.*, sub.full_name AS submitted_by_name, rev.full_name AS reviewed_by_name,
               i.title AS item_title, i.item_identifier
               FROM submissions s
               JOIN users sub ON s.submitted_by = sub.id
               LEFT JOIN users rev ON s.reviewed_by = rev.id
               LEFT JOIN items i ON s.item_id = i.id
               WHERE 1=1`;
    const params = [];
    if (status) { sql += ' AND s.status = ?'; params.push(status); }
    sql += ' ORDER BY s.created_at DESC';
    const [rows] = await pool.query(sql, params);
    return res.json(rows);
  } catch (err) {
    console.error('Submissions list error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { item_id, notes } = req.body;
    const [result] = await pool.query(
      'INSERT INTO submissions (item_id, submitted_by, notes) VALUES (?, ?, ?)',
      [item_id || null, req.user.id, notes || null]
    );

    try {
      await pool.query(
        `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details)
         VALUES (?, ?, ?, ?, ?)`,
        [req.user.id, 'Submitted Item', 'submissions', result.insertId, `Submitted item ${item_id || ''} for review`]
      );
    } catch {}

    return res.status(201).json({ id: result.insertId, message: 'Submission created' });
  } catch (err) {
    console.error('Submissions create error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.put('/:id/review', authenticate, async (req, res) => {
  try {
    const { status, notes } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be Approved or Rejected' });
    }

    await pool.query(
      'UPDATE submissions SET status = ?, reviewed_by = ?, notes = COALESCE(?, notes) WHERE id = ?',
      [status, req.user.id, notes || null, req.params.id]
    );

    if (status === 'Approved') {
      try {
        const [sub] = await pool.query('SELECT item_id FROM submissions WHERE id = ?', [req.params.id]);
        if (sub[0]?.item_id) {
          await pool.query('UPDATE items SET status = ? WHERE id = ?', ['Published', sub[0].item_id]);
        }
      } catch {}
    }

    try {
      await pool.query(
        `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details)
         VALUES (?, ?, ?, ?, ?)`,
        [req.user.id, `${status} Submission`, 'submissions', parseInt(req.params.id), `${status} submission ${req.params.id}`]
      );
    } catch {}

    return res.json({ message: `Submission ${status.toLowerCase()}` });
  } catch (err) {
    console.error('Submissions review error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
