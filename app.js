const { Server } = require('ws');
const port = process.env.PORT || 8080;

const wss = new Server({ port });

wss.on('connection', ws => {
  ws.on('message', message => {
    ws.send(message)
  });

  ws.send('ho!');
});
