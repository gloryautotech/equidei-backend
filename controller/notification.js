
const response = require('../lib/responseLib');
const { constants, messages } = require("../constants.js");
const APIFeatures = require('../utils/apiFeatures');
const notificationModel = require('../model/notification-logger');
const userModel = require('../model/user');
const mongoose = require("mongoose");

exports.getAll = async (req, res, next) => {
    try {

        let obj = {
            seen: false,
            type: req.query.role == 'Admin' ? 'User' : 'Admin'
        }

        if (req.query.role == 'User') {
            obj['userId'] = req.query.userId;
        }
        const features = new APIFeatures(notificationModel.find(obj), req.query).sort().paginate();
        let notificationData = await features.query;
        let finalArray = [];
        if (notificationData && notificationData.length == req.query.limit) {

        } else {

            let obj = {
                seen: true,
                type: req.query.role == 'Admin' ? 'User' : 'Admin'
            }

            if (req.query.role == 'User') {
                obj['userId'] = req.query.userId;
            }
            const features1 = new APIFeatures(notificationModel.find(obj), req.query).sort().paginate();
            let restArray = await features1.query;
            if (restArray && restArray.length) {
                let temp = [...notificationData, ...restArray];
                temp = temp.slice(0, req.query.limit);
                notificationData = JSON.parse(JSON.stringify(temp));
            }
        }
        // let mainArray = [];
        // if (req.query.role == 'Admin') {

        //     if (notificationData && notificationData.length) {
        //         mainArray = notificationData.filter(v => !v.seen && v.type == 'User');
        //     }

        //     if (mainArray && mainArray.length < 10) {
        //         mainArray = [...mainArray,...notificationData.filter(v => v.seen && v.type == 'User')];
        //     }

        //     notificationData = mainArray.slice(0,10);

        // } else if (req.query.role == 'User') {

        //     if (notificationData && notificationData.length) {
        //         mainArray = notificationData.filter(v => !v.seen && v.type == 'Admin' && v.userId == req.query.userId);
        //     }

        //     if (mainArray && mainArray.length < 10) {
        //         mainArray = [...mainArray,...notificationData.filter(v => v.seen && v.type == 'Admin' && v.userId == req.query.userId)];
        //     }

        //     notificationData = mainArray.slice(0,10);

        // }

        finalArray = [...notificationData];

        const responeData = JSON.parse(JSON.stringify(finalArray));

        let apiResponse = response.generate(constants.SUCCESS, `Fetched Successfully`, constants.HTTP_SUCCESS, responeData);

        let copy = [...responeData];
        copy = copy.map(ele => ele._id);

        await notificationModel.updateMany({ _id: { $in: copy } }, { $set: { seen: true } });

        res.status(200).send(apiResponse)
    } catch (error) {
        res.json({
            status: 400,
            message: error.message,
        });
    }
};

exports.deleteNotification = async (req, res, next) => {
    try {
        const { id } = req.params;
        let apiResponse;
        let notificationData = await notificationModel.findOneAndDelete({ _id: id }, { new: true });
        if (!notificationData) {
            apiResponse = response.generate(
                constants.ERROR,
                "Invalid Notification Id",
                constants.HTTP_NOT_FOUND,
                null
            );
            res.status(400).send(apiResponse);
            return;
        } else {
            let apiResponse = response.generate(
                constants.SUCCESS,
                "Notification Deleted Successfully",
                constants.HTTP_SUCCESS,
                notificationData
            );
            res.status(200).send(apiResponse);
            return;
        }
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message,
        });
    }
};

exports.alertNotification = async (req, res, next) => {
    try {

        const id = req.params.id;

        let userData = await userModel.findById(id);
        if (!userData) {
            let apiResponse = response.generate(
                constants.ERROR,
                messages.USER.INVALIDUSER,
                constants.HTTP_NOT_FOUND,
                null
            );
            res.status(400).send(apiResponse);
            return;
        } else {
            let dataModel = createNotificationData({ status: 'Rejected', userId: id });
            let notiData = await dataModel.save();
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
            let apiResponse = response.generate(constants.SUCCESS, "Notification created", constants.HTTP_SUCCESS, notiData);
            res.status(200).send(apiResponse);
        }
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message,
        });
    }
}

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