let axios = require("axios").default;
const { constants, messages } = require("../constants.js");
const response = require('../lib/responseLib');

// const fetchDataWithCin2 = async function (req, res) {
//     try {
//         let cinNumber = req.body.cinNumber
//         let responseFromRequestId
//         let optionsforRequestedid = {
//             method: 'POST',
//             url: ` https://preproduction.signzy.tech/api/v2/patrons/63d0baac7486ee4822af0414/companyconsolidated`,
//             headers: {
//                 Authorization: "zwHEZvcZSTHa2XTbFilDFV3fh5qiFMMI77SyS3PaOsvy8S22YPLkcT5EwaOqCtMt"
//             },
//             data: { task: 'fetch', essentials: { cin: "U74999TG2021PTC152491", callbackUrl: "https://www.w3schools.com" } }
//         };
//         axios.request(optionsforRequestedid).then(function (response) {
//             console.log(response.data);
//             responseFromRequestId = response.data;
//             let optionsForGetData = {
//                 method: 'POST',
//                 url: 'https://preproduction.signzy.tech/api/v2/patrons/63d0baac7486ee4822af0414/companyconsolidated',
//                 headers: {
//                     Authorization: "zwHEZvcZSTHa2XTbFilDFV3fh5qiFMMI77SyS3PaOsvy8S22YPLkcT5EwaOqCtMt"
//                 },
//                 data: { task: 'getData', essentials: { requestId: responseFromRequestId.result.requestId } }
//             };

//             axios.request(optionsForGetData).then(function (response) {
//                 console.log(response.data);
//                 res.send(response.data)
//             }).catch(function (err) {
//                 let apiResponse = response.generate(
//                     constants.ERROR,
//                     messages.cin.FAILURE,
//                     constants.HTTP_SERVER_ERROR,
//                     err
//                 );
//                 res.status(400).send(apiResponse);
//             });
//         }).catch(function (err) {
//             let apiResponse = response.generate(
//                 constants.ERROR,
//                 messages.cin.FAILURE,
//                 constants.HTTP_SERVER_ERROR,
//                 err
//             );
//             res.status(400).send(apiResponse);
//         });

//     } catch (err) {
//         let apiResponse = response.generate(
//             constants.ERROR,
//             messages.cin.serverError,
//             constants.HTTP_SERVER_ERROR,
//             err
//         );
//         res.status(500).send(apiResponse);
//     }

// }

const fetchDataWithCin = async function (req, res) {
    try {

        let { cin } = req.body
        let options = {
            method: 'POST',
            url: `https://preproduction.signzy.tech/api/v2/patrons/63d0baac7486ee4822af0414/companyconsolidated`,
            headers: {
                Authorization: "zwHEZvcZSTHa2XTbFilDFV3fh5qiFMMI77SyS3PaOsvy8S22YPLkcT5EwaOqCtMt"
            },
            data: {
                task: 'fetchRealtime',
                essentials: { cin: `${cin}`}
            }
        };

        
        axios.request(options).then(function (responseFromAxios) {
            let apiResponse = response.generate(constants.SUCCESS, messages.cin.SUCCESS, constants.HTTP_SUCCESS, responseFromAxios.data,);
            res.status(200).send(apiResponse);
        }).catch(function (err) {
            let apiResponse = response.generate(
                constants.ERROR,
                messages.bank.FAILURE,
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
