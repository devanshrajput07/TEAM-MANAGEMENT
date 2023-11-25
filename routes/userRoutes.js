const express = require("express");
const router = express.Router();
const bodyparser = require("body-parser")
const { createOrder, checkPayment } = require("../controllers/userController");
const paymentStatus = require("../middlewares/paymentStatus");
const path = require('path')
const multer = require('multer')
const ejs = require('ejs')

router.use(bodyparser.json())
router.use(bodyparser.urlencoded({ extended: true }))

// router.set('view engine', 'ejs')
// router.set('views', './views')
router.use(express.static('public'))

/*
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'))
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.orignalname
        cb(null, name)
    }
})

const upload = multer({ storage: storage })
*/

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

// router.post("/saveChat")

module.exports = router;