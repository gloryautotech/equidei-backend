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

        let updatedAsset;
        // updatedAsset = updatedAsset.toObject();

        if (findAsset.assetType == "plantAndMachinary") {
            if (findAsset.msmeStatus == "Rejected") {
                findAsset.msmeStatus = "Pending Verification";
                findAsset.adminStatus = "Updated By MSME";
                if (req.body.purchaseBill) {
                    findAsset.purchaseBill.status = "Updated By MSME";
                    findAsset.purchaseBill.name = req.body.purchaseBill.name
                    findAsset.purchaseBill.url = req.body.purchaseBill.url
                    findAsset.purchaseBill.ipfsHash = req.body.purchaseBill.ipfsHash
                }
                if (req.body.taxInvoice) {
                    findAsset.taxInvoice.status = "Updated By MSME"
                    findAsset.taxInvoice.name = req.body.taxInvoice.name
                    findAsset.taxInvoice.url = req.body.taxInvoice.url
                    findAsset.taxInvoice.ipfsHash = req.body.taxInvoice.ipfsHash
                }
                if (req.body.insuranceDoc) {
                    findAsset.insuranceDoc.status = "Updated By MSME"
                    findAsset.insuranceDoc.name = req.body.insuranceDoc.name
                    findAsset.insuranceDoc.url = req.body.insuranceDoc.url
                    findAsset.insuranceDoc.ipfsHash = req.body.insuranceDoc.ipfsHash
                }
                if (req.body.assetInvoice) {
                    findAsset.assetInvoice.status = "Updated By MSME";
                    findAsset.assetInvoice.name = req.body.assetInvoice.name
                    findAsset.assetInvoice.url = req.body.assetInvoice.url
                    findAsset.assetInvoice.ipfsHash = req.body.assetInvoice.ipfsHash
                }
                if (req.body.technicalSpecifications) {
                    findAsset.technicalSpecifications.status = "Updated By MSME"
                    findAsset.technicalSpecifications.name = req.body.technicalSpecifications.name
                    findAsset.technicalSpecifications.url = req.body.technicalSpecifications.url
                    findAsset.technicalSpecifications.ipfsHash = req.body.technicalSpecifications.ipfsHash
                }
                if (req.body.chargesPending) {
                    findAsset.chargesPending.status = "Updated By MSME"
                    findAsset.chargesPending.name = req.body.chargesPending.name
                    findAsset.chargesPending.url = req.body.chargesPending.url
                    findAsset.chargesPending.ipfsHash = req.body.chargesPending.ipfsHash
                }
                if (req.body.oldValuationReport) {
                    findAsset.oldValuationReport.status = "Updated By MSME";
                    findAsset.oldValuationReport.name = req.body.oldValuationReport.name
                    findAsset.oldValuationReport.url = req.body.oldValuationReport.url
                    findAsset.oldValuationReport.ipfsHash = req.body.oldValuationReport.ipfsHash
                }
                if (req.body.fixedAssetregister) {
                    findAsset.fixedAssetregister.status = "Updated By MSME"
                    findAsset.fixedAssetregister.name = req.body.fixedAssetregister.name
                    findAsset.fixedAssetregister.url = req.body.fixedAssetregister.url
                    findAsset.fixedAssetregister.ipfsHash = req.body.fixedAssetregister.ipfsHash
                }
                findAsset = await findAsset.save();
                let apiResponse = response.generate(constants.SUCCESS, messages.asset.UPDATE, constants.HTTP_SUCCESS, findAsset);
                res.status(200).send(apiResponse);
            } else {
                updatedAsset = await assetModel.findByIdAndUpdate(assetId, { $set: data }, { upsert: true, new: true },)
                let apiResponse = response.generate(constants.SUCCESS, messages.asset.UPDATE, constants.HTTP_SUCCESS, updatedAsset);
                res.status(200).send(apiResponse);
            }
        } else if (updatedAsset.msmeStatus == "realEsate") {
            if (findAsset.msmeStatus == "Rejected") {
                findAsset.msmeStatus = "Pending Verification";
                findAsset.adminStatus = "Updated By MSME"
                if (req.body.propertyTax) {
                    findAsset.propertyTax.status = "Updated By MSME"
                    findAsset.propertyTax.name = req.body.propertyTax.name
                    findAsset.propertyTax.url = req.body.propertyTax.url
                    findAsset.propertyTax.ipfsHash = req.body.propertyTax.ipfsHash
                }
                if (req.body.insuranceDocument) {
                    findAsset.insuranceDocument.status = "Updated By MSME"
                    findAsset.insuranceDocument.name = req.body.insuranceDocument.name
                    findAsset.insuranceDocument.url = req.body.insuranceDocument.url
                    findAsset.insuranceDocument.ipfsHash = req.body.insuranceDocument.ipfsHash
                }
                if (req.body.powerOfAttorney) {
                    findAsset.powerOfAttorney.status = "Updated By MSME"
                    findAsset.powerOfAttorney.name = req.body.powerOfAttorney.name
                    findAsset.powerOfAttorney.url = req.body.powerOfAttorney.url
                    findAsset.powerOfAttorney.ipfsHash = req.body.powerOfAttorney.ipfsHash
                }
                if (req.body.invoice) {
                    findAsset.invoice.status = "Updated By MSME"
                    findAsset.invoice.name = req.body.invoice.name
                    findAsset.invoice.url = req.body.invoice.url
                    findAsset.invoice.ipfsHash = req.body.invoice.ipfsHash
                }
                if (req.body.clearanceCertificate) {
                    findAsset.clearanceCertificate.status = "Updated By MSME"
                    findAsset.clearanceCertificate.name = req.body.clearanceCertificate.name
                    findAsset.clearanceCertificate.url = req.body.clearanceCertificate.url
                    findAsset.clearanceCertificate.ipfsHash = req.body.clearanceCertificate.ipfsHash
                }
                if (req.body.fixedAssetregister) {
                    findAsset.fixedAssetregister.status = "Updated By MSME"
                    findAsset.fixedAssetregister.name = req.body.fixedAssetregister.name
                    findAsset.fixedAssetregister.url = req.body.fixedAssetregister.url
                    findAsset.fixedAssetregister.ipfsHash = req.body.fixedAssetregister.ipfsHash
                }
                if (req.body.oldValuationReport) {
                    findAsset.oldValuationReport.status = "Updated By MSME"
                    findAsset.oldValuationReport.name = req.body.oldValuationReport.name
                    findAsset.oldValuationReport.url = req.body.oldValuationReport.url
                    findAsset.oldValuationReport.ipfsHash = req.body.oldValuationReport.ipfsHash
                }
                if (req.body.pendingCharges) {
                    findAsset.pendingCharges.status = "Updated By MSME"
                    findAsset.pendingCharges.name = req.body.pendingCharges.name
                    findAsset.pendingCharges.url = req.body.pendingCharges.url
                    findAsset.pendingCharges.ipfsHash = req.body.pendingCharges.ipfsHash
                }
                findAsset = await findAsset.save();
                let apiResponse = response.generate(constants.SUCCESS, messages.asset.UPDATE, constants.HTTP_SUCCESS, findAsset);
                res.status(200).send(apiResponse);
            } else {
                updatedAsset = await assetModel.findByIdAndUpdate(assetId, { $set: data }, { upsert: true, new: true },)
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
                if (req.body.fixedAssetRegister.isVerified == true) {
                    asset.fixedAssetRegister.status = "Verified";
                    asset.fixedAssetRegister.isVerified = true
                } else {
                    asset.fixedAssetRegister.isVerified = false;
                    asset.fixedAssetRegister.status = "Rejected"
                };
                asset.fixedAssetRegister.message = req.body.fixedAssetRegister.message ? req.body.fixedAssetRegister.message : " ";
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
                };
                asset.chargesPending.message = req.body.chargesPending.message ? req.body.chargesPending.message : " ";
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
                    asset.fixedAssetRegister.isVerified &&
                    asset.oldValuationReport.isVerified &&
                    asset.chargesPending.isVerified &&
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
                if (req.body.insuranceDoc.isVerified == true) {
                    asset.insuranceDoc.status = "Verified";
                    asset.insuranceDoc.isVerified = true
                } else {
                    asset.insuranceDoc.isVerified = false;
                    asset.insuranceDoc.status = "Rejected"
                };
                asset.insuranceDoc.message = req.body.insuranceDoc.message ? req.body.insuranceDoc.message : " ";
                if (req.body.powerOfAttorney.isVerified == true) {
                    asset.powerOfAttorney.status = "Verified";
                    asset.powerOfAttorney.isVerified = true
                } else {
                    asset.powerOfAttorney.isVerified = false;
                    asset.powerOfAttorney.status = "Rejected"
                };
                asset.powerOfAttorney.message = req.body.powerOfAttorney.message ? req.body.powerOfAttorney.message : " ";
                if (req.body.invoice.isVerified == true) {
                    asset.invoice.status = "Verified";
                    asset.invoice.isVerified = true
                }
                else {
                    asset.invoice.isVerified = false;
                    asset.invoice.status = "Rejected"
                };
                asset.invoice.message = req.body.invoice.message ? req.body.invoice.message : " ";
                if (req.body.clearanceCertificate.isVerified == true) {
                    asset.clearanceCertificate.status = "Verified";
                    asset.clearanceCertificate.isVerified = true
                } else {
                    asset.clearanceCertificate.isVerified = false;
                    asset.clearanceCertificate.status = "Rejected"
                };
                asset.clearanceCertificate.message = req.body.clearanceCertificate.message ? req.body.clearanceCertificate.message : " ";
                if (req.body.fixedAssetRegister.isVerified == true) {
                    asset.fixedAssetRegister.status = "Verified";
                    asset.fixedAssetRegister.isVerified = true
                } else {
                    asset.fixedAssetRegister.isVerified = false;
                    asset.fixedAssetRegister.status = "Rejected"
                };
                asset.fixedAssetRegister.message = req.body.fixedAssetRegister.message ? req.body.fixedAssetRegister.message : " ";
                if (req.body.oldValuationReport.isVerified == true) {
                    asset.oldValuationReport.status = "Verified";
                    asset.oldValuationReport.isVerified = true
                } else {
                    asset.oldValuationReport.isVerified = false;
                    asset.oldValuationReport.status = "Rejected"
                };
                asset.oldValuationReport.message = req.body.oldValuationReport.message ? req.body.oldValuationReport.message : " ";
                if (req.body.pendingCharges.isVerified == true) {
                    asset.pendingCharges.status = "Verified";
                    asset.pendingCharges.isVerified = true
                } else {
                    asset.pendingCharges.isVerified = false;
                    asset.pendingCharges.status = "Rejected"
                }
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
