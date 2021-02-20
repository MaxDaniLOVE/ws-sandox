const { Server } = require('ws');
const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 8080;
const app = express();

const corsOptions = {
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
    credentials: true
}

app.use(cors());

app.use((req, res, next) => {
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    next();
});

const server = app.listen(port, () => {
  console.log('Listening', server.address());
});

const wss = new Server({ server, path: '/ws' });

app.post('/user/register', async (req, res, next) => {
    try {
        res.send({ message: 'success' })
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
