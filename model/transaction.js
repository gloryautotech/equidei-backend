const mongoose = require('mongoose')

const transaction = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    amount: { type: Number },
    currency: { type: String },
    mtx: { type: String },
    message:{type:String,default:"payment successfully created"},
    status: { type: String }
}, {
    timestamps: { createdAt: true },
}
);

let transactionHistroy = mongoose.model('transaction', transaction);
module.exports = transactionHistroy