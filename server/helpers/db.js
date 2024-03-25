// Load environment configuration
require('dotenv').config()
const { Pool } = require('pg') // PostgreSQL connection pool

// Execute a SQL query
const query = (sql, values = []) => {
    return new Promise(async(resolve, reject) => {
        try {
            const pool = openDb() // Get a pool connection
            const result = await pool.query(sql, values) // Execute query
            resolve(result) // Return results
        } catch (error) {
            reject(error.message) // Handle errors
        }
    })
}

// Create and return a database connection pool
const openDb = () => {
    return new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        ssl: process.env.SSL
    })
}

module.exports = { query } // Make the query function available to other files
