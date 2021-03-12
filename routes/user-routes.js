const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

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
            process.env.JWT_SECRET_KEY,
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
})

router.post('/sign-in', async (req, res, next) => {
    try {
        const { password, email } = req.body;
        if (!password || !email) res.status(400).send({ message: 'No auth data provided' });
        const userDocument = await User.findOne({ email })
        if (!userDocument) res.status(500).send({ message: 'Could not find user' });
        const { _doc: { _id, __v, ...documentData }, id } = userDocument;
        const existingUser = { ...documentData, id };
        const isValidPassword = await bcrypt.compare(password, existingUser.password);
        if (!isValidPassword) res.status(403).send({ message: 'Check your password' });
        const authToken = jwt.sign(
            { id: existingUser.id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
        );
        res.send({
            id: existingUser.id,
            email: existingUser.email,
            authToken,
            userName: existingUser.userName,
        });
    } catch (error) {
        res.status(500).send({ message: 'Sign in failed' });
    }
})

router.get('/sign-out', async (req, res, next) => {
    try {
        res.send({ message: '/sign-out' })
    } catch (error) {
        res.status(500).send({ message: 'Sign out failed' });
    }
})

module.exports = router;
