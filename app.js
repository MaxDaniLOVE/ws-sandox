const { Server } = require('ws');
const admin = require('firebase-admin');
const express = require('express');

const serviceAccount = require("./config/serviceAccount");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ws-nodejs-b191b.firebaseio.com"
});

const port = process.env.PORT || 8080;
const app = express();

const server = app.listen(port, () => {
  console.log('Listening', server.address());
});

const wss = new Server({ server, path: '/ws' });
console.log('CHECK!')

wss.on('connection', ws => {
  ws.on('message', message => {
    wss.clients.forEach(function each(client) {
      client.send(message);
    })
  });
  
  ws.send('ho!');
});
