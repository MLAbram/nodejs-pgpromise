const express = require('express')
const app = express()
const pgPromise = require('./pg-promise')

require('dotenv').config()

app.get('/', (req, res) => {
	res.status(200).json({message: 'API v1'})
})

module.exports = app