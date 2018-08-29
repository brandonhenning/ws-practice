const engine = require('./engine')
const express = require('express')
const app = express()
const port = 3000 || process.env.PORT
console.log(port)
app.listen(port)

engine.start()

