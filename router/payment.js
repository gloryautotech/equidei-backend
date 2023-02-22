const express = require("express")
const router = express.Router()

const { paymentTokenCreate} = require("../controller/payment")

router.post('/createPaymentToken', paymentTokenCreate)


module.exports = router