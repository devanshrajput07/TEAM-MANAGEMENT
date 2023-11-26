const express = require("express");
const router = express.Router();
const { signup, signupVerification, login, logout, sendResetPasswordEmail, resetPassword, updatePassword, darkMode, addUserDetails } = require("../controllers/userController");
const { createOrder, checkPayment } = require("../controllers/userController");
const paymentStatus = require("../middlewares/paymentStatus");

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
    .post( updatePassword)

router.route("/darkMode")
    .get( darkMode)

router.route("/addUserDetails")
    .post( addUserDetails)


/*
router.get("/test", isLoggedIn, paymentStatus.notCompleted, (req, res) => {
    res.render("test")
})
router.post("/createOrder", isLoggedIn, paymentStatus.notCompleted, createOrder)
res.render("test")
router.post("/paymentStatus", isLoggedIn, paymentStatus.completed, (req, res) => {
    res.status(200).json({ msg: "Payment status is completed" });
})
router.get("/markPaymentComplete", markPaymentComplete)
router.post("/checkPayment", isLoggedIn, checkPayment)
*/

module.exports = router;