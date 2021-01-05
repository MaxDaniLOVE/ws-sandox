const { Server } = require('ws');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const serviceAccount = require("./config/serviceAccount");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ws-nodejs-b191b.firebaseio.com"
});

const port = process.env.PORT || 8080;
const app = express();

const corsOptions = {
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
    credentials: true
}

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(cors(corsOptions));

app.use(cookieParser());

const server = app.listen(port, () => {
  console.log('Listening', server.address());
});

const wss = new Server({ server, path: '/ws' });

app.post('/user/register', async (req, res, next) => {
    try {
        const customToken = await admin.auth().createCustomToken('uid')
        res.cookie('customToken', customToken, {
            maxAge: 1000 * 60 * 60 * 24, httpOnly: true, sameSite: 'none', secure: true,
        });
        res.send({ customToken, requestCookies: req.cookies })
    } catch (error) {
        console.log('Error creating custom token:', error);
        next();
    }
})

wss.on('connection', ws => {
  ws.on('message', message => {
    wss.clients.forEach(function each(client) {
      client.send(message);
    })
  });
  
  ws.send('ho!');
});
