const express = require("express")
const router = express.Router()

const { loanRequest, approveLoan, removeLoan, getAllLoan, getLoanById } = require("../controller/loan")

router.post("/loanRequest/:userId", loanRequest)
router.put("/approveLoan/:loanId", approveLoan)
router.delete("/removeLoan/:loanId", removeLoan)
router.get("/getLoan/:loanId",getLoanById)
router.get("/getLoan",getAllLoan)

module.exports = router