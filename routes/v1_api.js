const express = require('express')
const app = express()
// const pgpDB = require('./pgp_db')
const pgp = require('pg-promise')()

require('dotenv').config()

app.get('/', (req, res) => {
	res.status(200).json({message: 'API v1'})
})

// app.get('/getAllContacts', async (req, res) => {
// 	pgpDB.any('select first_name,last_name,email,aud_src_t from dev.nodejs_pgpromise;')
// 		.then((results) => {
// 			return res.status(200).json(results)
// 		})
// 		.catch(error => {
// 			return res.status(400).json({error: error.message})
// 		})
// })

app.get('/insertBulkContacts', async (req, res) => {
	const pgp_conn = {
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		database: process.env.DB_DATABASE,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD
	}
	const pgp_db = pgp(pgp_conn)
	// const cs = new pgp.helpers.ColumnSet(['first_name','last_name','email'], {table: 'dev.nodejs_pgpromise'})
	const cs = new pgp.helpers.ColumnSet(['first_name','last_name','email'], {table: {table: 'nodejs_pgpromise', schema: 'dev'}})
	const bulkContacts = [{"first_name":"Sherrie","last_name":"Ghiotto","email":"sghiotto0@nba.com"},
		{"first_name":"Nedi","last_name":"Pretious","email":"npretious1@geocities.com"}]
	const query = pgp.helpers.insert(bulkContacts, cs)
	await pgp_db.none(query)
		.then(results => {
			return res.status(400).json({status: 'ok'})
		})
		.catch(error => {
			return res.status(400).json({error: error.message})
		})
})

// app.post('/insertContact', async (req, res) => {
// 	pgpDB.none('insert into dev.nodejs_pgpromise (first_name,last_name,email,aud_src_t) values ($1,$2,$3,$4);', [req.query.first_name,req.query.last_name,req.query.email,'Manual Entry'])
// 		.then(results => {
// 			return res.status(200).json(req.query)
// 		})
// 		.catch(error => {
// 			return res.status(400).json({error: error.message})
// 		})
// })

module.exports = app