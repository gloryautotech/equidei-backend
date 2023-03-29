const assetModel = require("../model/asset")
const userModel = require("../model/user")
const APIFeatures = require('../utils/apiFeatures');
const { constants, messages } = require("../constants.js");
const response = require('../lib/responseLib');



const assetRegister = async (req, res) => {
    try {
        let data = req.body;
        let { email } = req.body
        let findAsset = await userModel.findOne({ email: email })
        data["userId"] = findAsset._id
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

        let findAsset = await assetModel.findOne({ _id: assetId });
        // updatedAsset = updatedAsset.toObject();

        if (findAsset.assetType == "plantAndMachinary") {
            if (findAsset.msmeStatus == "Rejected") {
                findAsset.msmeStatus = "Pending Verification";
                findAsset.adminStatus = "Updated By MSME";
                if (data.purchaseBill.ipfsHash != "") {
                    findAsset.purchaseBill.status = "Updated By MSME";
                    findAsset.purchaseBill.message = findAsset.purchaseBill.message
                    findAsset.purchaseBill.isVerified = findAsset.purchaseBill.isVerified
                    findAsset.purchaseBill.name = req.body.purchaseBill.name
                    findAsset.purchaseBill.url = req.body.purchaseBill.url
                    findAsset.purchaseBill.ipfsHash = req.body.purchaseBill.ipfsHash
                }
                if (data.taxInvoice.ipfsHash != "") {
                    findAsset.taxInvoice.status = "Updated By MSME";
                    findAsset.taxInvoice.message = findAsset.taxInvoice.message
                    findAsset.taxInvoice.isVerified = findAsset.taxInvoice.isVerified
                    findAsset.taxInvoice.name = req.body.taxInvoice.name
                    findAsset.taxInvoice.url = req.body.taxInvoice.url
                    findAsset.taxInvoice.ipfsHash = req.body.taxInvoice.ipfsHash
                }
                if (data.insuranceDoc.ipfsHash != "") {
                    findAsset.insuranceDoc.status = "Updated By MSME";
                    findAsset.insuranceDoc.message = findAsset.insuranceDoc.message
                    findAsset.insuranceDoc.isVerified = findAsset.insuranceDoc.isVerified
                    findAsset.insuranceDoc.name = req.body.insuranceDoc.name
                    findAsset.insuranceDoc.url = req.body.insuranceDoc.url
                    findAsset.insuranceDoc.ipfsHash = req.body.insuranceDoc.ipfsHash
                }
                if (data.assetInvoice.ipfsHash != "") {
                    findAsset.assetInvoice.status = "Updated By MSME";
                    findAsset.assetInvoice.message = findAsset.assetInvoice.message
                    findAsset.assetInvoice.isVerified = findAsset.assetInvoice.isVerified
                    findAsset.assetInvoice.name = req.body.assetInvoice.name
                    findAsset.assetInvoice.url = req.body.assetInvoice.url
                    findAsset.assetInvoice.ipfsHash = req.body.assetInvoice.ipfsHash
                }
                if (data.technicalSpecifications.ipfsHash != "") {
                    findAsset.technicalSpecifications.status = "Updated By MSME";
                    findAsset.technicalSpecifications.message = findAsset.technicalSpecifications.message
                    findAsset.technicalSpecifications.isVerified = findAsset.technicalSpecifications.isVerified
                    findAsset.technicalSpecifications.name = req.body.technicalSpecifications.name
                    findAsset.technicalSpecifications.url = req.body.technicalSpecifications.url
                    findAsset.technicalSpecifications.ipfsHash = req.body.technicalSpecifications.ipfsHash
                }
                if (data.chargesPending.ipfsHash != "") {
                    findAsset.chargesPending.status = "Updated By MSME";
                    findAsset.chargesPending.message = findAsset.chargesPending.message
                    findAsset.chargesPending.isVerified = findAsset.chargesPending.isVerified
                    findAsset.chargesPending.name = req.body.chargesPending.name
                    findAsset.chargesPending.url = req.body.chargesPending.url
                    findAsset.chargesPending.ipfsHash = req.body.chargesPending.ipfsHash
                }
                if (data.oldValuationReport.ipfsHash != "") {
                    findAsset.oldValuationReport.status = "Updated By MSME";
                    findAsset.oldValuationReport.message = findAsset.oldValuationReport.message
                    findAsset.oldValuationReport.isVerified = findAsset.oldValuationReport.isVerified
                    findAsset.oldValuationReport.name = req.body.oldValuationReport.name
                    findAsset.oldValuationReport.url = req.body.oldValuationReport.url
                    findAsset.oldValuationReport.ipfsHash = req.body.oldValuationReport.ipfsHash
                }
                if (data.fixedAssetRegister.ipfsHash != "") {
                    findAsset.fixedAssetRegister.status = "Updated By MSME";
                    findAsset.fixedAssetRegister.message = findAsset.fixedAssetRegister.message
                    findAsset.fixedAssetRegister.isVerified = findAsset.fixedAssetRegister.isVerified
                    findAsset.fixedAssetRegister.name = req.body.fixedAssetRegister.name
                    findAsset.fixedAssetRegister.url = req.body.fixedAssetRegister.url
                    findAsset.fixedAssetRegister.ipfsHash = req.body.fixedAssetRegister.ipfsHash
                }
                let updatedAsset = await assetModel.findByIdAndUpdate(assetId, { $set: findAsset }, { upsert: true, new: true },)
                let apiResponse = response.generate(constants.SUCCESS, messages.asset.UPDATE, constants.HTTP_SUCCESS, updatedAsset);
                res.status(200).send(apiResponse);
            } else {
                let updatedAsset = await assetModel.findByIdAndUpdate(assetId, { $set: data }, { upsert: true, new: true },)
                let apiResponse = response.generate(constants.SUCCESS, messages.asset.UPDATE, constants.HTTP_SUCCESS, updatedAsset);
                res.status(200).send(apiResponse);
            }

        } else if (findAsset.assetType == "realEstate") {
            if (findAsset.msmeStatus == "Rejected") {
                findAsset.msmeStatus = "Pending Verification";
                findAsset.adminStatus = "Updated By MSME"
                if (data.propertyTax.ipfsHash != "") {
                    findAsset.propertyTax.status = "Updated By MSME";
                    findAsset.propertyTax.message = findAsset.propertyTax.message
                    findAsset.propertyTax.isVerified = findAsset.propertyTax.isVerified
                    findAsset.propertyTax.name = req.body.propertyTax.name
                    findAsset.propertyTax.url = req.body.propertyTax.url
                    findAsset.propertyTax.ipfsHash = req.body.propertyTax.ipfsHash

                }
                if (data.insuranceDoc.ipfsHash != "") {
                    findAsset.insuranceDoc.status = "Updated By MSME";
                    findAsset.insuranceDoc.message = findAsset.insuranceDoc.message
                    findAsset.insuranceDoc.isVerified = findAsset.insuranceDoc.isVerified
                    findAsset.insuranceDoc.name = req.body.insuranceDoc.name
                    findAsset.insuranceDoc.url = req.body.insuranceDoc.url
                    findAsset.insuranceDoc.ipfsHash = req.body.insuranceDoc.ipfsHash
                }
                if (data.powerOfAttorney.ipfsHash != "") {
                    findAsset.powerOfAttorney.status = "Updated By MSME";
                    findAsset.powerOfAttorney.message = findAsset.powerOfAttorney.message
                    findAsset.powerOfAttorney.isVerified = findAsset.powerOfAttorney.isVerified
                    findAsset.powerOfAttorney.name = req.body.powerOfAttorney.name
                    findAsset.powerOfAttorney.url = req.body.powerOfAttorney.url
                    findAsset.powerOfAttorney.ipfsHash = req.body.powerOfAttorney.ipfsHash
                }
                if (data.invoice.ipfsHash != "") {
                    findAsset.invoice.status = "Updated By MSME";
                    findAsset.invoice.message = findAsset.invoice.message
                    findAsset.invoice.isVerified = findAsset.invoice.isVerified
                    findAsset.invoice.name = req.body.invoice.name
                    findAsset.invoice.url = req.body.invoice.url
                    findAsset.invoice.ipfsHash = req.body.invoice.ipfsHash
                }
                if (data.clearanceCertificate.ipfsHash != "") {
                    findAsset.clearanceCertificate.status = "Updated By MSME";
                    findAsset.clearanceCertificate.message = findAsset.clearanceCertificate.message
                    findAsset.clearanceCertificate.isVerified = findAsset.clearanceCertificate.isVerified
                    findAsset.clearanceCertificate.name = req.body.clearanceCertificate.name
                    findAsset.clearanceCertificate.url = req.body.clearanceCertificate.url
                    findAsset.clearanceCertificate.ipfsHash = req.body.clearanceCertificate.ipfsHash
                }
                if (data.fixedAssetRegister.ipfsHash != "") {
                    findAsset.fixedAssetRegister.status = "Updated By MSME";
                    findAsset.fixedAssetRegister.message = findAsset.fixedAssetRegister.message
                    findAsset.fixedAssetRegister.isVerified = findAsset.fixedAssetRegister.isVerified
                    findAsset.fixedAssetRegister.name = req.body.fixedAssetRegister.name
                    findAsset.fixedAssetRegister.url = req.body.fixedAssetRegister.url
                    findAsset.fixedAssetRegister.ipfsHash = req.body.fixedAssetRegister.ipfsHash
                }
                if (data.oldValuationReport.ipfsHash != "") {
                    findAsset.oldValuationReport.status = "Updated By MSME";
                    findAsset.oldValuationReport.message = findAsset.oldValuationReport.message
                    findAsset.oldValuationReport.isVerified = findAsset.oldValuationReport.isVerified
                    findAsset.oldValuationReport.name = req.body.oldValuationReport.name
                    findAsset.oldValuationReport.url = req.body.oldValuationReport.url
                    findAsset.oldValuationReport.ipfsHash = req.body.oldValuationReport.ipfsHash
                }
                if (data.chargesPending.ipfsHash != "") {
                    findAsset.chargesPending.status = "Updated By MSME";
                    findAsset.chargesPending.message = findAsset.chargesPending.message
                    findAsset.chargesPending.isVerified = findAsset.chargesPending.isVerified
                    findAsset.chargesPending.name = req.body.chargesPending.name
                    findAsset.chargesPending.url = req.body.chargesPending.url
                    findAsset.chargesPending.ipfsHash = req.body.chargesPending.ipfsHash
                }
                let updatedAsset = await assetModel.findByIdAndUpdate(assetId, { $set: findAsset }, { upsert: true, new: true },)
                let apiResponse = response.generate(constants.SUCCESS, messages.asset.UPDATE, constants.HTTP_SUCCESS, updatedAsset);
                res.status(200).send(apiResponse);
            } else {
                let updatedAsset = await assetModel.findByIdAndUpdate(assetId, { $set: data }, { upsert: true, new: true },)
                let apiResponse = response.generate(constants.SUCCESS, messages.asset.UPDATE, constants.HTTP_SUCCESS, updatedAsset);
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
const getAllAssetList = async (req, res) => {
    try {
        const { email } = req.params;
        let user = await userModel.findOne({ email: email })
        let assetData = await assetModel.find({ userId: user._id }).populate("userId", 'companyDetails.name')
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
                if (req.body.purchaseBill.isVerified == true) {
                    asset.purchaseBill.isVerified = true;
                    asset.purchaseBill.status = "Verified";
                } else {
                    asset.purchaseBill.isVerified = false;
                    asset.purchaseBill.status = "Rejected";
                }
                asset.purchaseBill.message = req.body.purchaseBill.message ? req.body.purchaseBill.message : " ";
                if (req.body.taxInvoice.isVerified == true) {
                    asset.taxInvoice.status = "Verified";
                    asset.taxInvoice.isVerified = true
                } else {
                    asset.taxInvoice.isVerified = false;
                    asset.taxInvoice.status = "Rejected"
                };
                asset.taxInvoice.message = req.body.taxInvoice.message ? req.body.taxInvoice.message : " ";
                if (req.body.insuranceDoc.isVerified == true) {
                    asset.insuranceDoc.status = "Verified";
                    asset.insuranceDoc.isVerified = true
                } else {
                    asset.insuranceDoc.isVerified = false
                    asset.insuranceDoc.status = "Rejected"
                };
                asset.insuranceDoc.message = req.body.insuranceDoc.message ? req.body.insuranceDoc.message : " ";
                if (req.body.fixedAssetRegister) {
                    if (req.body.fixedAssetRegister.isVerified == true) {
                        asset.fixedAssetRegister.status = "Verified";
                        asset.fixedAssetRegister.isVerified = true
                    } else {
                        asset.fixedAssetRegister.isVerified = false;
                        asset.fixedAssetRegister.status = "Rejected"
                    };
                    asset.fixedAssetRegister.message = req.body.fixedAssetRegister.message ? req.body.fixedAssetRegister.message : " ";
                }
                if (req.body.oldValuationReport) {
                    if (req.body.oldValuationReport.isVerified == true) {
                        asset.oldValuationReport.status = "Verified";
                        asset.oldValuationReport.isVerified = true
                    } else {
                        asset.oldValuationReport.isVerified = false;
                        asset.oldValuationReport.status = "Rejected"
                    };

                    asset.oldValuationReport.message = req.body.oldValuationReport.message ? req.body.oldValuationReport.message : " ";
                }
                if (req.body.chargesPending) {
                    if (req.body.chargesPending.isVerified == true) {
                        asset.chargesPending.status = "Verified";
                        asset.chargesPending.isVerified = true
                    } else {
                        asset.chargesPending.isVerified = false;
                        asset.chargesPending.status = "Rejected"
                    };
                    asset.chargesPending.message = req.body.chargesPending.message ? req.body.chargesPending.message : " ";
                }
                if (req.body.assetInvoice.isVerified == true) {
                    asset.assetInvoice.status = "Verified";
                    asset.assetInvoice.isVerified = true
                } else {
                    asset.assetInvoice.isVerified = false;
                    asset.assetInvoice.status = "Rejected"
                };
                asset.assetInvoice.message = req.body.assetInvoice.message ? req.body.assetInvoice.message : " ";
                if (req.body.technicalSpecifications.isVerified == true) {
                    asset.technicalSpecifications.status = "Verified";
                    asset.technicalSpecifications.isVerified = true;
                } else {
                    asset.technicalSpecifications.isVerified = false;
                    asset.technicalSpecifications.status = "Rejected"
                };
                asset.technicalSpecifications.message = req.body.technicalSpecifications.message ? req.body.technicalSpecifications.message : " ";
                asset.valuationReport = req.body.valuationReport ? req.body.valuationReport : " ";
                asset.estimatedValuation = req.body.estimatedValuation ? req.body.estimatedValuation : 0;
                if (asset.purchaseBill.isVerified &&
                    asset.taxInvoice.isVerified &&
                    asset.insuranceDoc.isVerified &&
                    asset.assetInvoice.isVerified &&
                    asset.technicalSpecifications.isVerified
                ) {
                    asset.adminStatus = "Verification Complete"
                    asset.msmeStatus = "Verification Complete"
                } else {
                    asset.adminStatus = "Rejected"
                    asset.msmeStatus = "Rejected"
                }
                asset = await asset.save();
                let apiResponse = response.generate(constants.SUCCESS, messages.asset.VERIFY, constants.HTTP_SUCCESS, asset);
                res.status(200).send(apiResponse);
            } else {
                if (req.body.propertyTax.isVerified == true) {
                    asset.propertyTax.status = "Verified";
                    asset.propertyTax.isVerified = true
                } else {
                    asset.propertyTax.isVerified = false;
                    asset.propertyTax.status = "Rejected"
                };
                asset.propertyTax.message = req.body.propertyTax.message ? req.body.propertyTax.message : " ";
                if (req.body.insuranceDoc) {
                    if (req.body.insuranceDoc.isVerified == true) {
                        asset.insuranceDoc.status = "Verified";
                        asset.insuranceDoc.isVerified = true
                    } else {
                        asset.insuranceDoc.isVerified = false;
                        asset.insuranceDoc.status = "Rejected"
                    };
                    asset.insuranceDoc.message = req.body.insuranceDoc.message ? req.body.insuranceDoc.message : " ";
                }
                if (req.body.powerOfAttorney) {
                    if (req.body.powerOfAttorney.isVerified == true) {
                        asset.powerOfAttorney.status = "Verified";
                        asset.powerOfAttorney.isVerified = true
                    } else {
                        asset.powerOfAttorney.isVerified = false;
                        asset.powerOfAttorney.status = "Rejected"
                    };
                    asset.powerOfAttorney.message = req.body.powerOfAttorney.message ? req.body.powerOfAttorney.message : " ";
                }
                if (req.body.invoice.isVerified == true) {
                    asset.invoice.status = "Verified";
                    asset.invoice.isVerified = true
                }
                else {
                    asset.invoice.isVerified = false;
                    asset.invoice.status = "Rejected"
                };
                asset.invoice.message = req.body.invoice.message ? req.body.invoice.message : " ";
                if (req.body.clearanceCertificate) {
                    if (req.body.clearanceCertificate.isVerified == true) {
                        asset.clearanceCertificate.status = "Verified";
                        asset.clearanceCertificate.isVerified = true
                    } else {
                        asset.clearanceCertificate.isVerified = false;
                        asset.clearanceCertificate.status = "Rejected"
                    };
                    asset.clearanceCertificate.message = req.body.clearanceCertificate.message ? req.body.clearanceCertificate.message : " ";
                }
                if (req.body.fixedAssetRegister) {
                    if (req.body.fixedAssetRegister.isVerified == true) {
                        asset.fixedAssetRegister.status = "Verified";
                        asset.fixedAssetRegister.isVerified = true
                    } else {
                        asset.fixedAssetRegister.isVerified = false;
                        asset.fixedAssetRegister.status = "Rejected"
                    };
                    asset.fixedAssetRegister.message = req.body.fixedAssetRegister.message ? req.body.fixedAssetRegister.message : " ";
                }
                if (req.body.oldValuationReport.isVerified == true) {
                    asset.oldValuationReport.status = "Verified";
                    asset.oldValuationReport.isVerified = true
                } else {
                    asset.oldValuationReport.isVerified = false;
                    asset.oldValuationReport.status = "Rejected"
                };
                asset.oldValuationReport.message = req.body.oldValuationReport.message ? req.body.oldValuationReport.message : " ";
                if (req.body.chargesPending.isVerified == true) {
                    asset.chargesPending.status = "Verified";
                    asset.chargesPending.isVerified = true
                } else {
                    asset.chargesPending.isVerified = false;
                    asset.chargesPending.status = "Rejected"
                }
                asset.chargesPending.message = req.body.chargesPending.message ? req.body.chargesPending.message : " ";
                asset.valuationReport = req.body.valuationReport ? req.body.valuationReport : " ";
                asset.estimatedValuation = req.body.estimatedValuation ? req.body.estimatedValuation : 0;
                if (asset.propertyTax.isVerified &&
                    asset.invoice.isVerified &&
                    asset.oldValuationReport.isVerified &&
                    asset.chargesPending.isVerified
                ) {
                    asset.adminStatus = "Verification Complete"
                    asset.msmeStatus = "Verification Complete"
                } else {
                    asset.adminStatus = "Rejected"
                    asset.msmeStatus = "Rejected"
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
