import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
	userName: string;
	email: string;
	password: string;
}

const userSchema = new mongoose.Schema({
	userName: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
});

export const User = mongoose.model<IUser>('User', userSchema);