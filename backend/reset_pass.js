require('dotenv').config();
const bcrypt = require('bcryptjs');
const sql = require('./db');

async function run() {
  try {
    const hash = await bcrypt.hash('Admin1234!', 10);
    await sql`UPDATE app_users SET password_hash = ${hash} WHERE email = 'darioquintas@yahoo.com'`;
    console.log("Password reset successfully to 'Admin1234!'");
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
run();
