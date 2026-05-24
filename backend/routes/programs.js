import { Router } from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const { status, user_id } = req.query;
    let sql = `SELECT p.*, u.full_name AS created_by_name,
      (SELECT COUNT(*) FROM program_assignments WHERE program_id = p.id) AS staff_count,
      (SELECT COUNT(*) FROM program_items WHERE program_id = p.id) AS item_count
      FROM programs p JOIN users u ON p.created_by = u.id WHERE 1=1`;
    const params = [];
    if (status) { sql += ' AND p.status = ?'; params.push(status); }
    if (user_id) {
      sql += ' AND p.id IN (SELECT program_id FROM program_assignments WHERE user_id = ?)';
      params.push(user_id);
    }
    sql += ' ORDER BY p.created_at DESC';
    const [rows] = await pool.query(sql, params);
    return res.json(rows);
  } catch (err) {
    console.error('Programs list error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const [programs] = await pool.query(
      `SELECT p.*, u.full_name AS created_by_name
       FROM programs p JOIN users u ON p.created_by = u.id WHERE p.id = ?`, [req.params.id]
    );
    if (programs.length === 0) return res.status(404).json({ error: 'Program not found' });

    const [staff] = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.assigned_museum
       FROM program_assignments pa JOIN users u ON pa.user_id = u.id
       WHERE pa.program_id = ?`, [req.params.id]
    );

    const [items] = await pool.query(
      `SELECT i.id, i.item_identifier, i.title, i.type_name, i.status
       FROM program_items pi JOIN items i ON pi.item_id = i.id
       WHERE pi.program_id = ?`, [req.params.id]
    );

    const [collections] = await pool.query(
      `SELECT c.id, c.name
       FROM program_collections pc JOIN collections c ON pc.collection_id = c.id
       WHERE pc.program_id = ?`, [req.params.id]
    );

    return res.json({ ...programs[0], staff, items, collections });
  } catch (err) {
    console.error('Programs get error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description, program_type, start_date, end_date } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const [result] = await pool.query(
      `INSERT INTO programs (name, description, program_type, created_by, start_date, end_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description || null, program_type || 'manual', req.user.id, start_date || null, end_date || null]
    );

    try {
      await pool.query(
        `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details)
         VALUES (?, ?, ?, ?, ?)`,
        [req.user.id, 'Created Program', 'programs', result.insertId, `Created program: ${name}`]
      );
    } catch {}

    return res.status(201).json({ id: result.insertId, message: 'Program created' });
  } catch (err) {
    console.error('Programs create error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const fields = [];
    const params = [];
    for (const key of ['name','description','program_type','status','start_date','end_date']) {
      if (req.body[key] !== undefined) { fields.push(`${key} = ?`); params.push(req.body[key]); }
    }
    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });
    params.push(req.params.id);
    await pool.query(`UPDATE programs SET ${fields.join(', ')} WHERE id = ?`, params);
    return res.json({ message: 'Program updated' });
  } catch (err) {
    console.error('Programs update error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.post('/:id/assign', authenticate, async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ error: 'user_id required' });
    await pool.query('INSERT IGNORE INTO program_assignments (program_id, user_id) VALUES (?, ?)', [req.params.id, user_id]);

    try {
      await pool.query(
        `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details)
         VALUES (?, ?, ?, ?, ?)`,
        [req.user.id, 'Assigned Staff', 'programs', parseInt(req.params.id), `Assigned user ${user_id} to program ${req.params.id}`]
      );
    } catch {}

    return res.json({ message: 'Staff assigned' });
  } catch (err) {
    console.error('Programs assign error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.post('/:id/collections', authenticate, async (req, res) => {
  try {
    const { collection_id } = req.body;
    if (!collection_id) return res.status(400).json({ error: 'collection_id required' });
    await pool.query('INSERT IGNORE INTO program_collections (program_id, collection_id) VALUES (?, ?)', [req.params.id, collection_id]);
    return res.json({ message: 'Collection added to program' });
  } catch (err) {
    console.error('Programs add collection error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.delete('/:id/collections/:collectionId', authenticate, async (req, res) => {
  try {
    await pool.query('DELETE FROM program_collections WHERE program_id = ? AND collection_id = ?', [req.params.id, req.params.collectionId]);
    return res.json({ message: 'Collection removed from program' });
  } catch (err) {
    console.error('Programs remove collection error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.delete('/:id/assign/:userId', authenticate, async (req, res) => {
  try {
    await pool.query('DELETE FROM program_assignments WHERE program_id = ? AND user_id = ?', [req.params.id, req.params.userId]);
    return res.json({ message: 'Staff unassigned' });
  } catch (err) {
    console.error('Programs unassign error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.post('/:id/items', authenticate, async (req, res) => {
  try {
    const { item_id } = req.body;
    if (!item_id) return res.status(400).json({ error: 'item_id required' });
    await pool.query('INSERT IGNORE INTO program_items (program_id, item_id, added_by) VALUES (?, ?, ?)', [req.params.id, item_id, req.user.id]);
    return res.json({ message: 'Item added to program' });
  } catch (err) {
    console.error('Programs add item error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.delete('/:id/items/:itemId', authenticate, async (req, res) => {
  try {
    await pool.query('DELETE FROM program_items WHERE program_id = ? AND item_id = ?', [req.params.id, req.params.itemId]);
    return res.json({ message: 'Item removed from program' });
  } catch (err) {
    console.error('Programs remove item error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
