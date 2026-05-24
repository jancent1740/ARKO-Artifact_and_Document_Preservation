import 'dotenv/config';
import mysql from 'mysql2/promise';

console.log('CWD:', process.cwd());
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : '(empty)');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_PORT:', process.env.DB_PORT);

try {
  const c = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'arko_db',
    port: parseInt(process.env.DB_PORT || '3306'),
  });
  const [r] = await c.query('SELECT 1 AS test');
  console.log('DB OK:', JSON.stringify(r));
  await c.end();
} catch (e) {
  console.error('DB ERROR:', e.message);
}
