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
        type: String
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
        isVerified: { type: Boolean },
        status: { type: String, enum: ["Rejected", "Updated By MSME", "Verified", "Pending"] }
    },
    taxInvoice: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean },
        status: { type: String, enum: ["Rejected", "Updated By MSME", "Verified", "Pending"] }
    },
    insuranceDoc: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean },
        status: { type: String, enum: ["Rejected", "Updated By MSME", "Verified", "Pending"] }
    },
    fixedAssetRegister: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean },
        status: { type: String, enum: ["Rejected", "Updated By MSME", "Verified", "Pending"] }
    },
    chargesPending: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean },
        status: { type: String, enum: ["Rejected", "Updated By MSME", "Verified", "Pending"] }
    },
    assetInvoice: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean },
        status: { type: String, enum: ["Rejected", "Updated By MSME", "Verified", "Pending"] }
    },
    technicalSpecifications: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean },
        status: { type: String, enum: ["Rejected", "Updated By MSME", "Verified", "Pending"] }
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
        type: Number
    },
    propertyTax: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean },
        status: { type: String, enum: ["Rejected", "Updated By MSME", "Verified", "Pending"] }
    },
    insuranceDocument: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean },
        status: { type: String, enum: ["Rejected", "Updated By MSME", "Verified", "Pending"] }
    },
    powerOfAttorney: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean },
        status: { type: String, enum: ["Rejected", "Updated By MSME", "Verified", "Pending"] }
    },
    invoice: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean },
        status: { type: String, enum: ["Rejected", "Updated By MSME", "Verified", "Pending"] }
    },
    clearanceCertificate: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean },
        status: { type: String, enum: ["Rejected", "Updated By MSME", "Verified", "Pending"] }
    },
    fixedAssetregister: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean },
        status: { type: String, enum: ["Rejected", "Updated By MSME", "Verified", "Pending"] }
    },
    oldValuationReport: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean },
        status: { type: String, enum: ["Rejected", "Updated By MSME", "Verified", "Pending"] }
    },
    pendingCharges: {
        name: { type: String },
        url: { type: String },
        ipfsHash: { type: String },
        message: { type: String },
        isVerified: { type: Boolean },
        status: { type: String, enum: ["Rejected", "Updated By MSME", "Verified", "Pending"] }
    },
    isPayment: {
        type: Boolean,
        default: false
    },
    estimatedValuation: {
        type: Number, default: 0,
    },
    msmeStatus: {
        type: String,
        default: "Pending Registration"
    },
    adminStatus: {
        type: String,
        default: "Pending Verification"
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
    },
    transactionId: {
        type: String
    }
}, {
    timestamps: { createdAt: true }, Strict: false
}
);

let asset = mongoose.model('asset', assetSchema);
module.exports = asset
