const mongoose = require('mongoose')

const bankList = mongoose.Schema({
    name: { type: String }
}, {
    timestamps: { createdAt: true },
}
);

let bankListData = mongoose.model('bankList', bankList);
module.exports = bankListData