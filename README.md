# Websocket Practice Server
![screenshot](https://raw.githubusercontent.com/brandonhenning/ws-practice/master/static/ws-dash.gif)

## Server built in Node.js and using websockets for all data
This is the back end for practicing websockets using the websocket apis for different cryptocurrency exchanges. Serves websocket stream to front end client connection that updates orderbooks multiple times per second and in realtime as they are pushed from the chosen exchanges.

## Linkes
[Deployed Live Link](https://ws-client-practice.firebaseapp.com/)

[Client Side Repo](https://github.com/brandonhenning/ws-practice-client)


### ToDo's
- At the moment there is only one PriceStore that data is being streamed into and out of. Need to add a feature that creates a PriceStore for every chosen currency pair. 

#### Installation Instructions
- npm install 
- npm start
