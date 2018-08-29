const WebSocket = require('ws')
const priceStore = require('./orderbook/pricestore')
const log = console.log
const chalk = require('chalk')

const wss = new WebSocket.Server({ port: 4545 })

wss.on('connection', function connection(ws) {
  ws.send(`${JSON.stringify(priceStore.data)}`)
  if (priceStore.updateTrigger === true) {
    ws.send(`${JSON.stringify(priceStore.updates)}`)
    priceStore.updateTrigger = false
  }
})

const broadcast = (data) => {
  try {
    wss.clients.forEach(function each(client) {
      client.send(`${JSON.stringify(data)}`)
      log(chalk.magenta('Sent: updated prices'))
    })
  } catch (error) { throw new Error(`Websocket server broadcast error, client not receiving messages.`)}
}

module.exports = {
  broadcast: broadcast
}
