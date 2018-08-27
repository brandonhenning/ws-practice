
const Exchange = require('./Exchange')
const _ = require('underscore')
const fetch = require('node-fetch')
const BittrexClient = require('node.bittrex.api')
// Configs
const coinConfigs = require('../configs/coins')
const activeCoins = Object.keys(coinConfigs.Coins).filter(coin => { if (coinConfigs.Coins[coin]) { return coin } })
const exchangeConfigs = require('../configs/exchanges')
const primaryCoin = exchangeConfigs.PrimaryExchangeCoin
const log = console.log
const chalk = require('chalk')
const priceStore = require('../orderbook/pricestore')

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
    this.client.getorderbook({ market : 'BTC-ETH', depth : 100, type : 'both' }, ( data, err ) => {
      let asks = this.formatOrderBooks(data.result.sell)
      let bids = this.formatOrderBooks(data.result.buy)
      let newBidBook = priceStore.data.bids.concat(bids)
      let newAskBook = priceStore.data.asks.concat(asks)
      priceStore.data.bids = newBidBook
      priceStore.data.asks = newAskBook
    })
    // this.client.websockets.subscribe(['BTC-ETH'], function(data, client) {
    //   if (data.M === 'updateExchangeState') {
    //     data.A.forEach(function(data_for) {
    //       console.log('Market Update for '+ data_for.MarketName, data_for)
    //     })
    //   }
    // })
  }

  formatOrderBooks(data) {
    return data.map(order => {
      return {
        price: order.Rate,
        quantity: order.Quantity,
        exchanges: 'bittrex' }
    })
  }

}


module.exports = new Bittrex()