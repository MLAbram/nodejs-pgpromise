const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const v1_api = require('./routes/v1_api')

require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use('/api/v1', v1_api)

app.listen(3000, () => {
    console.log('Server listening on port: 3000.')
})