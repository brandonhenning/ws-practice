const _ = require('lodash')
const priceStore = require('../orderbook/pricestore').data

function orderAskBook (array) {
  let sorted = _.orderBy(array, [(o) => +o.price], ['asc'])
  return sorted
}

function orderBidBook (array) {
  let sorted = _.orderBy(array, [(o) => +o.price], ['desc'])
  return sorted
}

function filterOnlyUniqueBids (array) {
  let sorted = _.uniqBy(array, 'price')
  return priceStore.bids = orderBidBook(sorted)
}

function filterOnlyUniqueAsks (array) {
  let sorted = _.uniqBy(array, 'price')
  return priceStore.asks = orderAskBook(sorted)
}


module.exports = {
  orderAskBook,
  orderBidBook,
  filterOnlyUniqueBids,
  filterOnlyUniqueAsks
}