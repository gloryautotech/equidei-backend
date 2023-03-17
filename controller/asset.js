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
        let updatedAsset = await assetModel.findByIdAndUpdate(assetId, { $set: data }, { upsert: true, new: true },)
        // updatedAsset = updatedAsset.toObject();

        if (updatedAsset.assetType == "plantAndMachinery") {
            if (findAsset.msmeStatus == "Rejected") {
                updatedAsset.msmeStatus = "Pending Verification";
                updatedAsset.adminStatus="Upadted By MSME";
                if (req.body.purchaseBill) {
                    updatedAsset.purchaseBill.status = "Updated By MSME"
                }
                if (req.body.taxInvoice) {
                    updatedAsset.taxInvoice.status = "Updated By MSME"
                }
                if (req.body.insuranceDoc) {
                    updatedAsset.insuranceDoc.status = "Updated By MSME"
                }
                if (req.body.assetInvoice) {
                    updatedAsset.assetInvoice.status = "Updated By MSME";
                }
                if (req.body.technicalSpecifications) {
                    updatedAsset.technicalSpecifications.status = "Updated By MSME"
                }
                if (req.body.chargesPending) {
                    updatedAsset.chargesPending.status = "Updated By MSME"
                }
                if (req.body.oldValuationReport) {
                    updatedAsset.oldValuationReport.status = "Updated By MSME";
                }
                if (req.body.fixedAssetregister) {
                    updatedAsset.fixedAssetregister.status = "Updated By MSME"
                }

            } else if (findAsset.msmeStatus == "Pending Registration") {
                if (updatedAsset.purchaseBill && updatedAsset.taxInvoice && updatedAsset.insuranceDoc && updatedAsset.assetInvoice && updatedAsset.technicalSpecifications && updatedAsset.assetName && updatedAsset.tenure && updatedAsset.yearOfManufacture && updatedAsset.serialNumber && updatedAsset.assetMake && updatedAsset.assetModel && updatedAsset.assetValue && updatedAsset.technicalSpecifications) {
                    const newUpdatedAsset = await assetModel.findByIdAndUpdate(assetId, { msmeStatus: "Registered" }, { upsert: true, new: true },)
                    let apiResponse = response.generate(constants.SUCCESS, messages.asset.UPDATE, constants.HTTP_SUCCESS, newUpdatedAsset);
                    return res.status(200).send(apiResponse);
                }
            }
        } else if (updatedAsset.msmeStatus == "realEsate") {
            if (findAsset.msmeStatus == "Rejected") {
                updatedAsset.msmeStatus = "Pending Verification";
                updatedAsset.adminStatus="Upadted By MSME"
                if (req.body.propertyTax) {
                    updatedAsset.propertyTax.status = "Upadted By MSME"
                }
                if (req.body.insuranceDocument) {
                    updatedAsset.insuranceDocument.status = "Upadted By MSME"
                }
                if (req.body.powerOfAttorney) {
                    updatedAsset.powerOfAttorney.status = "Upadted By MSME"
                }
                if (req.body.invoice) {
                    updatedAsset.invoice.status = "Upadted By MSME"
                }
                if (req.body.clearanceCertificate) {
                    updatedAsset.clearanceCertificate.status = "Upadted By MSME"
                }
                if (req.body.fixedAssetregister) {
                    updatedAsset.fixedAssetregister.status = "Upadted By MSME"
                }
                if (req.body.oldValuationReport) {
                    updatedAsset.oldValuationReport.status = "Upadted By MSME"
                }
                if (req.body.pendingCharges) {
                    updatedAsset.pendingCharges.status = "Upadted By MSME"
                }

            } else if (findAsset.msmeStatus == "Pending Registration") {
                if (updatedAsset.propertyTax && updatedAsset.oldValuationReport && updatedAsset.assetName && updatedAsset.tenure && updatedAsset.landOwner && updatedAsset.titleDeed && updatedAsset.landRegistry && updatedAsset.assetValue && updatedAsset.otpVerification) {
                    let newUpdatedAsset = await assetModel.findByIdAndUpdate(assetId, { msmeStatus: "Registered" }, { upsert: true, new: true },)
                    let apiResponse = response.generate(constants.SUCCESS, messages.asset.UPDATE, constants.HTTP_SUCCESS, newUpdatedAsset);
                    return res.status(200).send(apiResponse);
                }
            }
        }

        updatedAsset = await updatedAsset.save();
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
            if (asset.assetType == "plantAndMachinery") {
                if (req.body.purchaseBill.isVerified == true) {
                    asset.purchaseBill.isVerified = true;
                    asset.purchaseBill.status = "Verified";
                } else {
                    asset.purchaseBill.isVerified = false;
                    asset.purchaseBill.status = "Rejected";
                }
                req.body.purchaseBill.message ? req.body.purchaseBill.message : " ";
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
