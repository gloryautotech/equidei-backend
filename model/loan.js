const mongoose = require("mongoose")

const loanSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    requestAmount: {
        type: Number
    },
    status: {
        type: String,
        default: "Pending Approve"
    },
    interestRate: {
        type: Number
    },
    loanAmount: {
        type: Number
    },
    tenure: {
        type: String
    },
    installments: {
        type: String
    }
}, {
    timestamps: { createdAt: true }, Strict: false
})

let loan = mongoose.model('loan', loanSchema);
module.exports = loan