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

app.post('/user/register', async (req, res, next) => {
    try {
        const customToken = await admin.auth().createCustomToken('uid')
        res.cookie('cookieName', 1, { maxAge: 900000, httpOnly: true });
        res.send({ customToken })
    } catch (error) {
        console.log('Error creating custom token:', error);
        next();
    }
})

app.post('/user/register', (req,res, next) => {
    res.send({ hello: 'world'})
    next();
})

wss.on('connection', ws => {
  ws.on('message', message => {
    wss.clients.forEach(function each(client) {
      client.send(message);
    })
  });
  
  ws.send('ho!');
});
