import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// These match the ENUM values defined in schema.sql exactly
const DOCUMENT_TYPES = [
  'Letter', 'Manuscript', 'Report', 'Certificate', 'Map',
  'Newspaper', 'Book', 'Other',
];

const ARTIFACT_TYPES = [
  'Pottery', 'Tool', 'Weapon', 'Textile', 'Jewelry',
  'Painting', 'Sculpture', 'Other',
];

router.get('/document-types', authenticate, (req, res) => {
  res.json(DOCUMENT_TYPES);
});

router.get('/artifact-types', authenticate, (req, res) => {
  res.json(ARTIFACT_TYPES);
});

export default router;
