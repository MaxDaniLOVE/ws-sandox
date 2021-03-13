import { User } from '../models/user';

export const getMessageSender = async (senderId: string) => {
	const sender = await User.findById(senderId).exec();
	return sender ? {
		id: senderId,
		userName: sender.userName,
		email: sender.email,
	} : null;
};
