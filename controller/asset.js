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
        let id = req.body.assetId
        let asset = await assetModel.findById(id)
        if (!asset) {
            let apiResponse = response.generate(constants.ERROR, messages.asset.NOTFOUND, constants.HTTP_NOT_FOUND, null)
            res.status(400).send(apiResponse);
        }
        else {
            if (asset.assetType == "plantAndMachinary") {
                asset.purchaseBill.isVerified = req.body.purchaseBill.isVerified;
                asset.purchaseBill.message = req.body.purchaseBill.message ? req.body.purchaseBill.message : " ";
                asset.taxInvoice.isVerified = req.body.taxInvoice.isVerified;
                asset.taxInvoice.message = req.body.taxInvoice.message ? req.body.taxInvoice.message : " ";
                asset.insuranceDoc.isVerified = req.body.insuranceDoc.isVerified;
                asset.insuranceDoc.message = req.body.insuranceDoc.message ? req.body.insuranceDoc.message : " ";
                asset.fixedAssetRegister.isVerified = req.body.fixedAssetRegister.isVerified;
                asset.fixedAssetRegister.message = req.body.fixedAssetRegister.message ? req.body.fixedAssetRegister.message : " ";
                asset.oldValuationReport.isVerified = req.body.oldValuationReport.isVerified;
                asset.oldValuationReport.message = req.body.oldValuationReport.message ? req.body.oldValuationReport.message : " ";
                asset.chargesPending.isVerified = req.body.chargesPending.isVerified;
                asset.chargesPending.message = req.body.chargesPending.message ? req.body.chargesPending.message : " ";
                asset.assetInvoice.isVerified = req.body.assetInvoice.isVerified;
                asset.assetInvoice.message = req.body.assetInvoice.message ? req.body.assetInvoice.message : " ";
                asset.technicalSpecifications.isVerified = req.body.technicalSpecifications.isVerified;
                asset.technicalSpecifications.message = req.body.technicalSpecifications.message ? req.body.technicalSpecifications.message : " ";
                asset.valuationReport = req.body.valuationReport ? req.body.valuationReport : " ";
                asset.estimatedValuation = req.body.estimatedValuation ? req.body.estimatedValuation : 0;
                if (asset.purchaseBill.isVerified &&
                    asset.taxInvoice.isVerified &&
                    asset.insuranceDoc.isVerified &&
                    asset.fixedAssetRegister.isVerified &&
                    asset.oldValuationReport.isVerified &&
                    asset.chargesPending.isVerified &&
                    asset.assetInvoice.isVerified &&
                    asset.technicalSpecifications.isVerified
                ) {
                    asset.status = "Verification Complete"
                } else {
                    asset.status = "Rejected"
                }
                asset = await asset.save();
                let apiResponse = response.generate(constants.SUCCESS, messages.asset.VERIFY, constants.HTTP_SUCCESS, asset);
                res.status(200).send(apiResponse);
            } else {
                asset.propertyTax.isVerified = req.body.propertyTax.isVerified;
                asset.propertyTax.message = req.body.propertyTax.message ? req.body.propertyTax.message : " ";
                asset.insuranceDoc.isVerified = req.body.insuranceDoc.isVerified;
                asset.insuranceDoc.message = req.body.insuranceDoc.message ? req.body.insuranceDoc.message : " ";
                asset.powerOfAttorney.isVerified = req.body.powerOfAttorney.isVerified;
                asset.powerOfAttorney.message = req.body.powerOfAttorney.message ? req.body.powerOfAttorney.message : " ";
                asset.invoice.isVerified = req.body.invoice.isVerified;
                asset.invoice.message = req.body.invoice.message ? req.body.invoice.message : " ";
                asset.clearanceCertificate.isVerified = req.body.clearanceCertificate.isVerified;
                asset.clearanceCertificate.message = req.body.clearanceCertificate.message ? req.body.clearanceCertificate.message : " ";
                asset.fixedAssetRegister.isVerified = req.body.fixedAssetRegister.isVerified;
                asset.fixedAssetRegister.message = req.body.fixedAssetRegister.message ? req.body.fixedAssetRegister.message : " ";
                asset.oldValuationReport.isVerified = req.body.oldValuationReport.isVerified;
                asset.oldValuationReport.message = req.body.oldValuationReport.message ? req.body.oldValuationReport.message : " ";
                asset.pendingCharges.isVerified = req.body.pendingCharges.isVerified;
                asset.pendingCharges.message = req.body.pendingCharges.message ? req.body.pendingCharges.message : " ";
                asset.valuationReport = req.body.valuationReport ? req.body.valuationReport : " ";
                asset.estimatedValuation = req.body.estimatedValuation ? req.body.estimatedValuation : 0;
                if (asset.propertyTax.isVerified &&
                    asset.insuranceDoc.isVerified &&
                    asset.powerOfAttorney.isVerified &&
                    asset.invoice.isVerified &&
                    asset.clearanceCertificate.isVerified &&
                    asset.fixedAssetRegister.isVerified &&
                    asset.oldValuationReport.isVerified &&
                    asset.pendingCharges.isVerified
                ) {
                    asset.status = "Verification Complete"
                } else {
                    asset.status = "Rejected"
                }
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
