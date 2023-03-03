const assetModel = require("../model/asset")
const APIFeatures = require('../utils/apiFeatures');
const { constants, messages } = require("../constants.js");
const response = require('../lib/responseLib');



const assetRegister = async (req, res) => {
    try {
        let data = req.body;
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
        let assetData = await assetModel.find()
        let apiResponse = response.generate(constants.SUCCESS, messages.asset.GETASSETLIST, constants.HTTP_SUCCESS, assetData);
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
const getAllAssetListByQuery = async (req, res) => {
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

const getPaidAsset = async function (req, res) {
    try {
        let asset = await assetModel.find({ isPayment: true })
        let apiResponse = response.generate(constants.SUCCESS, messages.asset.GETASSETLIST, constants.HTTP_SUCCESS, asset);
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

const verify = async function (req, res) {
    try {
        let id = req.body.id
        let asset = await assetModel.findById(id)
        if (!asset) {
            let apiResponse = response.generate(constants.ERROR, messages.asset.NOTFOUND, constants.HTTP_NOT_FOUND, null)
            res.status(400).send(apiResponse);
        }
        else {
            if (asset.assetType == "plantAndMachinary") {
                asset.purchaseBill.status = req.body.purchaseBill.status;
                asset.purchaseBill.message = req.body.purchaseBill.message ? req.body.purchaseBill.message : " ";
                asset.taxInvoice.status = req.body.taxInvoice.status;
                asset.taxInvoice.message = req.body.taxInvoice.message ? req.body.taxInvoice.message : " ";
                asset.insuranceDoc.status = req.body.insuranceDoc.status;
                asset.insuranceDoc.message = req.body.insuranceDoc.message ? req.body.insuranceDoc.message : " ";
                asset.fixedAssetRegister.status = req.body.fixedAssetRegister.status;
                asset.fixedAssetRegister.message = req.body.fixedAssetRegister.message ? req.body.fixedAssetRegister.message : " ";
                asset.oldValuationReport.status = req.body.oldValuationReport.status;
                asset.oldValuationReport.message = req.body.oldValuationReport.message ? req.body.oldValuationReport.message : " ";
                asset.chargesPending.status = req.body.chargesPending.status;
                asset.chargesPending.message = req.body.chargesPending.message ? req.body.chargesPending.message : " ";
                asset.assetInvoice.status = req.body.assetInvoice.status;
                asset.assetInvoice.message = req.body.assetInvoice.message ? req.body.assetInvoice : " ";
                asset.technicalSpecifications.status = req.body.technicalSpecifications.status;
                asset.technicalSpecifications.message = req.body.technicalSpecifications.message ? req.body.technicalSpecifications.message : " ";

                asset = await asset.save();
                let apiResponse = response.generate(constants.SUCCESS, messages.asset.VERIFY, constants.HTTP_SUCCESS, asset);
                res.status(200).send(apiResponse);
            } else {
                asset.propertyTax.status = req.body.propertyTax.status;
                asset.propertyTax.message = req.body.propertyTax.message ? req.body.propertyTax.message : " ";
                asset.insuranceDoc.status = req.body.insuranceDoc.status;
                asset.insuranceDoc.message = req.body.insuranceDoc.message ? req.body.insuranceDoc.message : " ";
                asset.powerOfAttorney.status = req.body.powerOfAttorney.status;
                asset.powerOfAttorney.message = req.body.powerOfAttorney.message ? req.body.powerOfAttorney.message : " ";
                asset.invoice.status = req.body.invoice.status;
                asset.invoice.message = req.body.invoice.message ? req.body.invoice.message : " ";
                asset.clearanceCertificate.status = req.body.clearanceCertificate.status;
                asset.clearanceCertificate.message = req.body.clearanceCertificate.message ? req.body.clearanceCertificate.message : " ";
                asset.fixedAssetRegister.status = req.body.fixedAssetRegister.status;
                asset.fixedAssetRegister.message = req.body.fixedAssetRegister.message ? req.body.fixedAssetRegister.message : " ";
                asset.oldValuationReport.status = req.body.oldValuationReport.status;
                asset.oldValuationReport.message = req.body.oldValuationReport.message ? req.body.oldValuationReport.message : " ";
                asset.pendingCharges.status = req.body.pendingCharges.status;
                asset.pendingCharges.message = req.body.pendingCharges.message ? req.body.pendingCharges.message : " ";

                asset = await asset.save();
                let apiResponse = response.generate(constants.SUCCESS, messages.asset.VERIFY, constants.HTTP_SUCCESS, asset);
                res.status(200).send(apiResponse);
            }
        }
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



module.exports = { assetRegister, updateAsset, getAllAssetListByQuery, getAssetListById, getAllAssetList, getPaidAsset, verify }
