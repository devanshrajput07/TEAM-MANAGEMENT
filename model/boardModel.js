const mongoose = require("mongoose");


const boardSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },

    description : {
        type : String,
        required : true,
        trim : true
    },

    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },

    members : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],

    lists : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "List"
    }],

    cards : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Card"
    }],

    // color : {
    //     type : String,
    //     default : "#0079bf"
    // },

    archived : {
        type : Boolean,
        default : false
    }

}, { timestamps : true });



module.exports = mongoose.model("Board", boardSchema);