const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const validator = require("validator");
const crypto = require("crypto");

const generateNumericOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};


const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: [true, "Please enter your name"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please enter your email"],
            // validate: [validator.isEmail, "Please enter a valid email"],
            trim: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, "Please enter your password"],
            select: false,
            // minlength: [6, "Password must be at least 6 characters long"],
            // maxlength: [20, "Password must be at most 20 characters long"],
        },
        
        forgotPasswordToken: {
            type: Number,
        },
        forgotPasswordExpire: {
            type: Date,
            default: Date.now()   //15 minutes
        },
        
        signupToken : {
            type : String,
        },
        signupTokenExpire : {
            type : Date,
            default : Date.now()
        },
        signupVerification : {
            type : Boolean,
            default : false
        },

        isPremium : {
            type : Boolean,
            default : false
        },
        
        boards : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Board"
        }],

        experience : {
            type : Number,
            default : 0
        },
        
        age : {
            type : Number,
            default : 0
        },

        speciality : {
            type : String,
            default : ""
        },

        bio :{
            type : String,
            default : ""
        }

        
        // darkMode : {
        //     type : Boolean,
        //     default : false
        // },

        // cards : [{
            //     type : mongoose.Schema.Types.ObjectId,
        //     ref : "Card"
        // }],

        // lists : [{
            //     type : mongoose.Schema.Types.ObjectId,
            //     ref : "List"
            // }],

            // checklists : [{
                //     type : mongoose.Schema.Types.ObjectId,
        //     ref : "Checklist"
        // }],

        // labels : [{
        //     type : mongoose.Schema.Types.ObjectId,
        //     ref : "Label"
        // }],

        // notifications : [{
        //     type : mongoose.Schema.Types.ObjectId,
        //     ref : "Notification"
        // }],
        
        // activities : [{
            //     type : mongoose.Schema.Types.ObjectId,
        //     ref : "Activity"
        // }],

        // teams : [{
        //     type : mongoose.Schema.Types.ObjectId,
        //     ref : "Team"
        // }],
        
        // isVerified : {
            //     type : Boolean,
            //     default : false
            // },

            

        
        
        // isOnline : {
        //     type : Boolean,
        //     default : false
        // },
        
        // image : {
        //     type : String,
        //     required : false
        // },
    },
    { timeStamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    
    this.password = await bcrypt.hash(this.password, 10);

    next();
});


userSchema.methods.checkPassword = async function (userSendPassword) {
    //console.log(`this.password== ${this.password}`)         //TODO:
    //console.log(`userSendPassword ${userSendPassword}`)     //TODO:
    const flag =  await bcrypt.compare(userSendPassword, this.password);
    return flag
};

userSchema.methods.generateToken = async function () {
    return await jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY_TIME,
    });
};

userSchema.methods.generateForgotPasswordToken = async function () {
    // const resetToken = crypto.randomBytes(20).toString("hex");
    // //make sure to hash to token sent by the user and then compare it with the hashed token in the database
    // this.forgotPasswordToken = crypto
    //     .createHash("sha256")
    //     .update(resetToken)
    //     .digest("hex");

    // this.forgotPasswordExpire = Date.now()+15*60*1000;
    // return resetToken;

    const resetToken = generateNumericOTP();
    this.forgotPasswordToken = resetToken;
    this.forgotPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;

};

userSchema.methods.generateSignupToken = async function (){
    const signupToken = crypto.randomBytes(20).toString("hex");
    this.signupToken = crypto
        .createHash("sha256")
        .update(signupToken)
        .digest("hex");
    this.signupTokenExpire = Date.now()+5*60*1000;
    return signupToken;
}

module.exports = mongoose.model("User", userSchema);