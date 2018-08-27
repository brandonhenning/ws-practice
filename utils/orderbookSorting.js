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

function countRepeatEntries (priceStore) {
  priceStore.bids.filter(entry => {
    
  })
}


module.exports = {
  orderAskBook,
  orderBidBook
}