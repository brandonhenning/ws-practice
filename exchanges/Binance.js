const Exchange = require('./Exchange')
const _ = require('underscore')
const BinanceClient = require('node-binance-api')
// Configs
const coinConfigs = require('../configs/coins')
const activeCoins = Object.keys(coinConfigs.Coins).filter(coin => { if (coinConfigs.Coins[coin]) { return coin } })
const exchangeConfigs = require('../configs/exchanges')
const primaryCoin = exchangeConfigs.PrimaryExchangeCoin
const pipeline = require('../orderbook/pipeline')

// Only take coins from the exchange configs that are also valid in coinsConfig
const coins = _.intersection(activeCoins, exchangeConfigs.ExchangePairs[primaryCoin].binance)
const pairs = coins.map(coin => `${coin}${primaryCoin}`)

class Binance extends Exchange {
  constructor () {
    super('binance')
    this.coins = coins.slice()
    this.pairs = pairs
    this.client = BinanceClient()
  }

  updateTickers () {
    this.pairs.forEach(pair => { this.updatePairs(pair) })
  }

  async updatePairs (pair) {
    try {
      this.client.websockets.depthCache([pair], (symbol, depth) => {
        let max = 30
        let bids = this.client.sortBids(depth.bids, max);
        let asks = this.client.sortAsks(depth.asks, max);
        let formattedBids = this.formatOrderBooks(bids)
        let formattedAsks = this.formatOrderBooks(asks)
        pipeline.sendAskThroughPipeline(formattedAsks)
        pipeline.sendBidThroughPipeline(formattedBids)
      })
    } catch (error) { throw new Error(`Error in method updatePairs, problem connecting to Binance websocket.`)}
  }

  formatOrderBooks(data) {
    try {
      const unformatted = Object.entries(data)
      const formattedArray = unformatted.map(entry => {
        return {
          price: entry[0],
          quantity: entry[1],
          exchanges: 'binance' 
        }
      })
      return formattedArray
    } catch (error) { throw new Error(`Error in method formatOrderBooks, problem formatting Binance orderbook data.`) }
  }
}

module.exports = new Binance()