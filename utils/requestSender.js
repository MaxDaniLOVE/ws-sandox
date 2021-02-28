const User = require('../models/user');

const requestSender = async senderId => {
    const sender = await User.findById(senderId).exec();
    return sender ? {
        id: senderId,
        userName: sender._doc.userName,
        email: sender._doc.email,
    } : null;
}

module.exports = requestSender;