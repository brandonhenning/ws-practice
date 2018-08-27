const exchangeManager = require('./exchangeManager')
const activeExchanges = require('./configs/exchanges').Exchanges
const log = console.log
const chalk = require('chalk')


function getActiveExchanges (exchangeObject) {
  const keys = Object.keys(exchangeObject)
  const exchanges = keys.filter(key => exchangeObject[key])
  return exchanges
}

const exchanges = getActiveExchanges(activeExchanges)

async function updateAllExchanges (exchanges) {
  return await exchanges.forEach((exchange) => exchangeManager.updateTickers(exchange))
}

async function start () {
  log(chalk.magenta('Starting server engine'))
  updateAllExchanges(exchanges)
}

module.exports = {
  start
}

