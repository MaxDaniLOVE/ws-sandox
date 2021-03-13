import express  from 'express';
import bodyParser from 'body-parser';
import { userRoutes } from './routes/user-routes';
import { initSocket } from './ws';
import { config } from 'dotenv';
import { authMiddleware } from './middleware/token-auth';
import { initDatabase } from './utils/initDatabase';
import { errorHandler } from './middleware/error-handler';

config();
const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', process.env.ORIGIN);
	res.header(
		'Access-Control-Allow-Headers',
		'X-Auth-Token, Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200);
	}
	next();
});

const server: any = app.listen(port, () => console.log('Listening', server.address()));
app.use('/user', userRoutes);
app.use(authMiddleware);
app.use(errorHandler);
initSocket(server);
initDatabase();