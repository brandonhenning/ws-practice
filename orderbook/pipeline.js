const priceStore = require('./pricestore').data
const utils = require('../utils/orderbookSorting')

function sendAskThroughPipeline (data) {
  try {
    checkAskBookLength(data)
    checkIfAsksMakeTopOfBook(data)
    filterExistingAsks(data)
  } catch (error) { throw new Error(`Problem sending ask order through ask pipeline to update priceStore.`) }
}

function sendBidThroughPipeline (data) {
  try {
    checkBidBookLength(data)
    checkIfBidsMakeTopOfBook(data)
    filterExistingBids(data)
  } catch (error) { throw new Error(`Problem sending bid order through bid pipeline to update priceStore.`) }
}

function checkAskBookLength (data) {
  try {
    if (priceStore.asks.length < 25) {
      let addData = priceStore.asks.concat(data)
      let sortData = utils.orderAskBook(addData)
      return priceStore.asks = sortData
    }
  } catch (error) { throw new Error(`Problem reading ask book length in priceStore.`) }
}

function checkBidBookLength (data) {
  try {
    if (priceStore.bids.length < 25) {
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

function updateExistingBids (bid) {
  try {
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
  } catch (error) { throw new Error(`Problem in updating existing bids with new orders.`) }
}

function updateExistingAsks (ask) {
  try {
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
  } catch (error) { throw new Error(`Problem in updating existing asks with new orders.`) }
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