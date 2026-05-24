import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import museumRoutes from './routes/museums.js';
import itemRoutes from './routes/items.js';
import collectionRoutes from './routes/collections.js';
import programRoutes from './routes/programs.js';
import assetRoutes from './routes/digitalAssets.js';
import activityRoutes from './routes/activityLogs.js';
import submissionRoutes from './routes/submissions.js';
import notificationRoutes from './routes/notifications.js';
import lookupRoutes from './routes/lookups.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/museums', museumRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/activity-logs', activityRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/lookups', lookupRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`ARKO API server running on http://localhost:${PORT}`);
});
