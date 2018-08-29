const Exchange = require('./Exchange')
const _ = require('underscore')
const PoloniexClient = require ('poloniex-api-node')
// Configs
const coinConfigs = require('../configs/coins')
const activeCoins = Object.keys(coinConfigs.Coins).filter(coin => { if (coinConfigs.Coins[coin]) { return coin } })
const exchangeConfigs = require('../configs/exchanges')
const primaryCoin = exchangeConfigs.PrimaryExchangeCoin
const log = console.log
const priceStore = require('../orderbook/pricestore').data
const websocket = require('../websocketServer')
const pipeline = require('../orderbook/pipeline')

// Only take coins from the exchange configs that are also valid in coinsConfig
const coins = _.intersection(activeCoins, exchangeConfigs.ExchangePairs[primaryCoin].poloniex)
const pairs = coins.map(coin => `${primaryCoin}_${coin}`)

class Poloniex extends Exchange {
  constructor () {
    super('poloniex')
    this.coins = coins.slice()
    this.pairs = pairs
    this.client = new PoloniexClient()
    this.client.on('open', () => { log(`Poloniex WebSocket connection open`) })
    this.client.on('close', (reason, details) => { log(`Poloniex WebSocket connection disconnected`) })
    this.client.on('error', (error) => { log(`Poloniex client error.`, error) })
  }

  updateTickers () {
    this.pairs.forEach(pair => { this.updatePairs(pair) })
  }

  async updatePairs (pair) {
    try {
      this.client.subscribe(pair)
      this.client.on('message', (channelName, data, seq) => {
        if (channelName === pair) {
          this.filterWebsocketDataType(data)
        }
      })
      this.client.openWebSocket({ version: 2 })
    } catch (error) { throw new Error(`Error in method updatePairs, problem connecting to Poloniex websocket.`) }
  }

  filterWebsocketDataType(data) {
    try {
      if (data[0].type === 'orderBook') {
        let asks = this.formatOrderBooks(data[0].data.asks).slice(0, 20)
        let bids = this.formatOrderBooks(data[0].data.bids).slice(0, 20)
        pipeline.sendAskThroughPipeline(asks)
        pipeline.sendBidThroughPipeline(bids)
      } else {
        this.formatModifyOrders(data)
      }
    } catch (error) { throw new Error(`Error in method filterWebsocketDataType, problem reading order type.`) }
  }

  formatModifyOrders (data) {
    try {
      let newBidsBook = []
      let newAsksBook = []
      data.forEach(order => {
        let newOrder = {
          price: order.data.rate,
          quantity: parseFloat(order.data.amount),
          exchanges: 'poloniex' 
        }
        if (order.data.type === 'ask')
        newAsksBook.push(newOrder)
        if (order.data.type === 'bid')
        newBidsBook.push(newOrder)
      })
      pipeline.sendAskThroughPipeline(newAsksBook)
      pipeline.sendBidThroughPipeline(newBidsBook)
    } catch (error) { throw new Error(`Error in method formatModifyOrders, problem formatting Poloniex orderbook updates.`) }
  }

  formatOrderBooks(data) {
    try {
      const unformatted = Object.entries(data)
      const formattedArray = unformatted.map(entry => {
        return {
          price: entry[0],
          quantity: entry[1],
          exchanges: 'poloniex' 
        }
      })
      return formattedArray
    } catch (error) { throw new Error(`Error in method formatOrderBooks, problem formatting Poloniex orderbook data.`) }
  }
}

module.exports = new Poloniex()