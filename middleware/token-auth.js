const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    try {
        if (!authHeader) res.status(401).send({ message: 'No auth header provided' });
        req.loggedUserData = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET_KEY);
        next();
    } catch (e) {
        res.status(500).send({ message: 'Auth failed' });
    }
}