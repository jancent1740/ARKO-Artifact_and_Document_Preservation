import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function init() {
  const schema = readFileSync(join(__dirname, '..', 'schema.sql'), 'utf8');
  const seeds  = readFileSync(join(__dirname, '..', 'seeds.sql'),  'utf8');

  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST || 'localhost',
    user:     process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port:     parseInt(process.env.DB_PORT || '3306'),
    multipleStatements: true
  });

  try {
    console.log('Running schema.sql...');
    await conn.query(schema);
    console.log('Running seeds.sql...');
    await conn.query(seeds);
    console.log('Database initialized successfully!');
  } catch (err) {
    console.error('Init failed:', err.message);
  } finally {
    await conn.end();
  }
}

init();
