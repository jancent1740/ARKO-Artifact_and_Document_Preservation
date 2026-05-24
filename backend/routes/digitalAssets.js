import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import fs from 'fs';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${path.extname(file.originalname)}`;
    cb(null, unique);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /tiff|tif/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    cb(null, ext ? null : new Error('Only TIFF files are allowed'), ext);
  }
});

const router = Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const { item_id, program_id } = req.query;
    let sql = `SELECT da.*, u.full_name AS uploaded_by_name
               FROM digital_assets da JOIN users u ON da.uploaded_by = u.id WHERE 1=1`;
    const params = [];
    if (item_id) { sql += ' AND da.item_id = ?'; params.push(item_id); }
    if (program_id) { sql += ' AND da.program_id = ?'; params.push(program_id); }
    sql += ' ORDER BY da.created_at DESC';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { program_id, item_id } = req.body;
    if (!program_id || !item_id) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'program_id and item_id required' });
    }

    const fileBuffer = fs.readFileSync(req.file.path);
    const checksum = crypto.createHash('sha256').update(fileBuffer).toString('hex');

    const [result] = await pool.query(
      `INSERT INTO digital_assets (program_id, item_id, uploaded_by, file_name, file_path, file_size, mime_type, checksum)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [program_id, item_id, req.user.id, req.file.originalname, `/uploads/${req.file.filename}`,
       req.file.size, req.file.mimetype, checksum]
    );

    try {
      await pool.query(
        `INSERT INTO integrity_history (digital_asset_id, checksum, health_status, verified_by)
         VALUES (?, ?, ?, ?)`,
        [result.insertId, checksum, 'Healthy', req.user.id]
      );
    } catch {}

    try {
      await pool.query(
        `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details)
         VALUES (?, ?, ?, ?, ?)`,
        [req.user.id, 'Uploaded Asset', 'digital_assets', result.insertId, `Uploaded: ${req.file.originalname}`]
      );
    } catch {}

    res.status(201).json({ id: result.insertId, fileName: req.file.originalname, checksum });
  } catch (err) {
    if (req.file) try { fs.unlinkSync(req.file.path); } catch {}
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/verify', authenticate, async (req, res) => {
  try {
    const [assets] = await pool.query('SELECT * FROM digital_assets WHERE id = ?', [req.params.id]);
    if (assets.length === 0) return res.status(404).json({ error: 'Asset not found' });

    const asset = assets[0];
    const filePath = path.join(__dirname, '..', asset.file_path);
    let status = 'Corrupted';

    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      const currentChecksum = crypto.createHash('sha256').update(fileBuffer).toString('hex');
      status = currentChecksum === asset.checksum ? 'Healthy' : 'Corrupted';
    }

    try {
      await pool.query(
        `INSERT INTO integrity_history (digital_asset_id, checksum, health_status, verified_by)
         VALUES (?, ?, ?, ?)`,
        [req.params.id, asset.checksum, status, req.user.id]
      );
    } catch {}

    await pool.query(
      'UPDATE digital_assets SET health_status = ? WHERE id = ?',
      [status, req.params.id]
    );

    res.json({ id: req.params.id, health_status: status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
