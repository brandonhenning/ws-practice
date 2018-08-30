module.exports = {
  Exchanges: {
    bittrex: false,
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