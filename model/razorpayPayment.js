const mongoose = require('mongoose')

const razorpayPayment = mongoose.Schema({
    order_id: { type: String },
    amount: { type: Number },
    amount_due: { type: Number },
    currency: { type: String },
    receipt: { type: String },
    offer_id: { type: String },
    status: { type: String },
    assetId: { type: mongoose.Types.ObjectId, ref:'Asset' },
    userId: { type: mongoose.Types.ObjectId, ref:'User' },
    attempts: { type: Number },
    notes: { type: Array },
    razorpay_payment_id:{type:String}
}, {
    timestamps: true ,strict: false
}
);

let bankListData = mongoose.model('razorpayPayment', razorpayPayment);
module.exports = bankListData