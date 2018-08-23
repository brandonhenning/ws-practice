const exchangeConfigs = require('./configs/exchanges').Exchanges
const Poloniex = exchangeConfigs.poloniex ? require('./exchanges/Poloniex') : null
const Bittrex = exchangeConfigs.bittrex ? require('./exchanges/Bittrex') : null

const connectWebSockets = async (exchange) => {
  switch(exchange) {
    case 'bittrex': 
      return await Bittrex.initializeWebSocketConnect()
    case 'poloniex':
      return await Poloniex.initializeWebSocketConnect()
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
    default: 
      newError = new Error(`Exchange ${exchange} not configured for updateTickers, throwing out.`)
      throw newError
  }
}

module.exports = {
  connectWebSockets,
  updateTickers
}

