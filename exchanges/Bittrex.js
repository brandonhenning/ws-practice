
const Exchange = require('./Exchange')
const _ = require('underscore')
const BittrexClient = require('node.bittrex.api')
// Configs
const coinConfigs = require('../configs/coins')
const activeCoins = Object.keys(coinConfigs.Coins).filter(coin => { if (coinConfigs.Coins[coin]) { return coin } })
const exchangeConfigs = require('../configs/exchanges')
const primaryCoin = exchangeConfigs.PrimaryExchangeCoin
const log = console.log
const chalk = require('chalk')
const priceStore = require('../orderbook/pricestore').data
const websocket = require('../websocketServer')
const pipeline = require('../orderbook/pipeline')

// Only take coins from the exchange configs that are also valid in coinsConfig
const coins = _.intersection(activeCoins, exchangeConfigs.ExchangePairs[primaryCoin].bittrex)

class Bittrex extends Exchange {
  constructor () {
    super('bittrex')
    this.coins = coins.slice()
    this.client = BittrexClient
    this.client.options ({
      verbose: true
    })
  }

  async updateTickers () {
    try {
      this.client.getorderbook({ market : 'BTC-ETH', depth : '20', type : 'both' }, ( data, error ) => {
        let topOfAsks = this.sliceOrderBooks(data.result.sell)
        let topOfBids = this.sliceOrderBooks(data.result.buy)
        let asks = this.formatOrderBooks(topOfAsks)
        let bids = this.formatOrderBooks(topOfBids)
        priceStore.bids = bids
        priceStore.asks = asks
      })
      this.client.websockets.subscribe(['BTC-ETH'], (data) => {
        if (data.M === 'updateExchangeState') {
          data.A.forEach(function(message) {
            let askChanges = message.Sells.map(order => { 
              return { price: order.Rate, quantity: order.Quantity, exchanges: 'bittrex' }
            })
            let bidChanges = message.Buys.map(order => { 
              return { price: order.Rate, quantity: order.Quantity, exchanges: 'bittrex' }
            })
            pipeline.sendAskThroughPipeline(askChanges)
            pipeline.sendBidThroughPipeline(bidChanges)
          })
        }
      })
    } catch (error) { throw new Error(`Error in method updateTickers, problem connecting to Bittrex websocket.`) }
  }

  sliceOrderBooks(data) {
    return data.slice(0, 20)
  }

  formatOrderBooks(data) {
    try {
      return data.map(order => {
        return {
          price: order.Rate,
          quantity: order.Quantity,
          exchanges: 'bittrex' }
        })
    } catch (error) { throw new Error(`Error in method formatOrderBooks, problem formatting Bittrex websocket data.`) }
  }
      
}


module.exports = new Bittrex()