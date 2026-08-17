require('dotenv').config({path: '../.env'});
const sql = require('./db');
async function run() {
  const users = await sql`SELECT * FROM app_users`;
  console.log(users);
  process.exit(0);
}
run();
