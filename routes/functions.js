const pgPromise = require('./pg-promise')

require('dotenv').config()

exports.getWeatherForecast = async() => {
    var axiosURL = ''
    var axiosResponse = {}
    var daysResults = []
    var hoursResults = []
    const baseURL = 'https://api.weatherapi.com/v1/forecast.json?key=' + process.env.WEATHERAPI_KEY  + '&aqi=no&days=3&q='
    const records = await pgPromise.db.any('select name_sub_t icao_t,name_t,city_t,state_abbr_t,state_t,postal_code_t,country_abbr_t,country_t,time_zone_t,latitude_n,longitude_n from prod.api_source_metadata where type_t = $1 and daily_f = $2 and aud_active_f = $3 limit 1;', ['Weather', true, true])
    
    for (const record of records) {
        axiosURL = baseURL + record.latitude_n + ',' + record.longitude_n
        
        try {
            const response = await axios.get(axiosURL)
            // forecast days
            for (var i = 0; i < response.data.forecast.forecastday.length; i++) {
                var dayOfWeek = moment(response.data.forecast.forecastday[i].date, 'YYYY-MM-DD HH:mm:ss').format('dddd')
                axiosResponse = {type_t: 'Forecast-Days', icao_t: record.icao_t, name_t: record.name_t, city_t: record.city_t,state_abbr_t: record.state_abbr_t, state_t: record.state_t, postal_code_t: record.postal_code_t,country_abbr_t: record.country_abbr_t, country_t: record.country_t, time_zone_t: record.time_zone_t, latitude_n: record.latitude_n, longitude_n: record.longitude_n, forecast_dt: response.data.forecast.forecastday[i].date, forecast_day_t: dayOfWeek, forecast_weathercode_n: response.data.forecast.forecastday[i].day.condition.code, forecast_maxtemp_c_n: response.data.forecast.forecastday[i].day.maxtemp_c, forecast_maxtemp_f_n: response.data.forecast.forecastday[i].day.maxtemp_f, forecast_mintemp_c_n: response.data.forecast.forecastday[i].day.mintemp_c, forecast_mintemp_f_n: response.data.forecast.forecastday[i].day.mintemp_f, forecast_maxwind_kph_n: response.data.forecast.forecastday[i].day.maxwind_kph, forecast_maxwind_mph_n: response.data.forecast.forecastday[i].day.maxwind_mph, forecast_precip_sum_mm_n: response.data.forecast.forecastday[i].day.totalprecip_mm, forecast_precip_sum_in_n: response.data.forecast.forecastday[i].day.totalprecip_in, forecast_precip_prob_n: response.data.forecast.forecastday[i].day.daily_chance_of_rain, forecast_snow_sum_cm_n: response.data.forecast.forecastday[i].day.totalsnow_cm, forecast_snow_sum_in_n: response.data.forecast.forecastday[i].day.totalsnow_cm / 2.54, forecast_snow_prob_n: response.data.forecast.forecastday[i].day.daily_chance_of_snow, forecast_humidity_n: response.data.forecast.forecastday[i].day.avghumidity, forecast_uv_n: response.data.forecast.forecastday[i].day.uv, forecast_vis_km_n: response.data.forecast.forecastday[i].day.avgvis_km, forecast_vis_mi_n: response.data.forecast.forecastday[i].day.avgvis_miles, forecast_sunrise_ts: moment(response.data.forecast.forecastday[i].astro.sunrise, ['h:mm A']).format('HH:mm'), forecast_sunset_ts: moment(response.data.forecast.forecastday[i].astro.sunset, ['h:mm A']).format('HH:mm'), forecast_moonrise_ts: moment(response.data.forecast.forecastday[i].astro.moonrise, ['h:mm A']).format('HH:mm'), forecast_moonset_ts: moment(response.data.forecast.forecastday[i].astro.moonset, ['h:mm A']).format('HH:mm'), forecast_moon_phase_t: response.data.forecast.forecastday[i].astro.moon_phase, aud_src_t: 'WeatherAPI'}
                daysResults.push(axiosResponse)
            }

            // forecast hours
            for (var d = 0; d < 2; d++){
                for (var i = 0; i < response.data.forecast.forecastday[d].hour.length; i++){
                    var dayOfWeek = moment(response.data.forecast.forecastday[d].date, 'YYYY-MM-DD HH:mm:ss').format('dddd')
                    if (response.data.forecast.forecastday[d].hour[i].condition.is_day === 1 )
                        currentIsDay = 'true'
                    else 
                        currentIsDay = 'false'

                    axiosResponse = {type_t: 'Forecast-Hours', icao_t: record.icao_t, name_t: record.name_t, city_t: record.city_t,state_abbr_t: record.state_abbr_t, state_t: record.state_t, postal_code_t: record.postal_code_t,country_abbr_t: record.country_abbr_t, country_t: record.country_t, time_zone_t: record.time_zone_t, latitude_n: record.latitude_n, longitude_n: record.longitude_n, current_ts: response.data.forecast.forecastday[d].hour[i].time, current_day_t: dayOfWeek, current_weathercode_n: response.data.forecast.forecastday[d].hour[i].condition.code, current_is_day_f: currentIsDay, current_temp_c_n: response.data.forecast.forecastday[d].hour[i].temp_c, current_temp_f_n: response.data.forecast.forecastday[d].hour[i].temp_f, current_feelslike_c_n: response.data.forecast.forecastday[d].hour[i].feelslike_c, current_feelslike_f_n: response.data.forecast.forecastday[d].hour[i].feelslike_f, current_wind_degree_n: response.data.forecast.forecastday[d].hour[i].wind_degree, current_wind_dir_t: response.data.forecast.forecastday[d].hour[i].wind_dir, current_wind_kph_n: response.data.forecast.forecastday[d].hour[i].wind_kph, current_wind_mph_n: response.data.forecast.forecastday[d].hour[i].wind_mph, current_gust_kph_n: response.data.forecast.forecastday[d].hour[i].gust_kph, current_gust_mph_n: response.data.forecast.forecastday[d].hour[i].gust_mph, current_precip_mm_n: response.data.forecast.forecastday[d].hour[i].precip_mm, current_precip_in_n: response.data.forecast.forecastday[d].hour[i].precip_in, current_humidity_n: response.data.forecast.forecastday[d].hour[i].humidity, current_cloud_n: response.data.forecast.forecastday[d].hour[i].cloud, current_vis_km_n: response.data.forecast.forecastday[d].hour[i].vis_km, current_vis_mi_n: response.data.forecast.forecastday[d].hour[i].vis_miles, current_uv_n: response.data.forecast.forecastday[d].hour[i].uv, current_pressure_mb_n: response.data.forecast.forecastday[d].hour[i].pressure_mb, current_pressure_in_n: response.data.forecast.forecastday[d].hour[i].pressure_in, aud_src_t: 'WeatherAPI'}
                    hoursResults.push(axiosResponse)
                }
            }
        } catch(error) {
            console.log(error)
        }
    }
    
    pgPromise.pgp.end
    return ({daysResults: daysResults, hoursResults: hoursResults})
}

exports.insertWeatherForecast = async(data) => {
    if (data.length === 0) {
        console.log(error)
    } else {
        const cs = new pgPromise.pgp.helpers.ColumnSet(['type_t','icao_t','name_t','city_t','state_abbr_t','state_t','postal_code_t','country_abbr_t','country_t','time_zone_t','latitude_n','longitude_n','forecast_dt','forecast_day_t','forecast_weathercode_n','forecast_maxtemp_c_n','forecast_maxtemp_f_n','forecast_mintemp_c_n','forecast_mintemp_f_n','forecast_maxwind_kph_n','forecast_maxwind_mph_n','forecast_precip_sum_mm_n','forecast_precip_sum_in_n','forecast_precip_prob_n','forecast_snow_sum_cm_n','forecast_snow_sum_in_n','forecast_snow_prob_n','forecast_humidity_n','forecast_uv_n','forecast_vis_km_n','forecast_vis_mi_n','forecast_sunrise_ts','forecast_sunset_ts','forecast_moonrise_ts','forecast_moonset_ts','forecast_moon_phase_t','aud_src_t'], {table: {table: 'weather', schema: 'prod'}})
        const query = pgPromise.pgp.helpers.insert(data, cs)

        try {
            await pgPromise.db.none(query)

            // add description to codes
            await pgPromise.db.none("update prod.weather t1 set forecast_weathercode_desc_t = t2.day_desc_t, forecast_weathercode_image_t = concat('/img/weather/day/', t2.icon_t, '.png'), aud_update_ts = current_timestamp from (select type_t, code_n, day_desc_t, night_desc_t, icon_t from prod.weather_metadata) t2 where t1.forecast_weathercode_n = t2.code_n and t2.type_t = $1 and t1.type_t = $2 and t1.forecast_weathercode_desc_t is null and t1.forecast_weathercode_n is not null and aud_src_t = $3;", ['weatherCode','Forecast-Days','WeatherAPI'])
            await pgPromise.db.none('update prod.weather t1 set forecast_uv_desc_t = t2.desc_t, aud_update_ts = current_timestamp from (select type_t, code_n, desc_t from prod.weather_metadata) t2 where t1.forecast_uv_n::int = t2.code_n and t2.type_t = $1 and t1.forecast_uv_n is not null and t1.forecast_uv_desc_t is null and t1.type_t = $2 and aud_src_t = $3;', ['uvIndex','ForecastDays','WeatherAPI'])
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
