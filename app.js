const { Server } = require('ws');
const admin = require('firebase-admin');

const serviceAccount = require("./ws-nodejs-b191b-firebase-adminsdk-42p8l-5d99b91e69.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ws-nodejs-b191b.firebaseio.com"
});

const port = process.env.PORT || 8080;

const wss = new Server({ port });

wss.on('connection', ws => {
  ws.on('message', message => {
    wss.clients.forEach(function each(client) {
      client.send(message);
    })
  });
  
  ws.send('ho!');
});
