const express = require("express")
const router = express.Router()

const { assetRegister, updateAsset, getAllAssetListByQuery, getAssetListById, getAllAssetList, getPaidAsset, verify, decline } = require("../controller/asset")

router.post('/register', assetRegister)
router.post('/getAllAssetListByQuery', getAllAssetListByQuery)
router.get('/getAllAssetList/:email', getAllAssetList)
router.get('/getAllAssetListById', getAssetListById)
router.put('/updateAsset', updateAsset)
router.get('/paidAssetList', getPaidAsset)
router.post('/verify', verify)
router.post('/decline/:assetId', decline)

module.exports = router