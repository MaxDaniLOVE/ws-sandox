import { getMessageSender } from '../utils/getMessageSender';
import { Server } from 'ws';
import { IMessage, Message } from '../models/message';

export const initSocket = (server: any) => {
	const wss = new Server({ server, path: '/ws' });
	wss.on('connection', async (ws: { on: (arg0: string, arg1: (message: string) => Promise<void>) => void; send: (arg0: string) => void; }) => {
		ws.on('message', async (message: string) => {
			const receivedMessage = JSON.parse(message);
			const newMessage = new Message({
				...receivedMessage,
				timestamp: new Date(),
			});
			const savedMessage = await newMessage.save();
			const sendBy = await getMessageSender(receivedMessage.senderId);
			wss.clients.forEach((client: { send: (arg0: string) => void; }) => {
				client.send(JSON.stringify({
					id: savedMessage.id,
					message: savedMessage.message,
					senderId: savedMessage.senderId,
					timestamp: savedMessage.timestamp,
					sendBy,
				}));
			});
		});
		const numberOfMessages = await Message.find().count();
		const skipValue = numberOfMessages - 10;
		if (!numberOfMessages) return ws.send(JSON.stringify([]));
		const availableMessages = skipValue > 0 ? await Message.find().skip(skipValue) : await Message.find();
		const messages = await Promise.all(availableMessages.map(async (message: IMessage) => {
			const sendBy = await getMessageSender(message.senderId);
			return {
				id: message.id,
				message: message.message,
				senderId: message.senderId,
				timestamp: message.timestamp,
				sendBy,
			};
		}));
		ws.send(JSON.stringify(messages));
	});
};
