require('dotenv').config()

const pgp_conn = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
}
const pgp = require('pg-promise')()
const pgpDB = pgp(pgp_conn)

module.exports = pgpDB
