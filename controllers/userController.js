const User = require('../models/userModel');
require("dotenv").config();
const crypto = require("crypto");

async function signup (req,res){
    try{
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({status : "failed", message : "All fields are required"});
        }
        if(password.length <6){
            return res.status(400).json({status : "failed", message : "Password must be atleast 6 characters long"});
        }

        const existingUser = await User.findOne({email});
        if(existingUser && existingUser.signupVerification){
            return res.status(400).json({status : "failed", message : "user already exists"})
        }
        
        const user = await User.create({name, email, password});
        
        const signupToken = await user.generateSignupToken();
        await user.save({validateBeforeSave : false});

        const myUrl = `${req.protocol}://${req.get("host")}/api/user/signup/verifySignup/${signupToken}`;
        
        const message = `We received a request to activate your account. Click the link below to activate it:\n ${myUrl}`;
        const options = {
            email : user.email,
            subject : "Account Activation",
            message
        }

        setTimeout(async () => {
            await User.findOneAndDelete({signupVerification: false });
            console.log("User deleted");
        }, 4 * 60 * 1000); // 4 minutes

        try{
            mailHelper(options)
            return res.status(200).json({status : "success", message : "Email sent successfully"});
        }catch(e){
            clearTimeout();
            console.log(e);
            user.signupToken = undefined;
            user.signupTokenExpire = undefined;
            await User.deleteOne({user});
            await user.save({validateBeforeSave : false});
            return res.status(400).json({status : "failed", message : "Something went wrong while sending email"});
        }
        
        // if(!user){
            // await cookieToken(user,res);
        //     return res.status(400).json({status : "failed", message : "Something went wrong while creating your account"});
        // }

        // await cookieToken(user,res);
        // return res.status(200).json({status : "success", message : "Account created successfully", user});
    }catch(error){
        console.log(error);
    }
}

async function signupVerification(req,res){
    const signupToken = req.params.signupToken;
    const encyrptedToken = crypto
        .createHash("sha256")
        .update(signupToken)
        .digest("hex");
        const user = await User.findOne({signupToken : encyrptedToken, signupTokenExpire : {$gt : Date.now()}})
        if(!user){
            return res.status(400).json({status : "failed", message : "Invalid token or token expired"});
        }

        user.signupVerification = true;
        user.signupToken = undefined;
        user.signupTokenExpire = undefined;
        await user.save();
        await cookieToken(user,res);
        return res.status(200).json({status : "success", message : "Account activated successfully"})
}


async function login(req,res){
    try {
        const {email, password} = req.body;
    
        if(!email || !password){
            return res.status(400).json({status : "failed", message : "All fields are required"});
        }

        const user = await User.findOne({email}).select("+password")
        // console.log(user)
        if(!user){
            return res.status(400).json({status : "failed", message : "Invalid credentials"});
        }
        if(!user.signupVerification){
            return res.status(400).json({status : "failed", message : "Please verify your email"});
        }
        const flag = await user.checkPassword(password);
        // console.log(`flag: ${flag}`)
        if(!flag){
            return res.status(400).json({status : "failed", message : "Email or password does not match"});
        }
        
        // const cookieToken =  (user,res)=>{
        //     const token = user.generateToken();
        //     const options = {
        //         expiresIn : new Date(Date.now() + process.env.COOKIE_TIME),
        //         httpOnly : true
        //     }
        //     res.cookie("token", token, options);
        //     user.password = undefined;

        // }

        await cookieToken(user,res);
        // console.log("msg from user controller below")
        // console.log(`cookie token generated is ${cookieToken}`)
        // console.log(res.cookie)
        
        return res.status(200).json({status : "success", message : "Logged in successfully", user: user});
    }
    catch(err){
        console.log(err);
    }
}

async function logout(req,res){
    res.cookie("token", null, {
        expires : new Date(Date.now()),
        httpOnly : true
    })
    res.status(200).json({succeess : true, message : "logout success"});
}

async function sendResetPasswordEmail(req,res){
    const {email} = req.body;
    if(!email){
        return res.status(400).json({status : "failed", message : "Email is required"});
    }

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({status : "failed", message : "No user found with this email"});
    }
    
    if(!user.signupVerification){
        return res.status(400).json({status : "failed", message : "You are not a registered user"});
    }

    const forgotToken = await user.generateForgotPasswordToken();
    await user.save({validateBeforeSave : false});

    
    const message = `We received a request to reset your password.The OTP is\n ${forgotToken}`;
    const options = {
        email : user.email,
        subject : "Reset Password",
        message
    }

    try{
        mailHelper(options)
        return res.status(200).json({status : "success", message : "Email sent successfully"});
    }catch(e){
        console.log(e);
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpire = undefined;
        await user.save({validateBeforeSave : false});
        return res.status(400).json({status : "failed", message : "Something went wrong while sending email"});
    }

}

async function resetPassword(req,res){
    const token = req.body.token;
        
    const user = await User.findOne({forgotPasswordToken : token, forgotPasswordExpire : {$gt : Date.now()}}).select("+password");
    if(!user){
        return res.status(400).json({status : "failed", message : "Invalid token or token expired"});
    }

    if(req.body.password !== req.body.confirmPassword){
        return res.status(400).json({status : "failed", message : "Password and confirm password does not match"});
    }
    // const pass = user.password;
    const {password} = req.body;
    const passwordCheck = await user.checkPassword(password);
    if(passwordCheck){
        return res.status(400).json({status : "failed", message : "New password and old password cannot be same"});
    }

    user.password = password;
    user.forgotPasswordToken = undefined;
    user.forgetPasswordExpire = undefined;
    await user.save();
    
    cookieToken(user,res);

    return res.status(200).json({status : "success", message : "Password reset successfully, you can go ahead"});
    
}

async function updatePassword(req,res){
    const userId = req.user.id
    const user = await User.findById(userId).select("+password")
    const {password, newPassword, confirmPassword} = req.body;
    
    if(!password || !newPassword || !confirmPassword){
        return res.status(400).json({status : "failed", message : "All fields are required"});
    }
    
    if(newPassword !== confirmPassword){
        return res.status(400).json({status : "failed", message : "New password and confirm password does not match"});
    }
    
    if(password === newPassword){
        return res.status(400).json({status : "failed", message : "New password and old password cannot be same"});
    }
    
    const flag = await user.checkPassword(password);
    if(!flag){
        return res.status(400).json({status : "failed", message : "Incorrect Password"});
    }

    user.password = newPassword;
    await user.save();

    const clientIP = req.ip; // Assuming you're using Express, this gets the client's IP address
    const geoLocationApiUrl = `https://ipinfo.io/${clientIP}/json`;
    
    try{    
        const response = await axios.get(geoLocationApiUrl);

        console.log('Geolocation API Response:', response.data);

        if (response.status === 200 && response.data && response.data.city && response.data.region && response.data.country) {
            const locationInfo = `${response.data.city}, ${response.data.region}, ${response.data.country}`;
            message = `Your password has been updated at ${new Date()} from ${locationInfo}. If it's not you, please contact support.`;
        } else {
            message = `Your password has been updated at ${new Date()}. If it's not you, please contact support.`;
        }
        const options = {
            email : user.email,
            subject : "Password Updated",
            message : message
        }
        try {
            mailHelper(options);
        } catch (error) {
            console.log("error while sending mail", error);
        }

    }catch(e){
        console.log("error while fetching location");
        console.log(e);
    }



    return res.status(200).json({status : "success", message : "Password updated successfully"});
}

async function darkMode(req,res){
    const userId = req.user.id;
    const user = await User.findById(userId);
    user.darkMode = !user.darkMode;
    await user.save();
    return res.status(200).json({status : "success", message : "Dark mode updated successfully"});
}

async function addUserDetails(req,res){
    const user = req.user;
    const {experience, age, speciality, bio} = req.body;
    user.experience = experience;
    user.age = age;
    user.speciality = speciality;
    user.bio = bio;
    await user.save();
    return res.status(200).json({status : "success", message : "User details updated successfully"});
}

// const search = async (req, res,next) => {
//     const query = req.query.q;
//     try {
//         const boards = await Board
//             .aggregate([
//                 {
//                     $search: {
//                         "index": "name",
//                         "text": {
//                           "path": "name",
//                           "query": query,
//                           "fuzzy": {}
//                         }
//                     }
//                 }
//             ])
//             .exec();
//         const lists = await List
//             .aggregate([
//                 {
//                     $search: {
//                         "index": "name",
//                         "text": {
//                           "path": "name",
//                           "query": query,
//                           "fuzzy": {}
//                         }
//                     }
//                 },
                
//             ])
//             .exec();
  
//         const cards = await Card
//             .aggregate([
//                 {
//                     $search: {
//                         "index": "name",
//                         "text": {
//                           "path": "name",
//                           "query": query,
//                           "fuzzy": {}
//                         }
//                     }
//                 },
//             ])
//             .exec();
//         res.json({
//           success : true,
//           data: {
//             boards, lists, cards
//           }
//         });
//     } catch (error) {
//         next(error);
//     }
//   };

const createOrder = async (req, res) => {
    try {
        const Razorpay = require('razorpay');
        require("dotenv").config();
        const { RAZORPAY_KEY_ID, RAZORPAY_SECRET_KEY } = process.env;


        const razorpayInstance = new Razorpay({
            key_id: RAZORPAY_KEY_ID,
            key_secret: RAZORPAY_SECRET_KEY
        });

        const options = {
            amount: 500 * 100,
            currency: "INR",
            partial_payment: false,
            payment_capture: 1
        };

        const order = await razorpayInstance.orders.create(options);
        return res.status(200).json({
            success: true,
            msg: 'Order Created',
            order_id: order.id,
            // amount:amount,
            key_id: RAZORPAY_KEY_ID,
            name: req.user.name,
            email: req.user.email,
            createdAt: Date.now(),
            order: order

        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
};

async function checkPayment(req, res) {
    body = req.body.order_id + "|" + req.body.payment_id;
    var crypto = require("crypto");
    var expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === req.body.signature) {
        const user = req.user;
        user.paymentStatus = true;
        user.save().then(() => {
            sendMail(user.email, req.body.order_id);
            // Redirect to the "dashboard" page using a GET request
            return res.status(200).redirect("/dashboard");
        }).catch((error) => {
            console.error("Error saving user:", error);
            return res.status(500).json({ status: "failure", error: "Error saving user" });
        });
    } else {
        response = { status: "failure" };
        // Handle payment failure, e.g., redirect or send an error response
        return res.status(400).json({ status: "failure", error: "Payment failed" });
    }
}

module.exports = { createOrder, checkPayment };
module.exports = {signup, login, logout, sendResetPasswordEmail, resetPassword, updatePassword, signupVerification, darkMode, addUserDetails}
