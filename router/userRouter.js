const express = require("express");
const router = express.Router();
const {signup, signupVerification, login, logout, sendResetPasswordEmail,resetPassword, updatePassword} = require("../controller/userController");
const {isLoggedIn} = require("../middleware/userMiddleware");

router.route("/signup")
    .post(signup);

router.route("/signup/verifySignup/:signupToken")
    .get(signupVerification);

router.route("/login")
    .post(login);

router.route("/logout")
    .get(logout)

router.route("/password/resetEmail")
    .post(sendResetPasswordEmail)                   //send reset password OTP store it into db and then 

router.route("/password/resetPassword")
    .post(resetPassword)

router.route("/password/updatePassword")
    .post(isLoggedIn, updatePassword)



module.exports = router;