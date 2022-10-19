const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new mongoose.Schema({
    message: String,
    sender: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    receiver: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    update_at: {
        type: Date,
    }
})

module.exports = Message = mongoose.model("messages", MessageSchema);