const express = require('express');
const router = require('./userRouter');
require('dotenv').config();
const PORT = 8000
const app = express()

app.use(express.json())
app.use('/api', router)

app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`)
})
