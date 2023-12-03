const express = require("express");
const router = express.Router();
const {signup, signupVerification, login, logout, sendResetPasswordEmail,resetPassword, updatePassword, darkMode, addUserDetails, getUserDetails} = require("../controller/userController");
const {isLoggedIn} = require("../middleware/userMiddleware");
const paymentStatus = require("../middleware/paymentStatus");
const passport = require("../config/passportConfig");

router.route("/signup/")
    .post(signup);

router.route("/signup/verifySignup/:signupToken/")
    .get(signupVerification);

router.route("/login/")
    .post(login);

router.route("/logout/")
    .get(logout)

router.route("/password/resetEmail/")
    .post(sendResetPasswordEmail)                   //send reset password OTP store it into db and then 

router.route("/password/resetPassword/")
    .post(resetPassword)

// router.route("/password/loginWithoutPassword/:forgotToken")
//     .get(loginWithoutPassword)


router.route("/password/updatePassword/")
    .post(isLoggedIn, updatePassword)

router.route("/darkMode/")
    .get(isLoggedIn, darkMode)

router.route("/addUserDetails/")
    .post(isLoggedIn, addUserDetails)

router.route("/getUserDetails/:id")
    .get(isLoggedIn, getUserDetails)

router.get("/gAuth/googleOAuth", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/gAuth/googleOAuth/callback", passport.authenticate("google", {failureRedirect: "/",}), (req, res, next) => { next();});
// payments
router.post("/createOrder/", isLoggedIn, paymentStatus.notCompleted ,createOrder)
router.post("/checkPayment/", isLoggedIn, checkPayment)


// router.route("/sendIndividualMessage/:id")
//     .post(isLoggedIn, sendIndividualMessage)


module.exports = router;