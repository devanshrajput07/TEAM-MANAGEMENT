const express = require("express");
const router = express.Router();
const {createOrder, checkPayment} = require("../controllers/userController");
const paymentStatus = require("../middlewares/paymentStatus");

router.get("/test", isLoggedIn, paymentStatus.notCompleted, (req, res)=>{
    res.render("test")
})
router.post("/createOrder", isLoggedIn, paymentStatus.notCompleted ,createOrder)
    // res.render("test")
// router.post("/paymentStatus", isLoggedIn, paymentStatus.completed, (req, res)=>{
//     res.status(200).json({msg: "Payment status is completed"});
// })
// router.get("/markPaymentComplete", markPaymentComplete)
router.post("/checkPayment", isLoggedIn, checkPayment)

module.exports = router;