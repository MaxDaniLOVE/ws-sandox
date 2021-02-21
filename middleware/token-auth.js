const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    try {
        if (!authHeader) throw new Error();
        req.loggedUserData = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET_KEY);
        next();
    } catch (e) {
        next(new Error('Auth failed'));
    }
}