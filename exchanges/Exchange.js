class Exchange {
  constructor (exchangeName) {
    this.exchange = exchangeName
    this.client = null
  }

  async initializeWebSocketConnect () {
    throw new Error(`Method initializeWebSocketConnect must be implemented in ${this.exchange} subclass.`)
  }

  async updateTickers () {
    throw new Error(`Method updateTickers must be implemented in ${this.exchange} subclass.`)
  }

  async formatOrderBooks () {
    throw new Error(`Method formatOrderBooks must be implemented in ${this.exchange} subclass.`)
  }

  async getFees () {
    throw new Error(`Method getFees must be implemented in ${this.exchange} subclass.`)
  }

}

module.exports = Exchange