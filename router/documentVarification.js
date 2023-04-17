const express = require("express")
const { fetchDataWithCin ,gstVerify,udyamDetails,gstReportFetch,gstReport,camReport} = require('../controller/companyDocument')
const { bankVerify, allBankList, panVerify, aadharVerify,eSignature,eStamping,callbackUrl } = require("../controller/documentVerify")
const { pinataPinning, fetchIpfsFile, approve } = require('../controller/pinata')
const {pinataUpload}=require("../controller/newrl")
const router = express.Router()

const multer = require('multer')
const upload = multer({
    dest: "uploads/",
    onError: function (err, next) {
        console.log('error', err);
        next(err);
    }
})
let mul = upload.array('file', 8)

// data with cin number
router.post('/cinFetchData', fetchDataWithCin)

// udhyam
router.post('/udhyamData', udyamDetails)

// bank verify 
router.post('/bankVerify', bankVerify)
router.get('/bankList', allBankList)

// aadhar and pan verify
router.post('/aadharVerify', aadharVerify)
router.post('/panVerify', panVerify)


// GST verify
router.post('/gstVerify', gstVerify)
router.post('/gstReport',gstReport)
router.post("/camReport",mul,camReport)

// pinat ipfs file upload 
router.post('/pinataIpfs', mul, pinataPinning)
router.get('/getIpfsData/:cid', fetchIpfsFile)
router.get('/approvePdf/:assetId', approve)


// estamping and esigning
router.post('/eSignature/:assetId',eSignature)
router.post('/eStamping/:assetId',eStamping)
router.post('/callbackUrl',callbackUrl)

router.post('/newrl',pinataUpload)


module.exports = router;