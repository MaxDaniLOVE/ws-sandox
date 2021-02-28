const { Server } = require('ws');
const Message = require('../models/message');

const initSocket = server => {
    const wss = new Server({ server, path: '/ws' });
    wss.on('connection', async ws => {
        ws.on('message', async message => {
            const receivedMessage = JSON.parse(message);
            const newMessage = new Message({
                ...receivedMessage,
                timestamp: new Date(),
            })
            const { _doc: { __v, _id, ...doc } } = await newMessage.save();
            wss.clients.forEach((client) => {
                client.send(JSON.stringify({ id: _id, ...doc }));
            })
        });
        const numberOfMessages = await Message.find().count();
        const skipValue = numberOfMessages - 10;
        if (!numberOfMessages) return ws.send(JSON.stringify([]));
        const availableMessages = skipValue > 0 ? await Message.find().skip(skipValue) : await Message.find();
        const messages = availableMessages.map(({ _doc: { __v, _id, ...message } }) => ({ id: _id, ...message }));
        ws.send(JSON.stringify(messages));
    });
}

module.exports = initSocket;