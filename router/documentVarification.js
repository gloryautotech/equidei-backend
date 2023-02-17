const express = require("express")

const { udyamDetails } = require('../controller/udhyam')
const { fetchDataWithCin } = require('../controller/cinFetch')
const router = express.Router()


// data with cin number
router.post('/cinFetchData', fetchDataWithCin)

// udhyam
router.post('/udhyamData', udyamDetails)

module.exports = router;