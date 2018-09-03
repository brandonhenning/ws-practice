const exchangeConfigs = require('./configs/exchanges').Exchanges
const Poloniex = exchangeConfigs.poloniex ? require('./exchanges/Poloniex') : null
const Bittrex = exchangeConfigs.bittrex ? require('./exchanges/Bittrex') : null
const Binance = exchangeConfigs.binance ? require('./exchanges/Binance') : null

const connectWebSockets = async (exchange) => {
  switch(exchange) {
    case 'bittrex': 
      return await Bittrex.initializeWebSocketConnect()
    case 'poloniex':
      return await Poloniex.initializeWebSocketConnect()
    case 'binance':
      return await Binance.initializeWebSocketConnect()
    default: 
      newError = new Error(`Exchange ${exchange} not configured for connectWebScokets, throwing out.`)
      throw newError
  }
}

const updateTickers = async (exchange) => {
  switch(exchange) {
    case 'bittrex': 
      return await Bittrex.updateTickers()
    case 'poloniex':
      return await Poloniex.updateTickers()
    case 'binance':
      return await Binance.updateTickers()
    default: 
      newError = new Error(`Exchange ${exchange} not configured for updateTickers, throwing out.`)
      throw newError
  }
}

module.exports = {
  connectWebSockets,
  updateTickers
}

