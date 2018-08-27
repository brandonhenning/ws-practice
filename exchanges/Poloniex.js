const Exchange = require('./Exchange')
const _ = require('underscore')
const PoloniexClient = require ('poloniex-api-node')
// Configs
const coinConfigs = require('../configs/coins')
const activeCoins = Object.keys(coinConfigs.Coins).filter(coin => { if (coinConfigs.Coins[coin]) { return coin } })
const exchangeConfigs = require('../configs/exchanges')
const primaryCoin = exchangeConfigs.PrimaryExchangeCoin
const log = console.log
const chalk = require('chalk')
const priceStore = require('../orderbook/pricestore')
const utils = require('../utils/orderbookSorting')

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
      if (channelName === 'BTC_ETH') {
        log(chalk.blue(`order book and trade updates received for currency pair ${channelName}`))
        log(chalk.blue(`data sequence number is ${seq}`))
        // log(chalk.blue(`Tickerc: ${JSON.stringify(data)}`))
        this.filterWebsocketDataType(data)
      }
    })
    this.client.openWebSocket({ version: 2 })
  }

  filterWebsocketDataType(data) {
    if (data[0].type === 'orderBook') {
      let asks = this.formatOrderBooks(data[0].data.asks)
      let bids = this.formatOrderBooks(data[0].data.bids)
      let newBidBook = priceStore.data.bids.concat(bids)
      let newAskBook = priceStore.data.asks.concat(asks)
      priceStore.data.bids = utils.orderBidBook(newBidBook)
      priceStore.data.asks = utils.orderAskBook(newAskBook)
      log(priceStore.data.asks.length, priceStore.data.bids.length)

    } else {
      data.filter(update => {
        log('Do something here with updates later, for now get main orderbook working')
        // this.modifyOrderbook(update)
        })
    }
  }

  modifyOrderbook(data) {
    if (data.type === 'orderBookRemove') {
      let side = data.data.type
      let array = [priceStore.data[`${side}s`]]
      let newOrderBook = array.filter(entries => {
        return entries.price !== data.data.rate
      })
      priceStore.data[`${side}s`] = newOrderBook

    } else if (data.type === 'orderBookModify') {
      let side = data.data.type
      let array = priceStore.data[`${side}s`]
      let newOrderBook = array.map(entry => {
        if (entry.price === data.data.rate) {
          return entry = { price: data.data.rate,
            quantity: data.data.amount, 
            exchanges: 'poloniex' }
        } else return entry
      })
      priceStore.data[`${side}s`] = newOrderBook
    }
  }

  formatOrderBooks(data) {
    const unformatted = Object.entries(data)
    const formattedArray = unformatted.map(entry => {
      return {
        price: entry[0],
        quantity: entry[1],
        exchanges: 'poloniex' 
      }
    })
    return formattedArray
  }
}

module.exports = new Poloniex()