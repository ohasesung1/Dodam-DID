require('dotenv').config();

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const api = require('./api');
const bodyParser = require('body-parser');
const webSocket = require('./socket');

const { PORT : port } = process.env;

//Websocker Server 선언
var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({ server });

//Start Websocket Server
webSocket.start(wss);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//api router
app.use(api);

//image path router
app.use('/img', express.static('public'));

server.listen(port, () => {
  console.log(`webSocketServer connected! port => ${port}`);
});