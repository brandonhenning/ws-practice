const priceStore = require('./pricestore').data
const utils = require('../utils/orderbookSorting')

function sendAskThroughPipeline (data) {
  try {
    checkAskBookLength(data)
    checkIfAsksMakeTopOfBook(data)
    utils.filterOnlyUniqueAsks(priceStore.asks)
    filterZeroQuantityAsks(priceStore.asks)
  } catch (error) { throw new Error(`Problem sending ask order through ask pipeline to update priceStore.`) }
}

function sendBidThroughPipeline (data) {
  try {
    checkBidBookLength(data)
    checkIfBidsMakeTopOfBook(data)
    utils.filterOnlyUniqueBids(priceStore.bids)
    filterZeroQuantityBids(priceStore.bids)
  } catch (error) { throw new Error(`Problem sending bid order through bid pipeline to update priceStore.`) }
}

function checkAskBookLength (data) {
  try {
    if (priceStore.asks.length < 20) {
      let addData = priceStore.asks.concat(data)
      let sortData = utils.orderAskBook(addData)
      return priceStore.asks = sortData
    }
  } catch (error) { throw new Error(`Problem reading ask book length in priceStore.`) }
}

function checkBidBookLength (data) {
  try {
    if (priceStore.bids.length < 20) {
      let addData = priceStore.bids.concat(data)
      let sortData = utils.orderBidBook(addData)
      return priceStore.bids = sortData
    }
  } catch (error) { throw new Error(`Problem reading bid book length in priceStore.`) }
}

function checkIfBidsMakeTopOfBook (data) {
  try {
    let updates = data.filter(bid => {
      if (bid.price > priceStore.bids[priceStore.bids.length - 1].price) {
        return bid
      }
    })
    let unsortedNew = priceStore.bids.concat(updates)
    let sortedNewBook = utils.orderBidBook(unsortedNew)
    return priceStore.bids = sortedNewBook.slice(0,30)
  } catch (error) { throw new Error(`Problem in determining if update bids price are in range of existing bids book prices.`) }
}

function checkIfAsksMakeTopOfBook (data) {
  try {
    let updates = data.filter(ask => {
      if (ask.price > priceStore.asks[priceStore.asks.length - 1].price) {
        return ask
      }
    })
    let unsortedNew = priceStore.asks.concat(updates)
    let sortedNewBook = utils.orderAskBook(unsortedNew)
    return priceStore.asks = sortedNewBook.slice(0,30)
  } catch (error) { throw new Error(`Problem in determining if update asks price are in range of existing asks book prices.`) }
}

function filterZeroQuantityBids (data) {
  let filtered = data.filter(order => {
    return !(order.quantity === 0)
  })
  priceStore.bids = filtered
}

function filterZeroQuantityAsks (data) {
  let filtered = data.filter(order => {
    return !(order.quantity === 0)
  })
  priceStore.asks = filtered
}

module.exports = {
  sendAskThroughPipeline,
  sendBidThroughPipeline
}