const priceStore = require('./pricestore').data
const utils = require('../utils/orderbookSorting')
const websocket = require('../websocketServer')

function sendAskThroughPipeline (data) {
  try {
    checkAskBookLength(data)
    checkIfAsksMakeTopOfBook(data)
    changeAskQuantityToZero(data)
    utils.filterOnlyUniqueAsks(priceStore.asks)
    websocket.broadcast(priceStore)
  } catch (error) { throw new Error(`Problem sending ask order through ask pipeline to update priceStore.`) }
}

function sendBidThroughPipeline (data) {
  try {
    checkBidBookLength(data)
    checkIfBidsMakeTopOfBook(data)
    changeBidQuantityToZero(data)
    utils.filterOnlyUniqueBids(priceStore.bids)
    websocket.broadcast(priceStore)
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
      if (ask.price < priceStore.asks[priceStore.asks.length - 1].price) {
        return ask
      }
    })
    let unsortedNew = priceStore.asks.concat(updates)
    let sortedNewBook = utils.orderAskBook(unsortedNew)
    return priceStore.asks = sortedNewBook.slice(0,30)
  } catch (error) { throw new Error(`Problem in determining if update asks price are in range of existing asks book prices.`) }
}

function changeBidQuantityToZero (data) {
  data.forEach(order => {
    if (order.quantity == 0) {
     let removed = priceStore.bids.filter(existing => {
        return !(existing.price === order.price)
      })
      priceStore.bids = removed
    }
  })
}

function changeAskQuantityToZero (data) {
  data.forEach(order => {
    if (order.quantity == 0) {
     let removed = priceStore.asks.filter(existing => {
        return !(existing.price === order.price)
      })
      priceStore.asks = removed
    }
  })
}

function updateAskQuantity (data) {
  data.forEach(order => {
    if (order.quantity !== 0) {
     let updated = priceStore.asks.map(existing => {
        if (existing.price === order.price) {
          existing.quantity = order.quantity
        }
      })
      priceStore.asks = updated
    }
  })
}

function updateBidQuantity (data) {
  data.forEach(order => {
    if (order.quantity !== 0) {
     let updated = priceStore.bids.map(existing => {
        if (existing.price === order.price) {
          existing.quantity = order.quantity
        }
      })
      priceStore.bids = updated
    }
  })
}

module.exports = {
  sendAskThroughPipeline,
  sendBidThroughPipeline,
  updateAskQuantity,
  updateBidQuantity
}