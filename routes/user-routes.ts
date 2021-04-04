import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middleware/token-auth';
import multer from 'multer';
import { createModel } from 'mongoose-gridfs';
import stream from 'stream';
import { getServiceBaseUrl } from '../utils/getServiceBaseUrl';
import { prepareAvatarUpdating } from '../utils/removeAvatar';

const router = express.Router();
const upload = multer();

router.post('/sign-up', async (req, res, next) => {
	try {
		const { password, email, userName } = req.body;
		if (!password || !email || !userName) res.status(400).send({ message: 'No auth data provided' });
		const createdProfile = new User({
			userName,
			email,
			password: await bcrypt.hash(password, 12),
		});
		await createdProfile.save();
		const authToken = jwt.sign(
			{ id: createdProfile.id },
			process.env.JWT_SECRET_KEY!,
			{ expiresIn: '1h' }
		);
		res.send({
			id: createdProfile.id,
			email: createdProfile.email,
			authToken,
			userName: createdProfile.userName,
		});
	} catch (error) {
		res.status(500).send({ message: 'Sign up failed' });
	}
});

router.post('/sign-in', async (req, res, next) => {
	try {
		const { password, email } = req.body;
		if (!password || !email) res.status(400).send({ message: 'No auth data provided' });
		const userDocument = await User.findOne({ email });
		if (!userDocument) res.status(500).send({ message: 'Could not find user' });
		const existingUser = {
			userName: userDocument?.userName,
			email: userDocument?.email,
			password: userDocument?.password || '',
			id: userDocument?.id,
		};
		const isValidPassword = await bcrypt.compare(password, existingUser.password);
		if (!isValidPassword) res.status(403).send({ message: 'Check your password' });
		const authToken = jwt.sign(
			{ id: existingUser.id },
			process.env.JWT_SECRET_KEY!,
			{ expiresIn: '1h' }
		);
		const avatar = userDocument?.hasPhoto ? `${getServiceBaseUrl(req)}/user/${existingUser?.id}/avatar` : null;
		res.send({
			id: existingUser.id,
			email: existingUser.email,
			authToken,
			userName: existingUser.userName,
			avatar,
		});
	} catch (error) {
		res.status(500).send({ message: 'Sign in failed' });
	}
});

router.get('/sign-out', async (req, res, next) => {
	try {
		res.send({ message: '/sign-out' });
	} catch (error) {
		res.status(500).send({ message: 'Sign out failed' });
	}
});

router.get('/:userId/avatar', async (req, res, next) => {
	try {
		const Avatar = createModel({ modelName: 'Avatar' });
		Avatar.read({ filename: `${req.params.userId}.png` }, (err, buffer) => {
			if (err) return next(err);
			const readStream = new stream.PassThrough();
			readStream.end(buffer);
			readStream.pipe(res);
		});
	} catch (error) {
		res.status(500).send({ message: 'Something went wrong' });
	}
});

router.use(authMiddleware);

router.put('/logged/avatar', upload.single('avatar'), async (req, res, next) => {
	try {
		const readStream = new stream.PassThrough();
		readStream.end(req.file.buffer);
		const userId = req.loggedUserData.id;
		const options = ({ filename: `${userId}.png`, contentType: 'image/png' });
		const Avatar = createModel({ modelName: 'Avatar' });
		await prepareAvatarUpdating(userId, true);
		Avatar.write(options, readStream, async (error: any) => {
			if (error) throw new Error(error);
			res.send({ avatar: `${getServiceBaseUrl(req)}/user/${userId}/avatar` });
		});
	} catch (error) {
		res.status(500).send({ message: 'Saving avatar failed' });
	}
});

router.delete('/logged/avatar', async (req, res) => {
	try {
		const userId = req.loggedUserData.id;
		await prepareAvatarUpdating(userId, false);
		res.status(200).send({ message: 'Successfully deleted' });
	} catch (error) {
		res.status(500).send({ message: 'Deleting avatar failed' });
	}
});

export const userRoutes = router;
