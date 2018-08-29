module.exports = {
  Exchanges: {
    bittrex: true,
    poloniex: true,
  },
  PrimaryExchangeCoin: 'BTC',
  ExchangePairs: {
    'BTC': {
      bittrex: ['ETH', 'DOGE'],
      poloniex: ['ETH']
    },
  }
}