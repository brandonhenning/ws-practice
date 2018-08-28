const priceStore = require('./pricestore').data
const utils = require('../utils/orderbookSorting')

function sendAskThroughPipeline (data) {
    checkAskBookLength(data)
    checkIfAsksMakeTopOfBook(data)
    filterExistingAsks(data)
}

function sendBidThroughPipeline (data) {
    checkBidBookLength(data)
    checkIfBidsMakeTopOfBook(data)
    filterExistingBids(data)
}


function checkAskBookLength (data) {
  if (priceStore.asks.length < 25) {
    let addData = priceStore.asks.concat(data)
    let sortData = utils.orderAskBook(addData)
    return priceStore.asks = sortData
  }
}

function checkBidBookLength (data) {
  if (priceStore.bids.length < 25) {
    let addData = priceStore.bids.concat(data)
    let sortData = utils.orderBidBook(addData)
    return priceStore.bids = sortData
  }
}

function checkIfBidsMakeTopOfBook (data) {
  let updates = data.filter(bid => {
    if (bid.price > priceStore.bids[priceStore.bids.length - 1].price) {
      return bid
    }
  })
  let unsortedNew = priceStore.bids.concat(updates)
  let sortedNewBook = utils.orderBidBook(unsortedNew)
  return priceStore.bids = sortedNewBook.slice(0,30)
}

function checkIfAsksMakeTopOfBook (data) {
  let updates = data.filter(ask => {
    if (ask.price > priceStore.asks[priceStore.asks.length - 1].price) {
      return ask
    }
  })
  let unsortedNew = priceStore.asks.concat(updates)
  let sortedNewBook = utils.orderAskBook(unsortedNew)
  return priceStore.asks = sortedNewBook.slice(0,30)
}


function updateExistingBids (bid) {
  let newBids = priceStore.bids.reduce((accum, existing) => {
    if (bid.price == existing.price) {
      if (bid.quantity != 0) {
        if (bid.exchanges == existing.exchanges) {
          existing.quantity = bid.quantity
          accum.push(existing)
          return accum
        }
        else if (bid.exchanges != existing.exchanges) {
          accum.push(existing, bid)
          return accum
        }
      }
    } else accum.push(existing)
    return accum
  }, [])
  return newBids
}

function updateExistingAsks (ask) {
  let newAsks = priceStore.asks.reduce((accum, existing) => {
    if (ask.price == existing.price) {
      if (ask.quantity != 0) {
        if (ask.exchanges == existing.exchanges) {
          existing.quantity = ask.quantity
          accum.push(existing)
          return accum
        }
        else if (ask.exchanges != existing.exchanges) {
          accum.push(existing, ask)
          return accum
        }
      }
    } else accum.push(existing)
    return accum
  }, [])
  return newAsks
}

function filterExistingAsks (data) {
  return data.forEach(ask => {
    return updateExistingAsks(ask)
  })
}

function filterExistingBids (data) {
  return data.forEach(bid => {
    return updateExistingBids(bid)
  })
}



module.exports = {
  sendAskThroughPipeline,
  sendBidThroughPipeline
}