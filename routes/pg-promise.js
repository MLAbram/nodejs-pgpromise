require('dotenv').config()

const initOptions = {
    // initialization options;
}

const pgp = require('pg-promise')(initOptions)

const cn = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
}
const db = pgp(cn)

module.exports = {pgp, db}