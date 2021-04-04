import mongoose from 'mongoose';
import { User } from '../models/user';

export const prepareAvatarUpdating = async (userId: string, isPhotoUpdate: boolean): Promise<void> => {
	const file = await mongoose
		.connection
		.collections['avatars.files']
		.findOneAndDelete({ filename: `${userId}.png` });
	if (file) {
		await mongoose
			.connection
			.collection('avatars.chunks')
			.findOneAndDelete({ files_id: file.value?._id });
	}
	await User.findByIdAndUpdate(userId, { hasPhoto: isPhotoUpdate });
};