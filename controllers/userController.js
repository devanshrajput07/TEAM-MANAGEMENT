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