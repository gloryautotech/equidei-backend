const express = require("express")
const { aadharVerify } = require("../controller/aadhaarVerify");
const { gstinOtp, getSummary } = require('../controller/GST.Verification&Summaryfetch')
const { getGSTReportwithPassword, getGSTReportwithOTP } = require('../controller/gstReportFetch')
const { bankDocumentVerify } = require('../controller/bankVerify')
const { panVerify } = require('../controller/panVerify')
const { fetchDataWithCin } = require('../controller/cinFetch')
const router = express.Router()
const multer = require('multer')
const fs = require("fs");
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const upload = multer({
    dest: "uploads/",
    onError: function (err, next) {
        console.log('error', err);
        next(err);
    }
})
let mul = upload.array('file', 8)

// aadhar varify
router.post('/aadharVerify', mul, aadharVerify);

// gst summary
router.post('/gstinOtpsend', gstinOtp);
router.post('/getSummary', getSummary)

// pan varify
router.post('/panVerify', mul, panVerify)

// data with cin number
router.post('/cinFetchData', fetchDataWithCin)

// gst report
router.post('/getGSTReportwithPassword', getGSTReportwithPassword)
router.post('/getGSTReportwithOTP', getGSTReportwithOTP)

// bank document verify
router.post('/bankVerify', mul, bankDocumentVerify)


module.exports = router;