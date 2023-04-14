const mongoose = require('mongoose')

const otp = mongoose.Schema({
    userId: { type: String },
    otp: { type: String }
}, {
    timestamps: { createdAt: true },
}
);

let otpVerify = mongoose.model('otpverify', otp);
module.exports = otpVerify
