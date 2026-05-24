import { Router } from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, COUNT(i.id) AS item_count
       FROM collections c LEFT JOIN items i ON c.id = i.collection_id
       GROUP BY c.id ORDER BY c.name`
    );
    return res.json(rows);
  } catch (err) {
    console.error('Collections list error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.*, COUNT(i.id) AS item_count
       FROM collections c LEFT JOIN items i ON c.id = i.collection_id
       WHERE c.id = ?
       GROUP BY c.id`, [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Collection not found' });
    return res.json(rows[0]);
  } catch (err) {
    console.error('Collections get error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const [result] = await pool.query(
      'INSERT INTO collections (name, description) VALUES (?, ?)',
      [name, description || null]
    );
    return res.status(201).json({ id: result.insertId, message: 'Collection created' });
  } catch (err) {
    console.error('Collections create error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const fields = [];
    const params = [];
    for (const key of ['name', 'description']) {
      if (req.body[key] !== undefined) { fields.push(`${key} = ?`); params.push(req.body[key]); }
    }
    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });
    params.push(req.params.id);
    await pool.query(`UPDATE collections SET ${fields.join(', ')} WHERE id = ?`, params);
    return res.json({ message: 'Collection updated' });
  } catch (err) {
    console.error('Collections update error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
