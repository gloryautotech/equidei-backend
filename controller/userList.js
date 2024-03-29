const mongoose = require("mongoose");
const response = require('../lib/responseLib');
const { constants, messages } = require("../constants.js");
const APIFeatures = require('../utils/apiFeatures');
const userListModel = require('../model/userList');
const userModel = require('../model/user');
const moment = require('moment');
const notificationModel = require("../model/notification-logger");

/*
Controller function to get all data from userlist model.
@param {object} req - The HTTP request object
@param {object} res - The HTTP response object
@returns {Promise<void>}
*/
exports.getAll = async (req, res, next) => {
    try {
        const features = new APIFeatures(userListModel.find({}), req.query)
            .sort()
            .limitFields()
            .paginate()
            .filter();
        const userListData = await features.query;
        const responeData = JSON.parse(JSON.stringify(userListData));

        let apiResponse = response.generate(constants.SUCCESS, `Fetched Successfully`, constants.HTTP_SUCCESS, responeData);
        res.status(200).send(apiResponse)
    } catch (error) {
        res.json({
            status: 400,
            message: error.message,
        });
    }
};

/*
Controller function to filter data from userlist model.
@param {object} req - The HTTP request object
@param {object} res - The HTTP response object
@returns {Promise<void>}
*/
exports.filterData = async (req, res, next) => {
    try {
        const features = new APIFeatures(userListModel.find({}), req.body)
            .sort()
            .limitFields()
            .paginate()
            .filter();
        const userListData = await features.query;
        const responeData = JSON.parse(JSON.stringify(userListData));

        let apiResponse = response.generate(constants.SUCCESS, `Fetched Successfully`, constants.HTTP_SUCCESS, responeData);
        res.status(200).send(apiResponse)
    } catch (error) {
        res.json({
            status: 400,
            message: error.message,
        });
    }
};

/*
Controller function to get user data by id from userlist model.
@param {object} req - The HTTP request object
@param {object} res - The HTTP response object
@returns {Promise<void>}
*/
exports.getUserById = async (req, res, next) => {
    try {
        const userData = await userModel.findOne({ _id: req.params.id }).select('-__v -_id').lean();
        if (!userData) {
            apiResponse = response.generate(constants.ERROR, messages.USER.INVALIDUSER, constants.HTTP_NOT_FOUND, null)
            res.status(400).send(apiResponse);
        }
        else {
            apiResponse = response.generate(constants.SUCCESS, messages.USER.FETCHEDSUCCESS, constants.HTTP_SUCCESS, userData);
            res.status(200).send(apiResponse);
        }
    } catch (err) {
        res.status(400).json({
            status: 'fails',
            message: err.message,
        });
    }
};

/*
Controller function to verify user document in the system.
@param {object} req - The HTTP request object
@param {object} res - The HTTP response object
@returns {Promise<void>}
*/
exports.verify = async (req, res, next) => {
    try {
        let apiResponse;
        let userData = await userModel.findOne({ _id: req.body.id });
        if (!userData) {
            apiResponse = response.generate(constants.ERROR, messages.USER.INVALIDUSER, constants.HTTP_NOT_FOUND, null)
            res.status(400).send(apiResponse);
        }
        else {
            userData.PAN.status = req.body.personalKYC.PAN.status;
            userData.PAN.message = req.body.personalKYC.PAN.message ? req.body.personalKYC.PAN.message : '';
            userData.aadhar.status = req.body.personalKYC.aadhar.status;
            userData.aadhar.message = req.body.personalKYC.aadhar.message ? req.body.personalKYC.aadhar.message : '';
            userData.companyDetails.PAN.status = req.body.businessKYC.PAN.status;
            userData.companyDetails.PAN.message = req.body.businessKYC.PAN.message ? req.body.businessKYC.PAN.message : '';
            userData.companyDetails.udhyamDetails.status = req.body.businessKYC.udhyamDetails.status;
            userData.companyDetails.udhyamDetails.message = req.body.businessKYC.udhyamDetails.message ? req.body.businessKYC.udhyamDetails.message : '';
            userData.companyDetails.GST.status = req.body.businessKYC.GST.status;
            userData.companyDetails.GST.message = req.body.businessKYC.GST.message ? req.body.businessKYC.GST.message : '';
            userData.companyDetails.currentOutstandingLoan.status = req.body.businessKYC.currentOutstandingLoan.status;
            userData.companyDetails.currentOutstandingLoan.message = req.body.businessKYC.currentOutstandingLoan.message ? req.body.businessKYC.currentOutstandingLoan.message : '';
            userData.companyDetails.bankDetails.bankStatement.status = req.body.businessKYC.bankStatement.status;
            userData.companyDetails.bankDetails.bankStatement.message = req.body.businessKYC.bankStatement.message ? req.body.businessKYC.bankStatement.message : '';
            userData.companyDetails.profitLossStatement.status = req.body.businessKYC.profitLossStatement.status;
            userData.companyDetails.profitLossStatement.message = req.body.businessKYC.profitLossStatement.message ? req.body.businessKYC.profitLossStatement.message : '';
            userData.companyDetails.incomeTaxReturn.status = req.body.businessKYC.incomeTaxReturn.status;
            userData.companyDetails.incomeTaxReturn.message = req.body.businessKYC.incomeTaxReturn.message ? req.body.businessKYC.incomeTaxReturn.message : '';

            if (userData.PAN.status !== 'Rejected' && userData.aadhar.status !== 'Rejected') {
                await userModel.findOneAndUpdate({ userId: req.body.id }, { $set: { isPersonalKYCDone: true } }, { new: true });
                userData.isPersonalKYCDone = true
            } else {
                let data = await userModel.findOneAndUpdate({ userId: req.body.id }, { $set: { isPersonalKYCDone: false } }, { new: true });
                userData.isPersonalKYCDone = false
            }
            if (userData.companyDetails.PAN.status !== "Rejected" && userData.companyDetails.udhyamDetails.status !== "Rejected" && userData.companyDetails.GST.status !== "Rejected" && userData.companyDetails.currentOutstandingLoan.status !== "Rejected" && userData.companyDetails.bankDetails.status !== "Rejected" && userData.companyDetails.profitLossStatement.status !== "Rejected" && userData.companyDetails.incomeTaxReturn.status !== "Rejected" && userData.companyDetails.udhyamDetails.status !== "Rejected") {
                await userModel.findOneAndUpdate({ userId: req.body.id }, { $set: { isBussinesKYCDone: true } }, { new: true });
                userData.isBussinesKYCDone = true
            } else {
                await userModel.findOneAndUpdate({ userId: req.body.id }, { $set: { isBussinesKYCDone: false } }, { new: true });
                userData.isBussinesKYCDone = false
            }

            let dataModel = null;
            if (userData.PAN.status == 'Verified' && userData.aadhar.status == 'Verified' && userData.companyDetails.PAN.status == 'Verified' && userData.companyDetails.udhyamDetails.status == 'Verified' && userData.companyDetails.GST.status == 'Verified' && userData.companyDetails.currentOutstandingLoan.status == 'Verified' && userData.companyDetails.bankDetails.bankStatement.status == 'Verified' && userData.companyDetails.profitLossStatement.status == 'Verified' && userData.companyDetails.incomeTaxReturn.status == 'Verified') {
                userData.isKYCVerificationInProgress = 'DONE';
                userData.profileCompletion = 100;
                await userModel.findOneAndUpdate({ userId: req.body.id }, { $set: { profileCompletion: 100 } }, { new: true });
                await userListModel.findOneAndUpdate({ userId: req.body.id }, { $set: { status: 'Completed' } }, { new: true });
                dataModel = createNotificationData({ status: 'Completed', userId: req.body.id });
            }
            else if (userData.PAN.status == 'Verified' || userData.aadhar.status == 'Verified' || userData.companyDetails.PAN.status == 'Verified' || userData.companyDetails.udhyamDetails.status == 'Verified' || userData.companyDetails.GST.status == 'Verified' || userData.companyDetails.currentOutstandingLoan.status == 'Verified' || userData.companyDetails.bankDetails.bankStatement.status == 'Verified' || userData.companyDetails.profitLossStatement.status == 'Verified' || userData.companyDetails.incomeTaxReturn.status == 'Verified') {
                userData.isKYCVerificationInProgress = 'FAILED';
                userData.profileCompletion = 75;
                await userModel.findOneAndUpdate({ userId: req.body.id }, { $set: { profileCompletion: 75 } }, { new: true });
                await userListModel.findOneAndUpdate({ userId: req.body.id }, { $set: { status: 'Rejected' } }, { new: true });
                dataModel = createNotificationData({ status: 'Rejected', userId: req.body.id });
            }
            else {
                userData.isKYCVerificationInProgress = 'FAILED';
                userData.profileCompletion = 75;
                await userModel.findOneAndUpdate({ userId: req.body.id }, { $set: { profileCompletion: 75 } }, { new: true });
                await userListModel.findOneAndUpdate({ userId: req.body.id }, { $set: { status: 'Rejected' } }, { new: true });
                dataModel = createNotificationData({ status: 'Rejected', userId: req.body.id });
            }
            userData = await userData.save();

            let notiData= await dataModel.save();
            // socket
            let sockets = await req.io.fetchSockets();
            if (notiData.type == "Admin") {
                let userId = notiData.userId.toString();
                for (let socket of sockets) {
                    if (socket.connected && !(socket.disconnected) && socket.handshake.query["userId"] == userId) {
                        socket.emit('notification', notiData);
                        break;
                    }
                }
            } else {
                let index = sockets.findIndex(item => item.connected && !(item.disconnected) && item.handshake.query["isAdmin"] == "true");
                if (index != -1) {
                    sockets[index].emit('notification', notiData);
                }
            }

            apiResponse = response.generate(constants.SUCCESS, messages.USER.FETCHEDSUCCESS, constants.HTTP_SUCCESS, userData);
            res.status(200).send(apiResponse);
        }
    } catch (err) {
        res.status(400).json({
            status: 'fails',
            message: err.message,
        });
    }
};
/*
Controller function to create Notification.
@param {object} req - The HTTP request object
@param {object} res - The HTTP response object
@returns {Promise<void>}
*/
function createNotificationData(data) {

    let dataModel = new notificationModel({
        _id: new mongoose.Types.ObjectId(),
        msg: data.status == 'Completed' ? 'Congratulations!' : 'Click here to view the report',
        userId: data.userId,
        title: data.status == 'Completed' ? 'KYC Verification Done' : 'KYC Verification Failed',
        type: "Admin",
        adminStatus: data.status
    })

    return dataModel;
}

/*
Controller function to check user document upload or not in the system.
@param {object} req - The HTTP request object
@param {object} res - The HTTP response object
@returns {Promise<void>}
*/
exports.checkUncheckDoc = async (req, res, next) => {
    try {
        let apiResponse;
        let userData = await userModel.findOne({ _id: req.body.id });
        if (!userData) {
            apiResponse = response.generate(constants.ERROR, messages.USER.INVALIDUSER, constants.HTTP_NOT_FOUND, null)
            res.status(400).send(apiResponse);
        }
        else {

            if (req.body.personalKYC?.PAN) {
                userData.PAN.hasAdminChecked = req.body.personalKYC.PAN.value;
            } else if (req.body.personalKYC?.aadhar) {
                userData.aadhar.hasAdminChecked = req.body.personalKYC.aadhar.value;
            } else if (req.body.businessKYC?.PAN) {
                userData.companyDetails.PAN.hasAdminChecked = req.body.businessKYC.PAN.value;
            } else if (req.body.businessKYC?.udhyamDetails) {
                userData.companyDetails.udhyamDetails.hasAdminChecked = req.body.businessKYC.udhyamDetails.value;
            } else if (req.body.businessKYC?.GST) {
                userData.companyDetails.GST.hasAdminChecked = req.body.businessKYC.GST.value;
            } else if (req.body.businessKYC?.currentOutstandingLoan) {
                userData.companyDetails.currentOutstandingLoan.hasAdminChecked = req.body.businessKYC.currentOutstandingLoan.value;
            } else if (req.body.businessKYC?.bankStatement) {
                userData.companyDetails.bankDetails.bankStatement.hasAdminChecked = req.body.businessKYC.bankStatement.value;
            } else if (req.body.businessKYC?.profitLossStatement) {
                userData.companyDetails.profitLossStatement.hasAdminChecked = req.body.businessKYC.profitLossStatement.value;
            } else if (req.body.businessKYC?.incomeTaxReturn) {
                userData.companyDetails.incomeTaxReturn.hasAdminChecked = req.body.businessKYC.incomeTaxReturn.value;
            }

            userData = await userData.save();
            apiResponse = response.generate(constants.SUCCESS, messages.USER.FETCHEDSUCCESS, constants.HTTP_SUCCESS, userData);
            res.status(200).send(apiResponse);
        }
    } catch (err) {
        res.status(400).json({
            status: 'fails',
            message: err.message,
        });
    }
};

exports.mapData = async (req, res, next) => {
    try {
        const features = new APIFeatures(userListModel.find({}), req.query)
            .sort()
            .limitFields()
            .paginate()
            .filter();
        let userListData = await features.query;

        if (req.query.term == 'yearly') {

            let currentDate = moment();
            let oldDate = moment().subtract(1, 'year');

            userListData = userListData.filter(ele => {

                let regisdate = moment(ele.updatedAt);
                if (oldDate < regisdate && regisdate < currentDate) {
                    return true;
                } else {
                    return false;
                }
            });
        } else if (req.query.term == 'monthly') {

            let currentDate = moment();
            let oldDate = moment().subtract(1, 'month');

            userListData = userListData.filter(ele => {

                let regisdate = moment(ele.updatedAt);
                if (oldDate < regisdate && regisdate < currentDate) {
                    return true;
                } else {
                    return false;
                }
            });

        } else if (req.query.term == 'weekly') {

            let currentDate = moment();
            let oldDate = moment().subtract(1, 'week');

            userListData = userListData.filter(ele => {

                let regisdate = moment(ele.updatedAt);
                if (oldDate < regisdate && regisdate < currentDate) {
                    return true;
                } else {
                    return false;
                }
            });

        } else {
            let currentDate = moment();
            let oldDate = moment().subtract(1, 'day');

            userListData = userListData.filter(ele => {

                let regisdate = moment(ele.updatedAt);
                if (oldDate < regisdate && regisdate < currentDate) {
                    return true;
                } else {
                    return false;
                }
            });
        }

        let formedObject = groupBy(userListData, 'status');

        let keys = Object.keys(formedObject);

        if (keys && keys.length) {
            keys.forEach(val => {
                formedObject[val] = formedObject[val].length;
            })
        }

        const responeData = JSON.parse(JSON.stringify(formedObject));

        let apiResponse = response.generate(constants.SUCCESS, `Fetched Successfully`, constants.HTTP_SUCCESS, responeData);
        res.status(200).send(apiResponse)
    } catch (error) {
        res.json({
            status: 400,
            message: error.message,
        });
    }
};

function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
        const key = obj[property];
        if (!acc[key]) {
            acc[key] = [];
        }
        // Add object to list for given key's value
        acc[key].push(obj);
        return acc;
    }, {});
}