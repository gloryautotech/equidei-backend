const express = require("express")
const router = express.Router()

const { paymentTokenCreate,getPaymentStatus,history} = require("../controller/payment")

const {CreateOrder,VerifyOrder} = require("../controller/razorpay")

router.post('/createPaymentToken', paymentTokenCreate)

router.post('/paymentStatus',getPaymentStatus)
router.get('/history',history)

// razorpay
router.post("/createOrder",CreateOrder)
router.post("/verifyOrder",VerifyOrder)

module.exports = router