const mongoose = require('mongoose')

const assetSchema = mongoose.Schema({
    assetName: {
        type: String
    },
    tenure: {
        type: String
    },
    yearOfManufacture: {
        type: Number
    },
    serialNumber: {
        type: Number
    },
    assetMake: {
        type: String
    },
    assetModel: {
        type: String
    },
    technicalSpecificationsName: {
        type: String
    },
    purchaseBill: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        status: { type: String, enum: ["Verified","Rejected"] }
    },
    taxInvoice: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        status: { type: String, enum: ["Verified","Rejected"] }
    },
    insuranceDoc: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        status: { type: String, enum: ["Verified","Rejected"] }
    },
    fixedAssetRegister: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        status: { type: String, enum: ["Verified","Rejected"] }
    },
    chargesPending: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        status: { type: String, enum: ["Verified","Rejected"] }
    },
    assetInvoice: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        status: { type: String, enum: ["Verified","Rejected"] }
    },
    technicalSpecifications: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        status: { type: String, enum: ["Verified","Rejected"] }
    },
    landOwner: {
        type: String
    },
    titleDeed: {
        type: String
    },
    landRegistry: {
        type: String
    },
    assetValue: {
        type: String
    },
    propertyTax: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        status: { type: String, enum: ["Verified","Rejected"] }
    },
    insuranceDocument: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        status: { type: String, enum: ["Verified","Rejected"] }
    },
    powerOfAttorney: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        status: { type: String, enum: ["Verified","Rejected"] }
    },
    invoice: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        status: { type: String, enum: ["Verified","Rejected"] }
    },
    clearanceCertificate: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        status: { type: String, enum: ["Verified","Rejected"] }
    },
    fixedAssetregister: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        status: { type: String, enum: ["Verified","Rejected"] }
    },
    oldValuationReport: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        status: { type: String, enum: ["Verified","Rejected"] }
    },
    pendingCharges: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        status: { type: String, enum: ["Verified","Rejected"] }
    },
    isPayment: {
        type: Boolean,
        default:false
    },
    status: {
        type: String,
        default: "Pending Registration"
    },
    assetType: {
        type: String,
    },
    otpVerification: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: { createdAt: true },
}
);

let asset = mongoose.model('asset', assetSchema);
module.exports = asset
