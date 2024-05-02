const express = require('express');
const router = require('./userRouter');
require('dotenv').config();
const PORT = 8000
const app = express()

//importera requirements för swagger
const swaggerUI = require('swagger-ui-express')
const apiDocs = require('./docs/docs.json')

app.use(express.json())
app.use('/api', router)

//setup swagger docs
app.use('/api/docs', swaggerUI.serve)
app.get('/api/docs', swaggerUI.setup(apiDocs));

app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`)
})
