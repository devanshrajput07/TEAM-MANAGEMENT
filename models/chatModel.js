const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        recieverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        message: {
            type: String,
            required: true
        }
    }
    , { timeStamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);