const mongoose = require('mongoose')

const otp = mongoose.Schema({
    email: { type: String },
    otp: { type: Number }
}, {
    timestamps: { createdAt: true },
}
);

let otpVerify = mongoose.model('otpverify', otp);
module.exports = otpVerify
