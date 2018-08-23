const bittrex = require('node.bittrex.api')

bittrex.options ({
  verbose: true
})

bittrex.getorderbook({ market : 'BTC-ETH', depth : 100, type : 'both' }, function( data, err ) {
  console.log( data );
});


bittrex.websockets.subscribe(['BTC-ETH'], function(data, client) {
  if (data.M === 'updateExchangeState') {
    data.A.forEach(function(data_for) {
      console.log('Market Update for '+ data_for.MarketName, data_for);
    });
  }
});

