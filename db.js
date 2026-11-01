
const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '',
    database: 'joyas',
    port: 5432,
    allowExitOnIdle: true
});

module.exports = pool;
