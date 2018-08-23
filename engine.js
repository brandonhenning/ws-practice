const exchangeManager = require('./exchangeManager')
const activeExchanges = require('./configs/exchanges').Exchanges
const exchanges = getActiveExchanges(activeExchanges)


function getActiveExchanges (exchangeObject) {
  const keys = Object.keys(exchangeObject)
  const exchanges = keys.filter(key => exchangeObject[key])
  return exchanges
}

async function updateAllExchanges (exchanges) {
  return await exchanges.forEach((exchange) => exchangeManager.updateTickers(exchange))
}

async function start () {
  updateAllExchanges(exchanges)
}

module.exports = {
  start
}