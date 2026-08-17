const postgres = require("postgres");
require("dotenv").config({ path: require('path').resolve(__dirname, '.env') });

const sql = postgres(process.env.DATABASE_URL);

module.exports = sql;