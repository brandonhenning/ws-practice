const Poloniex = require ('poloniex-api-node')
// const Poloniex = require ('../lib/poloniex.js')

let poloniex = new Poloniex()

// poloniex.subscribe('ticker')
poloniex.subscribe('BTC_ETH')

poloniex.on('message', (channelName, data, seq) => {
  if (channelName === 'ticker') {
    console.log(`Ticker: ${JSON.stringify(data)}`)
  }

  if (channelName === 'BTC_ETH') {
    console.log(`order book and trade updates received for currency pair ${channelName}`)
    console.log(`data sequence number is ${seq}`)
    console.log(`Tickerc: ${JSON.stringify(data)}`)
  }
})

poloniex.on('open', () => {
  console.log(`Poloniex WebSocket connection open`)
})

poloniex.on('close', (reason, details) => {
  console.log(`Poloniex WebSocket connection disconnected`)
})

poloniex.on('error', (error) => {
  console.log(`An error has occured`)
})

poloniex.openWebSocket({ version: 2 })

module.exports = new Poloniex()