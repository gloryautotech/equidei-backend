const express = require("express")
const router = express.Router()

const { paymentTokenCreate,getPaymentStatus,history} = require("../controller/payment")

router.post('/createPaymentToken', paymentTokenCreate)

router.post('/paymentStatus',getPaymentStatus)
router.get('/history',history)


module.exports = router