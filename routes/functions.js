const moment = require('moment')
const axios = require('axios')
const pgPromise = require('./pg-promise')

require('dotenv').config()

exports.getWeatherForecast = async() => {
    var results = []
    const baseURL = 'https://api.openweathermap.org/data/2.5/forecast?appid=' + process.env.OPENWEATHER_API  + '&units=imperial&mode=json&lang=en'
    const records = await pgPromise.db.any('select name_t, city_t, state_abbr_t, latitude_n, longitude_n from dev.nodejs_pgpromise_locations where aud_active_f = $1;', [true])
    
    for (const record of records) {
        const axiosURL = baseURL + '&lat=' + record.latitude_n + '&lon=' + record.longitude_n
        
        try {
            const response = await axios.get(axiosURL)

            for (var i = 0; i < response.data.list.length; i++) {
                const axiosResponse = {name_t: record.name_t, city_t: record.city_t, state_abbr_t: record.state_abbr_t, latitude_n: record.latitude_n, longitude_n: record.longitude_n, forecast_ts: moment(response.data.list[i].dt, 'X').format('YYYY-MM-DD HH:mm:ss'), forecast_day_t: moment(moment(response.data.list[i].dt, 'X').format('YYYY-MM-DD HH:mm:ss')).format('dddd'), forecast_desc_t: response.data.list[i].weather[0].description, forecast_maxtemp_f_n: response.data.list[i].main.temp_max, forecast_mintemp_f_n: response.data.list[i].main.temp_min, forecast_maxwind_mph_n: response.data.list[i].wind.speed, forecast_humidity_n: response.data.list[i].main.humidity, aud_src_t: 'OpenWeatherMap'}
                results.push(axiosResponse)
            }
        } catch(error) {
            console.log(error)
        }
    }
    
    pgPromise.pgp.end
    return results
}

exports.insertWeatherForecast = async(data) => {
    if (data.length === 0) {
        console.log(error)
    } else {
        const cs = new pgPromise.pgp.helpers.ColumnSet(['name_t', 'city_t', 'state_abbr_t', 'latitude_n', 'longitude_n', 'forecast_ts', 'forecast_day_t', 'forecast_desc_t', 'forecast_maxtemp_f_n', 'forecast_mintemp_f_n', 'forecast_maxwind_mph_n', 'forecast_humidity_n', 'aud_src_t'], {table: {table: 'nodejs_pgpromise_data', schema: 'dev'}})
        const query = pgPromise.pgp.helpers.insert(data, cs)

        try {
            await pgPromise.db.none(query)

        } catch (error) {
            console.log(error)
        }
    }

    pgPromise.pgp.end
}

exports.pgPromiseAny = async(req, res) => {
    var functionResults = []

    try {
        await pgPromise.db.any(req.sql, req.array)
        .then(data => {
            functionResults = data
        })
        .catch(error => {
            functionResults.push({status: 'fail', error: error.message})
        })
    } catch {
        functionResults.push({status: 'fail', error: error.message})
    }

    pgPromise.pgp.end

    return functionResults
}

exports.pgPromiseNone = async(req, res) => {
    var functionResults = []

    try {
        await pgPromise.db.none(req.sql, req.array)
        .then(data => {
            functionResults.push({status: 'pass'})
        })
        .catch(error => {
            functionResults.push({status: 'fail', error: error.message})
        })
    } catch {
        functionResults.push({status: 'fail', error: error.message})
    }

    pgPromise.pgp.end

    return functionResults
}

exports.pgPromiseOne = async(req, res) => {
    var functionResults = []

    try {
        await pgPromise.db.one(req.sql, req.array)
        .then(data => {
            functionResults = data
        })
        .catch(error => {
            functionResults.push({status: 'fail', error: error.message})
        })
    } catch {
        functionResults.push({status: 'fail', error: error.message})
    }

    pgPromise.pgp.end

    return functionResults
}
