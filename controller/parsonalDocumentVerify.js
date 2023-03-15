const axios = require("axios");
const formData = require('form-data')
const fs = require('fs')
const { constants, messages } = require("../constants.js");
const response = require('../lib/responseLib');

const panVerify = async function (req, res) {
    try {
        // upload file
        let file = req.files[0]
        let uploadResponse = [];
        const form = new formData()
        form.append('file', fs.readFileSync(file.path), file.originalname)
        const optionsForUpload = {
            method: 'POST',
            url: 'https://preproduction-persist.signzy.tech/api/files/upload',
            data: form
        };
        await axios.request(optionsForUpload).then(function (responseFromAxios) {
            uploadResponse.push(responseFromAxios.data.file.directURL)
            // create identity
            let identityResponse;
            const optionsForIdentity = {
                method: 'POST',
                url: `https://preproduction.signzy.tech/api/v2/patrons/${process.env.PATRONID}/identities`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: process.env.AUTHTOKEN
                },
                data: {
                    type: req.body.panType,
                    email: "ankur.rand@signzy.com",
                    callbackUrl: "https://www.w3schools.com",
                    images: uploadResponse
                }
            };
            axios.request(optionsForIdentity).then(function (responseFromAxios) {
                identityResponse = responseFromAxios.data
                // autoRecognition
                let autoRecognition;
                const optionsForAutoRecognition = {
                    method: 'POST',
                    url: 'https://preproduction.signzy.tech/api/v2/snoops',
                    headers: { "Content-Type": "application/json" },
                    data: {
                        service: "Identity",
                        itemId: `${identityResponse.id}`,
                        task: "autoRecognition",
                        accessToken: `${identityResponse.accessToken}`,
                        "essentials": {}
                    }
                };
                axios.request(optionsForAutoRecognition).then(async function (responseFromAxios) {
                    autoRecognition = responseFromAxios.data
                    console.log(autoRecognition)
                    // varify
                    // let panNumber = req.body.panNumber
                    let { email } = req.body
                    let user = await userModel.findOne({ email: email })
                    let optionsForVerify = {
                        method: 'POST',
                        url: ' https://preproduction.signzy.tech/api/v2/snoops',
                        data: {
                            service: 'Identity',
                            itemId: `${autoRecognition.itemId}`,
                            accessToken: `${identityResponse.accessToken}`,
                            task: 'verification',
                            essentials: { number: `${user.PAN.panNumber}`, name: `${user.PAN.name}`, fuzzy: true }
                        }
                    };
                    axios.request(optionsForVerify).then(function (responseFromAxios) {
                        let data = responseFromAxios.data
                        let apiResponse = response.generate(constants.SUCCESS, messages.PAN.SUCCESS, constants.HTTP_SUCCESS, data)
                        res.status(200).send(apiResponse)
                    }).catch(function (err) {
                        let apiResponse = response.generate(constants.ERROR, messages.PAN.FAILURE, constants.HTTP_NOT_FOUND, err)
                        res.status(400).send(apiResponse)
                    });
                }).catch(function (err) {
                    let apiResponse = response.generate(constants.ERROR, messages.PAN.FAILURE, constants.HTTP_NOT_FOUND, err)
                    res.status(400).send(apiResponse)
                });
            }).catch(function (err) {
                let apiResponse = response.generate(constants.ERROR, messages.PAN.FAILURE, constants.HTTP_NOT_FOUND, err)
                res.status(400).send(apiResponse)
            });
        }).catch(function (err) {
            let apiResponse = response.generate(constants.ERROR, messages.PAN.FAILURE, constants.HTTP_NOT_FOUND, err)
            res.status(400).send(apiResponse)
        });
    } catch (err) {
        let apiResponse = response.generate(constants.ERROR, messages.PAN.SERVERERROR, constants.HTTP_SERVER_ERROR, err)
        res.status(500).send(apiResponse)
    }
}

const aadharVerify = async function (req, res) {
    try {
        let uploadResponse = []

        // upload file
        for (let el of req.files) {
            try {
                const form = new formData()
                form.append('file', fs.readFileSync(el.path), el.originalname)
                const optionsForUpload = {
                    method: 'POST',
                    url: 'https://preproduction-persist.signzy.tech/api/files/upload',
                    data: form
                };

                await axios.request(optionsForUpload).then(function (responseFromUpload) {
                    uploadResponse.push(responseFromUpload.data.file.directURL)
                    // create identity
                    let identityResponse;
                    const optionsForIdentity = {
                        method: 'POST',
                        url: ' https://preproduction.signzy.tech/api/v2/patrons/63d0baac7486ee4822af0414/identities',
                        headers: { "Content-Type": "application/json", Authorization: process.env.AUTHTOKEN },
                        data: {
                            type: "aadhaar",
                            email: "ankur.rand@signzy.com",
                            callbackUrl: "https://www.w3schools.com",
                            images: uploadResponse
                        }
                    };
                    axios.request(optionsForIdentity).then(function (responseIdentity) {
                        identityResponse = responseIdentity.data
                        // autoRecognition

                        const optionsForAutoRecognition = {
                            method: 'POST',
                            url: 'https://preproduction.signzy.tech/api/v2/snoops',
                            headers: { "Content-Type": "application/json" },
                            data: {
                                service: "Identity",
                                itemId: `${identityResponse.id}`,
                                task: "autoRecognition",
                                accessToken: `${identityResponse.accessToken}`,
                                "essentials": {}
                            }
                        };
                        axios.request(optionsForAutoRecognition).then(async function (responseRecognition) {
                            let autoRecognition = responseRecognition.data
                            // varify
                            let { email } = req.body;
                            let user = await userModel.findOne({ email: email })
                            let optionsForVarify = {
                                method: 'POST',
                                url: ' https://preproduction.signzy.tech/api/v2/snoops',
                                data: {
                                    service: 'Identity',
                                    itemId: `${identityResponse.id}`,
                                    accessToken: `${identityResponse.accessToken}`,
                                    task: 'verifyAadhaar',
                                    essentials: {
                                        uid: user.aadhar.aadharNumber
                                    }
                                }
                            };
                            axios.request(optionsForVarify).then(function (responseFromverify) {
                                let data = responseFromverify.data
                                let apiResponse = response.generate(constants.SUCCESS, messages.AADHAR.SUCCESS, constants.HTTP_SUCCESS, data)
                                res.status(200).send(apiResponse)
                            }).catch(function (err) {
                                let apiResponse = response.generate(constants.ERROR, messages.AADHAR.FAILURE, constants.HTTP_NOT_FOUND, err)
                                res.status(400).send(apiResponse)
                            });
                        }).catch(function (err) {
                            let apiResponse = response.generate(constants.ERROR, messages.AADHAR.FAILURE, constants.HTTP_NOT_FOUND, err)
                            res.status(400).send(apiResponse)
                        });
                    }).catch(function (err) {
                        let apiResponse = response.generate(constants.ERROR, messages.AADHAR.FAILURE, constants.HTTP_NOT_FOUND, err)
                        res.status(400).send(apiResponse)
                    });
                }).catch(function (err) {
                    let apiResponse = response.generate(constants.ERROR, messages.AADHAR.FAILURE, constants.HTTP_NOT_FOUND, err)
                    res.status(400).send(apiResponse)
                });
            } catch (err) {
                let apiResponse = response.generate(constants.ERROR, messages.AADHAR.SERVERERROR, constants.HTTP_SERVER_ERROR, err)
                res.status(500).send(apiResponse)
            }
        }
    } catch (error) {
        let apiResponse = response.generate(constants.ERROR, messages.AADHAR.SERVERERROR, constants.HTTP_SERVER_ERROR, err)
        res.status(500).send(apiResponse)
    }

}
module.exports = { panVerify, aadharVerify }