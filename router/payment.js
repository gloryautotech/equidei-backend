const express = require("express")
const router = express.Router()

const { paymentTokenCreate,getPaymentStatus} = require("../controller/payment")

router.post('/createPaymentToken', paymentTokenCreate)

router.post('/paymentStatus',getPaymentStatus)


module.exports = router