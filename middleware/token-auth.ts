import jwt from 'jsonwebtoken';

export const authMiddleware = (req: any, res: any, next: any) => {
	const { authToken } = req.cookies;
	try {
		if (!authToken) res.status(401).send({ message: 'No auth header provided' });
		req.loggedUserData = jwt.verify(authToken, process.env.JWT_SECRET_KEY!);
		next();
	} catch (e) {
		res.status(500).send({ message: 'Auth failed' });
	}
};