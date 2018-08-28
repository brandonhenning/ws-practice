module.exports = {
  Exchanges: {
    bittrex: true,
    poloniex: false,
  },
  PrimaryExchangeCoin: 'BTC',
  ExchangePairs: {
    'BTC': {
      bittrex: ['ETH'],
      poloniex: ['ETH']
    },
  }
}