import mongoose, { Document } from 'mongoose';

export interface IMessage extends Document {
	message: string;
	senderId: string;
	timestamp: string;
}

const messageSchema = new mongoose.Schema({
	message: { type: String, required: true },
	senderId: { type: String, required: true },
	timestamp: { type: Date, required: true },
});

export const Message = mongoose.model<IMessage>('Message', messageSchema);