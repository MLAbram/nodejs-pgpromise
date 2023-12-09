const express = require('express')
const app = express()
const pgPromise = require('./pg-promise')
const func = require('./functions')

require('dotenv').config()

app.get('/', (req, res) => {
	// http://127.0.0.1:3000/api/v1
	res.status(200).json({message: 'API v1'})
})

app.get('/pull-weather', async(req, res) => {
	// http://127.0.0.1:3000/api/v1/pull-weather
	const results = await func.getWeatherForecast()
	await func.insertWeatherForecast(results)
	
	res.status(200).json(results)
})

app.get('/get-weather', async(req, res) => {
	// http://127.0.0.1:3000/api/v1/get-weather?name=Austin,%20TX
	const results = await func.pgPromiseAny({sql: 'select name_t, forecast_ts, forecast_day_t, forecast_desc_t, forecast_maxtemp_f_n, forecast_mintemp_f_n, forecast_maxwind_mph_n, forecast_humidity_n from dev.nodejs_pgpromise_data where lower(name_t) = $1 order by forecast_ts desc limit 5;', array: [req.query.name.toLowerCase()]})
	
	res.status(200).json(results)
})

module.exports = app