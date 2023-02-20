let axios = require("axios").default;
const { constants, messages } = require("../constants.js");
const response = require('../lib/responseLib');

const fetchDataWithCin = async function (req, res) {
    try {

        let { cin } = req.body
        let options = {
            method: 'POST',
            url: `https://preproduction.signzy.tech/api/v2/patrons/${process.env.PATRONID}/companyconsolidated`,
            headers: {
                Authorization: process.env.AUTHTOKEN
            },
            data: {
                task: 'fetchRealtime',
                essentials: { cin: `${cin}` }
            }
        };


        axios.request(options).then(function (responseFromAxios) {
            let result = responseFromAxios.data.result.statusCode
            if (result == 404) {
                let apiResponse = response.generate(constants.ERROR, messages.cin.notFund, constants.HTTP_NOT_FOUND, responseFromAxios.data.result);
                res.status(404).send(apiResponse)
            } else {
                let apiResponse = response.generate(constants.SUCCESS, messages.cin.SUCCESS, constants.HTTP_SUCCESS, responseFromAxios.data,);
                res.status(200).send(apiResponse);
            }
        }).catch(function (err) {
            let apiResponse = response.generate(
                constants.ERROR,
                messages.cin.FAILURE,
                constants.HTTP_SERVER_ERROR,
                err
            );
            res.status(400).send(apiResponse);
        });
    } catch (err) {
        let apiResponse = response.generate(
            constants.ERROR,
            messages.cin.serverError,
            constants.HTTP_SERVER_ERROR,
            err
        );
        res.status(500).send(apiResponse);
    }

}
module.exports = { fetchDataWithCin }
