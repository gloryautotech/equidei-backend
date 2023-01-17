const assetModel = require("../model/asset")
const APIFeatures = require('../utils/apiFeatures');
const { constants, messages } = require("../constants.js");
const response = require('../lib/responseLib');



const assetRegister = async (req, res) => {
    try {
        let data = req.body;
        data["status"] = "pending registration"
        let addAsset = await assetModel.create(data)
        let apiResponse = response.generate(constants.SUCCESS, messages.asset.SUCCESS, constants.HTTP_CREATED, addAsset);
        res.status(201).send(apiResponse);

    } catch (err) {
        let apiResponse = response.generate(
            constants.ERROR,
            messages.asset.FAILURE,
            constants.HTTP_SERVER_ERROR,
            err
        );
        res.status(500).send(apiResponse);
    }
}

const updateAsset = async (req, res) => {
    try {
        let assetId = req.query.registerId;
        let data = req.body
        let updatedAsset = await assetModel.findByIdAndUpdate(assetId, { $set: data }, { upsert: true, new: true },)
        updatedAsset = updatedAsset.toObject();
        if (updatedAsset.assetType == "plantAndMachinery") {
            if (updatedAsset.purchaseBill && updatedAsset.taxInvoice && updatedAsset.insuranceDoc && updatedAsset.assetInvoice && updatedAsset.technicalSpecifications && updatedAsset.assetName && updatedAsset.tenure && updatedAsset.yearOfManufacture && updatedAsset.serialNumber && updatedAsset.assetMake && updatedAsset.assetModel && updatedAsset.assetValue && updatedAsset.technicalSpecifications && updatedAsset.otpVerification) {
                const newUpdatedAsset = await assetModel.findByIdAndUpdate(assetId, { status: "registered" }, { upsert: true, new: true },)
                let apiResponse = response.generate(constants.SUCCESS, messages.asset.UPDATE, constants.HTTP_SUCCESS, newUpdatedAsset);
                return res.status(200).send(apiResponse);
            } else if (updatedAsset.purchaseBill && updatedAsset.taxInvoice && updatedAsset.insuranceDoc && updatedAsset.assetInvoice && updatedAsset.technicalSpecifications && updatedAsset.assetName && updatedAsset.tenure && updatedAsset.yearOfManufacture && updatedAsset.serialNumber && updatedAsset.assetMake && updatedAsset.assetModel && updatedAsset.assetValue && updatedAsset.technicalSpecifications && !updatedAsset.otpVerification) {
                const newUpdatedAsset = await assetModel.findByIdAndUpdate(assetId, { status: "pending verification" }, { upsert: true, new: true },)
                let apiResponse = response.generate(constants.SUCCESS, messages.asset.UPDATE, constants.HTTP_SUCCESS, newUpdatedAsset);
                return res.status(200).send(apiResponse);
            }
        } else if (updatedAsset.assetType == "realEsate") {
            if (updatedAsset.propertyTax && updatedAsset.oldValuationReport && updatedAsset.assetName && updatedAsset.tenure && updatedAsset.landOwner && updatedAsset.titleDeed && updatedAsset.landRegistry && updatedAsset.assetValue && updatedAsset.otpVerification) {
                let newUpdatedAsset = await assetModel.findByIdAndUpdate(assetId, { status: "registered" }, { upsert: true, new: true },)
                let apiResponse = response.generate(constants.SUCCESS, messages.asset.UPDATE, constants.HTTP_SUCCESS, newUpdatedAsset);
                return res.status(200).send(apiResponse);
            } else if (updatedAsset.propertyTax && updatedAsset.oldValuationReport && updatedAsset.assetName && updatedAsset.tenure && updatedAsset.landOwner && updatedAsset.titleDeed && updatedAsset.landRegistry && updatedAsset.assetValue && !updatedAsset.otpVerification) {
                let newUpdatedAsset = await assetModel.findByIdAndUpdate(assetId, { status: "pending verification" }, { upsert: true, new: true },)
                let apiResponse = response.generate(constants.SUCCESS, messages.asset.UPDATE, constants.HTTP_SUCCESS, newUpdatedAsset);
                return res.status(200).send(apiResponse);
            }
        }
        let apiResponse = response.generate(constants.SUCCESS, messages.asset.UPDATE, constants.HTTP_SUCCESS, updatedAsset);
        res.status(200).send(apiResponse);
    } catch (err) {
        let apiResponse = response.generate(
            constants.ERROR,
            messages.asset.FAILURE,
            constants.HTTP_SERVER_ERROR,
            err
        );
        res.status(500).send(apiResponse);
    }
}

const getAllAssetList = async (req, res) => {
    try {
        const features = new APIFeatures(assetModel.find({}), req.body)
            .sort()
            .limitFields()
            .paginate()
            .filter();
        const assetListData = await features.query;
        const responeDataForAsset = JSON.parse(JSON.stringify(assetListData));
        let apiResponse = response.generate(constants.SUCCESS, messages.asset.GETASSETLIST, constants.HTTP_SUCCESS, responeDataForAsset);
        res.status(200).send(apiResponse);
    } catch (err) {
        let apiResponse = response.generate(
            constants.ERROR,
            messages.asset.FAILURE,
            constants.HTTP_SERVER_ERROR,
            err
        );
        res.status(500).send(apiResponse);
    }
}

const getAssetListById = async (req, res) => {
    try {
        let assetId = req.query.registerId
        let getAssetData = await assetModel.findById(assetId)
        let apiResponse = response.generate(constants.SUCCESS, messages.asset.GETASSETLIST, constants.HTTP_SUCCESS, getAssetData);
        res.status(200).send(apiResponse);
    } catch (err) {
        let apiResponse = response.generate(
            constants.ERROR,
            messages.asset.FAILURE,
            constants.HTTP_SERVER_ERROR,
            err
        );
        res.status(500).send(apiResponse);
    }
}

module.exports = { assetRegister, updateAsset, getAllAssetList, getAssetListById }
