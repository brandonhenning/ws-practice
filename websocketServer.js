require('dotenv').config()
const WebSocket = require('ws')
const priceStore = require('./orderbook/pricestore')
const log = console.log
const chalk = require('chalk')

const wss = new WebSocket.Server({ port: process.env.PORT })

wss.on('connection', function connection(ws) {
  ws.send(`${JSON.stringify(priceStore.data)}`)
  log(chalk.magenta('Client connection initiated.'))
})

const broadcast = (data) => {
  try {
    wss.clients.forEach(function each(client) {
      client.send(`${JSON.stringify(data)}`)
    })
  } catch (error) { throw new Error(`Websocket server broadcast error, client not receiving messages.`)}
}


module.exports = {
  broadcast: broadcast
}
