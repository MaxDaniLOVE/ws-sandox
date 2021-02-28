const express = require('express');
const port = process.env.PORT || 8080;
const app = express();
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user-routes');
const initSocket = require('./ws');
require('dotenv').config();
const authMiddleware = require('./middleware/token-auth');
const initDatabase = require('./utils/initDatabase');

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
const server = app.listen(port, () => console.log('Listening', server.address()));
app.use('/user', userRoutes);
app.use(authMiddleware);
initSocket(server);
initDatabase();