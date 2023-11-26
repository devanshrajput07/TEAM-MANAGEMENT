const Mongoose = require('mongoose')

const plannerSchema = new Mongoose.Schema({
    date : {
        type : String
    },
    note : {
        type : String,
        default : ""
    },
    UserId : {
        type : Mongoose.Schema.Types.ObjectId,
        ref : 'user',
        required : true
    }
},
{
    timestamps: true
})

const Planner = new Mongoose.model("planner", plannerSchema);
module.exports = Planner