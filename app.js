const { Server } = require('ws');
const express = require('express');
const port = process.env.PORT || 8080;
const app = express();
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user-routes');
const mongoose = require('mongoose');
require('dotenv').config();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.ORIGIN);
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

const server = app.listen(port, () => console.log('Listening', server.address()));

const wss = new Server({ server, path: '/ws' });

app.use('/user', userRoutes);

wss.on('connection', ws => {
  ws.on('message', message => {
    wss.clients.forEach(function each(client) {
      client.send(message);
    })
  });
  
  ws.send('ho!');
});

try {
    mongoose
        .connect(
            process.env.DB_URL,
            { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false }
        );
    console.log('Success db connection');
} catch (e) {
    console.log('Failed db connection');
}
