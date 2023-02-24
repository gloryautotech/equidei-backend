let axios = require("axios").default;
const formData = require('form-data')
const fs = require('fs')
const { constants, messages } = require("../constants.js");
const response = require('../lib/responseLib');
const bankModel = require('../model/bankName')

let allBankList = async function (req, res) {
    try {

        let data = await bankModel.find().select({ name: 1, _id: 0 })
        let apiResponse = response.generate(constants.SUCCESS, messages.BANKSTATEMENT.FETCH, constants.HTTP_SUCCESS, data)
        res.status(200).send(apiResponse)
    } catch (err) {
        let apiResponse = response.generate(constants.ERROR, messages.BANKSTATEMENT.SERVERERROR, err)
        res.status(500).send(apiResponse)
    }
}

let bankVerify = async function (req, res) {
    try {
        let file = req.files[0]
        let uploadResponse;
        const form = new formData()
        form.append('file', fs.readFileSync(file.path), file.originalname)
        const optionsForUpload = {
            method: 'POST',
            url: 'https://preproduction-persist.signzy.tech/api/files/upload',
            data: form
        };
        axios.request(optionsForUpload).then(function (responseFromAxios) {
            uploadResponse = responseFromAxios.data.file.directURL
            console.log(uploadResponse);
            var optionsConvert = {
                method: 'POST',
                url: `https://preproduction.signzy.tech/api/v2/patrons/${process.env.PATRONID}/converters`,
                headers: {
                    Authorization: process.env.AUTHTOKEN
                },
                data: {
                    task: "imageConverter",
                    essentials: {
                        url: uploadResponse,
                        targetFormat: "PDF"
                    }
                }
            }
            axios.request(optionsConvert).then(async function (responseFromAxios) {
                console.log("data from convert ", responseFromAxios.data)
                let pdfUrl = responseFromAxios.data.result.result.convertedFile
                let { ifscNumber, accountType, accountNumber, bankName } = req.body

                let optionsForBankStatement = {
                    method: 'POST',
                    url: `https://preproduction.signzy.tech/api/v2/patrons/${process.env.PATRONID}/bankstatements`,
                    headers: {
                        Authorization: process.env.AUTHTOKEN
                    },
                    data: {
                        essentials: { url: pdfUrl, bankName: bankName, accountType: accountType }
                    }
                };
                axios.request(optionsForBankStatement).then(function (responseFromAxios) {
                    let responseData = responseFromAxios.data
                    if (responseData.result.accountNo == accountNumber && responseData.result.ifsCode == ifscNumber) {
                        let apiResponse = response.generate(constants.SUCCESS, messages.BANKSTATEMENT.SUCCESS, constants.HTTP_SUCCESS, responseData)
                        res.status(200).send(apiResponse)
                    } else {
                        let apiResponse = response.generate(constants.ERROR, messages.BANKSTATEMENT.NOTMATCH, constants.HTTP_NOT_FOUND,)
                        res.status(404).send(apiResponse)
                    }
                }).catch(function (err) {
                    let apiResponse = response.generate(constants.ERROR, messages.BANKSTATEMENT.FAILURE, err)
                    res.status(400).send(apiResponse)
                });
            }).catch(function (err) {
                let apiResponse = response.generate(constants.ERROR, messages.BANKSTATEMENT.FAILURE, err)
                res.status(400).send(apiResponse)
            });
        }).catch((err) => {
            let apiResponse = response.generate(constants.ERROR, messages.BANKSTATEMENT.FAILURE, err)
            res.status(400).send(apiResponse)
        })
    } catch (err) {
        let apiResponse = response.generate(constants.ERROR, messages.BANKSTATEMENT.SERVERERROR, err)
        res.status(500).send(apiResponse)
    }
}



module.exports = { bankVerify, allBankList }