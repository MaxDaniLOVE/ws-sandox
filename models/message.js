const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    senderId: { type: String, required: true },
    timestamp: { type: Date, required: true },
});

module.exports = mongoose.model('Message', messageSchema);