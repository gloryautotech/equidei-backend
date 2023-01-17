const express = require("express")
const router = express.Router()

const { assetRegister, updateAsset, getAllAssetListByQuery, getAssetListById,getAllAssetList} = require("../controller/asset")

router.post('/register', assetRegister)
router.post('/getAllAssetListByQuery', getAllAssetListByQuery)
router.get('/getAllAssetList',getAllAssetList)
router.get('/getAllAssetListById',getAssetListById)
router.put('/updateAsset',updateAsset)

module.exports = router