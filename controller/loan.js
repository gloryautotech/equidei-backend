const loanModel = require("../model/loan")
const assetModel = require("../model/asset")
const userModel = require("../model/user")
const APIFeatures = require('../utils/apiFeatures');
const { constants, messages } = require("../constants.js");
const response = require('../lib/responseLib');

const loanRequest = async function (req, res) {
    try {
        let data = req.body
        let userId = req.params.userId
        let findUser = await userModel.findById(userId).lean()
        if (!findUser) {
            res.status(404).send({ message: "userId not Exist" });
        }
        data.userId = userId
        let createLoan = await loanModel.create(req.body)
        let apiResponse = response.generate(constants.SUCCESS, messages.loan.SUCCESS, constants.HTTP_CREATED, createLoan);
        res.status(201).send(apiResponse);

    } catch (err) {
        let apiResponse = response.generate(constants.ERROR, messages.loan.SERVERERROR, constants.HTTP_SERVER_ERROR, err);
        res.status(500).send(apiResponse);
    }
}

const getAllLoan = async function (req, res) {
    try {
        let allLoan = await loanModel.find().lean()
        let apiResponse = response.generate(constants.SUCCESS, messages.loan.ALL_LOAN, constants.HTTP_CREATED, allLoan);
        res.status(200).send(apiResponse);
    } catch (err) {
        let apiResponse = response.generate(constants.ERROR, messages.loan.SERVERERROR, constants.HTTP_SERVER_ERROR, err);
        res.status(500).send(apiResponse);
    }
}
const getLoanById = async function (req, res) {
    try {
        let loan = await loanModel.findById(req.params.loanId)
        let apiResponse = response.generate(constants.SUCCESS, messages.loan.LOAN, constants.HTTP_CREATED, loan);
        res.status(200).send(apiResponse);
    } catch (err) {
        let apiResponse = response.generate(constants.ERROR, messages.loan.SERVERERROR, constants.HTTP_SERVER_ERROR, err);
        res.status(500).send(apiResponse);
    }
}
const approveLoan = async function (req, res) {
    try {
        let loanId = req.params.loanId
        let findLoan = await loanModel.findById(loanId).lean()
        if (!findLoan) {
            res.status(404).send({ message: "loan not Exist" });
        }
        let data = req.body
        data.status = "approved"
        let updateLoan = await loanModel.findOneAndUpdate(loanId, data, { new: true, upsert: true })
        let apiResponse = response.generate(constants.SUCCESS, messages.loan.APPROVE, constants.HTTP_CREATED, updateLoan);
        res.status(200).send(apiResponse);
    } catch (err) {
        let apiResponse = response.generate(constants.ERROR, messages.loan.SERVERERROR, constants.HTTP_SERVER_ERROR, err);
        res.status(500).send(apiResponse);
    }
}

const removeLoan = async function (req, res) {
    try {
        await loanModel.findOneAndDelete({ id: req.params.loanId })
        let apiResponse = response.generate(constants.SUCCESS, messages.loan.DELETE, constants.HTTP_SUCCESS, null);
        res.status(200).send(apiResponse);
    } catch (err) {
        let apiResponse = response.generate(constants.ERROR, messages.loan.SERVERERROR, constants.HTTP_SERVER_ERROR, err);
        res.status(500).send(apiResponse);
    }
}

module.exports = { loanRequest, approveLoan, removeLoan, getAllLoan, getLoanById }