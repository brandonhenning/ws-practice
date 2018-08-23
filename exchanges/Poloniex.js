const Exchange = require('./Exchange')
const _ = require('underscore')
const PoloniexClient = require ('poloniex-api-node')
// Configs
const coinConfigs = require('../configs/coins')
const activeCoins = Object.keys(coinConfigs.Coins).filter(coin => { if (coinConfigs.Coins[coin]) { return coin } })
const exchangeConfigs = require('../configs/exchanges')
const primaryCoin = exchangeConfigs.PrimaryExchangeCoin
const log = console.log

// Only take coins from the exchange configs that are also valid in coinsConfig
const coins = _.intersection(activeCoins, exchangeConfigs.ExchangePairs[primaryCoin].poloniex)

class Poloniex extends Exchange {
  constructor () {
    super('poloniex')
    this.coins = coins.slice()
    this.client = new PoloniexClient()
    this.client.on('open', () => { log(`Poloniex WebSocket connection open`) })
    this.client.on('close', (reason, details) => { log(`Poloniex WebSocket connection disconnected`) })
    this.client.on('error', (error) => { log(`An error has occured`) })
  }

  async updateTickers () {
    this.client.subscribe('BTC_ETH')
    
    this.client.on('message', (channelName, data, seq) => {
      if (channelName === 'ticker') {
        log(`Ticker: ${JSON.stringify(data)}`)
      }
      if (channelName === 'BTC_ETH') {
        log(`order book and trade updates received for currency pair ${channelName}`)
        log(`data sequence number is ${seq}`)
        log(`Tickerc: ${JSON.stringify(data)}`)
      }
    })
    this.client.openWebSocket({ version: 2 })
  }
}

module.exports = new Poloniex()