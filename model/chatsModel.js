const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const validator = require("validator");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
        
    {
        senderId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },

        recieverId : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        message : {
            type : String,
            required : true
        }





    }
    ,{ timeStamps: true }
);



module.exports = mongoose.model("User", userSchema);