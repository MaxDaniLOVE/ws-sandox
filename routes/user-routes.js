const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.post('/sign-up', async (req, res, next) => {
    try {
        const { password, email } = req.body;
        if (!password && !email) return next(new Error('No auth data provided'));
        const createdProfile = new User({
            userName: 'USERNAME',
            email,
            password: await bcrypt.hash(password, 12),
        });
        await createdProfile.save();
        const authToken = jwt.sign(
            { id: createdProfile.id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );
        res.send({ email: createdProfile.email, authToken, userName: createdProfile.userName })
    } catch (error) {
        console.log('Error', error);
        next();
    }
})

router.post('/sign-in', async (req, res, next) => {
    try {
        const { password, email } = req.body;
        if (!password && !email) return next(new Error('No auth data provided'));
        const userDocument = await User.findOne({ email })
        if (!userDocument) return next(new Error('Could not find user'));
        const { _doc: { _id, __v, ...documentData }, id } = userDocument;
        const existingUser = { ...documentData, id };
        const isValidPassword = await bcrypt.compare(password, existingUser.password);
        if (!isValidPassword) return next(new Error('Check your password'));
        const authToken = jwt.sign(
            { id: existingUser.id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );
        res.send({ email: existingUser.email, authToken, userName: existingUser.userName });
    } catch (error) {
        console.log('Error', error);
        next();
    }
})

router.get('/sign-out', async (req, res, next) => {
    try {
        res.send({ message: '/sign-out' })
    } catch (error) {
        console.log('Error', error);
        next();
    }
})

module.exports = router;
