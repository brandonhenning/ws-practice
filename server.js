const engine = require('./engine')
const express = require('express')
const app = express()
const port = 3000 || process.env.PORT
app.listen(port)
console.log(process.env.PORT)

engine.start()

