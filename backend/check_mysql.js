import mysql from 'mysql2/promise';
(async () => {
  const c = await mysql.createConnection({ host: '127.0.0.1', user: 'root', password: 'root', port: 3306 });
  const [r] = await c.query("SELECT host, user, plugin FROM mysql.user WHERE user='root'");
  console.log(JSON.stringify(r, null, 2));
  await c.end();
})();
