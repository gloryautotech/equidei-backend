const express = require("express")
const { udyamDetails } = require('../controller/udhyam')
const { fetchDataWithCin } = require('../controller/cinFetch')
const { bankVerify, allBankList } = require("../controller/bankVerify")
const { gstVerify } = require("../controller/gstVerify")
const { pinataPinning, fetchIpfsFile, approve } = require('../controller/pinata')
const { panVerify, aadharVerify } = require("../controller/parsonalDocumentVerify")
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
router.post('/bankVerify', mul, bankVerify)
router.get('/bankList', allBankList)

// aadhar and pan verify
router.post('/aadharVerify', aadharVerify)
router.post('/panVerify', panVerify)


// GST verify
router.post('/gstVerify', gstVerify)

// pinat ipfs file upload 
router.post('/pinataIpfs', mul, pinataPinning)
router.get('/getIpfsData/:cid', fetchIpfsFile)
router.get('/approvePdf/:assetId', approve)

module.exports = router;