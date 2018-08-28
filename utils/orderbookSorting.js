const _ = require('lodash')

function orderAskBook (array) {
  let sorted = _.orderBy(array, [(o) => +o.price], ['asc'])
  return sorted
}

function orderBidBook (array) {
  let sorted = _.orderBy(array, [(o) => +o.price], ['desc'])
  return sorted
}



module.exports = {
  orderAskBook,
  orderBidBook
}