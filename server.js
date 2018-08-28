const engine = require('./engine')
engine.start()

const WebSocket = require('ws')
const priceStore = require('./orderbook/pricestore')

const wss = new WebSocket.Server({ port: 4545 })

wss.on('connection', function connection(ws) {
  ws.send(`${JSON.stringify(priceStore.data)}`)
  if (priceStore.updateTrigger === true) {
    ws.send(`${JSON.stringify(priceStore.updates)}`)
    priceStore.updateTrigger = false
  }
})

function updateOrderBook(data) {
  console.log('made it this far')
  wss.emit(`${JSON.stringify(data)}`)
}

updateOrderBook('SOmething')

