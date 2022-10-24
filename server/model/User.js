const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    isOnline: {
        type: Boolean,
        require: true
    },
    socketId: {
        type: String,
    }
})

module.exports = User = mongoose.model("users", UserSchema);