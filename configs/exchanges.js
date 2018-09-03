module.exports = {
  Exchanges: {
    bittrex: true,
    poloniex: true,
    binance: false
  },
  PrimaryExchangeCoin: 'BTC',
  ExchangePairs: {
    'BTC': {
      bittrex: ['ETH', 'DOGE'],
      poloniex: ['ETH'],
      binance: ['ETH']
    },
  }
}