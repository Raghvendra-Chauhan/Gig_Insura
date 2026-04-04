const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect()
    .then(() => console.log('✅ PostgreSQL connected'))
    .catch(err => {
        console.error('❌ PostgreSQL connection failed:', err.message);
        process.exit(1);
    });

module.exports = pool;