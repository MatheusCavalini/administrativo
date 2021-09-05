const myqsl = require('mysql2')

const connection = myqsl.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_SCHEMA,
    password: process.env.DB_PASS
})

module.exports = connection;