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
        isVerified: { type: Boolean, default: false }
    },
    taxInvoice: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        isVerified: { type: Boolean, default: false }
    },
    insuranceDoc: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        isVerified: { type: Boolean, default: false }
    },
    fixedAssetRegister: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        isVerified: { type: Boolean, default: false }
    },
    chargesPending: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        isVerified: { type: Boolean, default: false }
    },
    assetInvoice: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        isVerified: { type: Boolean, default: false }
    },
    technicalSpecifications: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        isVerified: { type: Boolean, default: false }
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
        isVerified: { type: Boolean, default: false }
    },
    insuranceDocument: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        isVerified: { type: Boolean, default: false }
    },
    powerOfAttorney: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        isVerified: { type: Boolean, default: false }
    },
    invoice: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        isVerified: { type: Boolean, default: false }
    },
    clearanceCertificate: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        isVerified: { type: Boolean, default: false }
    },
    fixedAssetregister: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        isVerified: { type: Boolean, default: false }
    },
    oldValuationReport: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        isVerified: { type: Boolean, default: false }
    },
    pendingCharges: {
        name: { type: String },
        url: { type: String },
        message: { type: String, default: "" },
        isVerified: { type: Boolean, default: false }
    },
    isPayment: {
        type: Boolean,
        default: false
    },
    estimatedValuation: {
        type: Number, default: 0,
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
    valuationReport: {
        type: String
    }
}, {
    timestamps: { createdAt: true },
}
);

let asset = mongoose.model('asset', assetSchema);
module.exports = asset
