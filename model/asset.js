const mongoose = require('mongoose')

const assetSchema = mongoose.Schema({
    assetName: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean }
    },
    taxInvoice: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean }
    },
    insuranceDoc: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean }
    },
    fixedAssetRegister: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean }
    },
    chargesPending: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean }
    },
    assetInvoice: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean }
    },
    technicalSpecifications: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean }
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
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean }
    },
    insuranceDocument: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean }
    },
    powerOfAttorney: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean }
    },
    invoice: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean }
    },
    clearanceCertificate: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean }
    },
    fixedAssetregister: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean }
    },
    oldValuationReport: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean }
    },
    pendingCharges: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean }
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
    timestamps: { createdAt: true }, Strict: false
}
);

let asset = mongoose.model('asset', assetSchema);
module.exports = asset
