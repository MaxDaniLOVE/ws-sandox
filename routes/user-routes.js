const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.post('/sign-up', async (req, res, next) => {
    try {
        const { password, email } = req.body;
        if (!password && !email) return next(new Error('No auth data provided'));
        console.log(await bcrypt.hash(password, 12));
        res.send({ message: '/sign-up' })
    } catch (error) {
        console.log('Error', error);
        next();
    }
})

router.post('/sign-in', async (req, res, next) => {
    try {
        const { password, email } = req.body;
        if (!password && !email) return next(new Error('No auth data provided'));
        console.log(await bcrypt.hash(password, 12));
        res.send({ message: '/sign-in' })
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
