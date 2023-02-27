const axios = require("axios");
const { constants, messages } = require("../constants.js");
const response = require('../lib/responseLib');

const gstVerify = async function (req, res) {
    try {
        let { gstNumber, companyName } = req.body
        let options = {
            method: 'POST',
            url: `https://sm-gst.scoreme.in/gst//external/gstinbasicinfo`,
            headers: {
                clientId: process.env.CLIENTID,
                clientSecret: process.env.CLIENTSECRET
            },
            data: {
                gstin: [`${gstNumber}`]
            }

        }
        axios.request(options).then(function (responseFromAxios) {
            let result = responseFromAxios.data.data.tradeName
            let check = result.includes(companyName)
            if (check) {
                let apiResponse = response.generate(constants.SUCCESS, messages.GST.SUCCESS, constants.HTTP_SUCCESS, responseFromAxios.data);
                res.status(200).send(apiResponse)
            } else {
                let apiResponse = response.generate(constants.ERROR, messages.GST.NOTMATCH, constants.HTTP_NOT_FOUND, responseFromAxios.data,);
                res.status(400).send(apiResponse);
            }
        }).catch(function (err) {
            let apiResponse = response.generate(
                constants.ERROR,
                messages.GST.FAILURE,
                constants.HTTP_SERVER_ERROR,
                err
            );
            res.status(400).send(apiResponse);
        });
    } catch (err) {
        let apiResponse = response.generate(
            constants.ERROR,
            messages.GST.SERVERERROR,
            constants.HTTP_SERVER_ERROR,
            err
        );
        res.status(500).send(apiResponse);
    }
}

module.exports = { gstVerify }