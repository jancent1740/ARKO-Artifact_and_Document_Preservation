import { Router } from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const { status, type, collection_id, search, sort, order, page = 1, limit = 50 } = req.query;
    let sql = `SELECT i.id, i.item_identifier, i.title, i.description,
      i.type_name, i.document_type, i.artifact_type,
      i.collection_id, c.name AS collection_name,
      i.author, i.physical_dimensions, i.material, i.condition, i.status,
      i.created_by, u.full_name AS created_by_name,
      i.created_at, i.updated_at
      FROM items i
      LEFT JOIN collections c ON i.collection_id = c.id
      LEFT JOIN users u ON i.created_by = u.id WHERE 1=1`;
    const params = [];

    if (status) { sql += ' AND i.status = ?'; params.push(status); }
    if (type) { sql += ' AND i.type_name = ?'; params.push(type); }
    if (collection_id) { sql += ' AND i.collection_id = ?'; params.push(collection_id); }
    if (search) { sql += ' AND (i.title LIKE ? OR i.item_identifier LIKE ? OR i.author LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }

    const totalSql = sql.replace(/SELECT [\s\S]*? FROM/, 'SELECT COUNT(*) AS total FROM');
    const [countResult] = await pool.query(totalSql, params);
    const total = countResult[0].total;

    const sortCol = sort || 'i.created_at';
    const sortDir = (order || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    sql += ` ORDER BY ${sortCol} ${sortDir}`;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    sql += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [rows] = await pool.query(sql, params);
    return res.json({ items: rows, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error('Items list error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT i.id, i.item_identifier, i.title, i.description,
       i.type_name, i.document_type, i.artifact_type,
       i.collection_id, c.name AS collection_name,
       i.author, i.physical_dimensions, i.material, i.condition, i.status,
       i.created_by, u.full_name AS created_by_name,
       i.created_at, i.updated_at
       FROM items i LEFT JOIN collections c ON i.collection_id = c.id
       LEFT JOIN users u ON i.created_by = u.id WHERE i.id = ?`, [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Item not found' });
    return res.json(rows[0]);
  } catch (err) {
    console.error('Items get error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { item_identifier, title, description, type_name, document_type, artifact_type,
            collection_id, author, physical_dimensions, material, condition, status } = req.body;

    const [result] = await pool.query(
      `INSERT INTO items (item_identifier, title, description, type_name, document_type, artifact_type,
        collection_id, author, physical_dimensions, material, \`condition\`, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [item_identifier || `DEV-${Date.now()}`, title, description || null, type_name, document_type || null,
       artifact_type || null, collection_id || null, author || null,
       physical_dimensions || null, material || null, condition || null,
       status || 'Draft', req.user.id]
    );

    try {
      await pool.query(
        `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details)
         VALUES (?, ?, ?, ?, ?)`,
        [req.user.id, 'Created Item', 'items', result.insertId, `Created item: ${title}`]
      );
    } catch {}

    return res.status(201).json({ id: result.insertId, message: 'Item created' });
  } catch (err) {
    console.error('Items create error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const fields = [];
    const params = [];
    for (const key of ['title','description','type_name','document_type','artifact_type',
                        'collection_id','author','physical_dimensions','material','condition','status']) {
      if (req.body[key] !== undefined) {
        const col = key === 'condition' ? `\`${key}\`` : key;
        fields.push(`${col} = ?`);
        params.push(req.body[key]);
      }
    }
    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });
    params.push(req.params.id);
    await pool.query(`UPDATE items SET ${fields.join(', ')} WHERE id = ?`, params);

    try {
      await pool.query(
        `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details)
         VALUES (?, ?, ?, ?, ?)`,
        [req.user.id, 'Updated Item', 'items', parseInt(req.params.id), `Updated item #${req.params.id}`]
      );
    } catch {}

    return res.json({ message: 'Item updated' });
  } catch (err) {
    console.error('Items update error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    await pool.query('DELETE FROM items WHERE id = ?', [req.params.id]);
    return res.json({ message: 'Item deleted' });
  } catch (err) {
    console.error('Items delete error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
