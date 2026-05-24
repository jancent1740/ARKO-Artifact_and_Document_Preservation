import { Router } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.username, u.email, u.full_name, r.name AS role,
              u.avatar_url, u.assigned_museum, u.is_active
       FROM users u JOIN roles r ON u.role_id = r.id
       ORDER BY u.full_name`
    );
    return res.json(rows);
  } catch (err) {
    console.error('Users list error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.get('/staff', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.username, u.email, u.full_name, u.avatar_url, u.assigned_museum
       FROM users u JOIN roles r ON u.role_id = r.id
       WHERE r.name IN ('staff','volunteer') AND u.is_active = 1
       ORDER BY u.full_name`
    );
    return res.json(rows);
  } catch (err) {
    console.error('Users staff error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.username, u.email, u.full_name, r.name AS role,
              u.avatar_url, u.assigned_museum, u.is_active
       FROM users u JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`, [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    return res.json(rows[0]);
  } catch (err) {
    console.error('Users get error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { username, email, full_name, password, role, assigned_museum } = req.body;
    if (!username || !email || !full_name || !password || !role) {
      return res.status(400).json({ error: 'username, email, full_name, password, role required' });
    }
    const [roleRows] = await pool.query('SELECT id FROM roles WHERE name = ?', [role]);
    if (roleRows.length === 0) return res.status(400).json({ error: 'Invalid role' });
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO users (username, email, password_hash, full_name, role_id, assigned_museum)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [username, email, hash, full_name, roleRows[0].id, assigned_museum || null]
    );
    return res.status(201).json({ id: result.insertId, message: 'User created' });
  } catch (err) {
    console.error('Users create error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  try {
    const fields = [];
    const params = [];
    for (const key of ['username', 'email', 'full_name', 'assigned_museum', 'is_active']) {
      if (req.body[key] !== undefined) { fields.push(`${key} = ?`); params.push(req.body[key]); }
    }
    if (req.body.role !== undefined) {
      const [roleRows] = await pool.query('SELECT id FROM roles WHERE name = ?', [req.body.role]);
      if (roleRows.length === 0) return res.status(400).json({ error: 'Invalid role' });
      fields.push('role_id = ?');
      params.push(roleRows[0].id);
    }
    if (req.body.password !== undefined) {
      const hash = await bcrypt.hash(req.body.password, 10);
      fields.push('password_hash = ?');
      params.push(hash);
    }
    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });
    params.push(req.params.id);
    await pool.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
    return res.json({ message: 'User updated' });
  } catch (err) {
    console.error('Users update error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    await pool.query('UPDATE users SET is_active = 0 WHERE id = ?', [req.params.id]);
    return res.json({ message: 'User deactivated' });
  } catch (err) {
    console.error('Users delete error:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
