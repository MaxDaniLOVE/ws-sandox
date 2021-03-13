import mongoose from 'mongoose';

export const initDatabase = () => {
	try {
		mongoose
			.connect(
				process.env.DB_URL!,
				{ useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false }
			);
		console.log('Success db connection');
	} catch (e) {
		console.log('Failed db connection');
	}
};
