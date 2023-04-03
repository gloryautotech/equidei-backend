const axios = require("axios");
const formData = require('form-data')
const fs = require('fs')
const { constants, messages } = require("../constants.js");
const response = require('../lib/responseLib');
const userModel = require('../model/user')
const bankModel = require("../model/bankName")
const assetModel = require("../model/asset")
const contentDisposition = require("content-disposition")

const panVerify = async function (req, res) {
    try {
        // upload file
        let uploadResponse = [];
        let user = await userModel.findOne({ email: req.body.email })
        const form = new formData()
        const response = await axios.get(user.PAN.file, { responseType: 'arraybuffer' })
        const buffer = Buffer.from(response.data, "utf-8")
        let fileName = contentDisposition.parse(response.headers["content-disposition"])
        form.append('file', buffer, fileName.parameters.filename)
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
                    // varify
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
                    axios.request(optionsForVerify).then(async function (responseFromAxios) {
                        let data = responseFromAxios.data
                        if (data.verified == true) {
                            user.PAN.status = "Verified"
                            await userModel.findOneAndUpdate({ email: req.body.email }, user, { new: true })
                        } else {
                            user.PAN.status = "Rejected"
                            await userModel.findOneAndUpdate({ email: req.body.email }, user, { new: true })
                        }
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
        // upload file
        let uploadResponse = [];
        let user = await userModel.findOne({ email: req.body.email })
        const form = new formData()
        const response = await axios.get(user.PAN.file, { responseType: 'arraybuffer' })
        const buffer = Buffer.from(response.data, "utf-8")
        let fileName = contentDisposition.parse(response.headers["content-disposition"])
        form.append('file', buffer, fileName.parameters.filename)
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
                    axios.request(optionsForVarify).then(async function (responseFromverify) {
                        let data = responseFromverify.data
                        if (data.verified == true) {
                            user.aadhar.status = "Verified";
                            await userModel.findOneAndUpdate({ email: req.body.email }, user, { new: true })
                        } else {
                            user.aadhar.status = "Rejected";
                            await userModel.findOneAndUpdate({ email: req.body.email }, user, { new: true })
                        }
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
        let uploadResponse;
        let user = await userModel.findOne({ email: req.body.email })
        const form = new formData()
        const response = await axios.get(user.companyDetails.bankDetails.bankStatement.file, { responseType: 'arraybuffer' })
        const buffer = Buffer.from(response.data, "utf-8")
        let fileName = contentDisposition.parse(response.headers["content-disposition"])
        form.append('file', buffer, fileName.parameters.filename)
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
                let pdfUrl = responseFromAxios.data.result.result.convertedFile
                let optionsForBankStatement = {
                    method: 'POST',
                    url: `https://preproduction.signzy.tech/api/v2/patrons/${process.env.PATRONID}/bankstatements`,
                    headers: {
                        Authorization: process.env.AUTHTOKEN
                    },
                    data: {
                        essentials: { url: pdfUrl, bankName: user.companyDetails.bankDetails.bankName, accountType: user.companyDetails.bankDetails.accountType }
                    }
                };
                axios.request(optionsForBankStatement).then(function (responseFromAxios) {
                    let responseData = responseFromAxios.data
                    if (responseData.result.accountNo == user.companyDetails.bankDetails.accountNumber && responseData.result.ifsCode == user.companyDetails.bankDetails.IFSC) {
                        let apiResponse = response.generate(constants.SUCCESS, messages.BANKSTATEMENT.SUCCESS, constants.HTTP_SUCCESS, responseData)
                        res.status(200).send(apiResponse)
                    } else {
                        let apiResponse = response.generate(constants.ERROR, messages.BANKSTATEMENT.NOTMATCH, constants.HTTP_NOT_FOUND, null)
                        res.status(404).send(apiResponse)
                    }
                }).catch(function (err) {
                    let apiResponse = response.generate(constants.ERROR, messages.BANKSTATEMENT.FAILURE, constants.HTTP_NOT_FOUND, err)
                    res.status(400).send(apiResponse)
                });
            }).catch(function (err) {
                let apiResponse = response.generate(constants.ERROR, messages.BANKSTATEMENT.FAILURE, constants.HTTP_NOT_FOUND, err)
                res.status(400).send(apiResponse)
            });
        }).catch((err) => {
            let apiResponse = response.generate(constants.ERROR, messages.BANKSTATEMENT.FAILURE, constants.HTTP_NOT_FOUND, err)
            res.status(400).send(apiResponse)
        })
    } catch (err) {
        let apiResponse = response.generate(constants.ERROR, messages.BANKSTATEMENT.SERVERERROR, constants.HTTP_SERVER_ERROR, err)
        res.status(500).send(apiResponse)
    }
}


const eSignature = async function (req, res) {
    try {
        let assetId = req.params.assetId;
        let asset = await assetModel.findById(assetId)
        let user = await userModel.findById(asset.userId)
        let optionForLogin = {
            method: 'POST',
            url: `https://esign-preproduction.signzy.tech/api/customers/login`,
            data: { username: process.env.SIGNZYUSERNAME, password: process.env.SIGNZYPASSWORD }
        }
        axios.request(optionForLogin).then(async function (responseFromLoginApi) {
            let userId = responseFromLoginApi.data.userId
            let accessToken = responseFromLoginApi.data.id
            // upload file
            const form = new formData()
            let file = Buffer.from(req.body.data)
            form.append("file", file, { filename: "contract.pdf" })
            const optionsForUpload = {
                method: 'POST',
                url: 'https://preproduction-persist.signzy.tech/api/files/upload',
                data: form
            };
            await axios.request(optionsForUpload).then(async function (responseFromUploadAPi) {
                let uploadResponse = responseFromUploadAPi.data.file.directURL;
                let optionForurl = {
                    method: 'POST',
                    url: `https://esign-preproduction.signzy.tech/api/customers/${userId}/aadhaaresigns`,
                    headers: {
                        Authorization: accessToken
                    },
                    data: {
                        task: "url",
                        inputFile: uploadResponse,
                        name: user.adminName
                    }
                }
                axios.request(optionForurl).then(async (responseFromesignsApi) => {
                    let apiResponse = response.generate(constants.SUCCESS, messages.eSign.SUCCESS, constants.HTTP_SUCCESS, responseFromesignsApi.data)
                    res.status(200).send(apiResponse)
                }).catch((err) => {
                    let apiResponse = response.generate(constants.ERROR, messages.eSign.FAILURE, constants.HTTP_NOT_FOUND, err)
                    res.status(400).send(apiResponse)
                })
            }).catch((err) => {
                let apiResponse = response.generate(constants.ERROR, messages.eSign.FAILURE, constants.HTTP_NOT_FOUND, err)
                res.status(400).send(apiResponse)
            })
        }).catch((err) => {
            let apiResponse = response.generate(constants.ERROR, messages.eSign.FAILURE, constants.HTTP_NOT_FOUND, err)
            res.status(400).send(apiResponse)
        })
    } catch (err) {
        let apiResponse = response.generate(constants.ERROR, messages.eSign.SERVERERROR, constants.HTTP_SERVER_ERROR, err)
        res.status(500).send(apiResponse)
    }
}


const eStamping = async function (req, res) {
    try {
        // upload file
        const form = new formData()
        let file = Buffer.from(req.body.data)
        form.append("file", file, { filename: "contract.pdf" })
        const optionsForUpload = {
            method: 'POST',
            url: 'https://preproduction-persist.signzy.tech/api/files/upload',
            data: form
        };
        await axios.request(optionsForUpload).then(async function (responseFromUploadAPi) {
            let uploadResponse = responseFromUploadAPi.data.file.directURL;
            let optionsForEstamping = {
                method: 'POST',
                url: `https://preproduction.signzy.tech/api/v2/patrons/${process.env.PATRONID}/estamping`,
                data: {
                    "task": "eStamp",
                    essentials: {
                        stateCode: "KA",
                        firstPartyName: "EQUIDEI",
                        secondPartyName: "PRAMIT",
                        considerationPrice: "100",
                        stampDutyPaidBy: "PRAMIT",
                        stampDutyValue: "100",
                        purposeOfStampDuty: "eStamp",
                        articleCode: "123",
                        pdfUrl: uploadResponse,
                        callbackUrl: "https://equidei.onrender.com/api/documentVerify/callbackUrl"
                    }
                }
            }
            axios.request(optionsForEstamping).then(async (responseFromEsatmpingApi) => {
                await assetModel.findByIdAndUpdate(req.params.assetId, { msmeStatus: "Added to Inventory", adminStatus: "Added to Inventory" }, { new: true })
                let apiResponse = response.generate(constants.SUCCESS, messages.eSign.SUCCESS, constants.HTTP_SUCCESS, responseFromEsatmpingApi.data)
                res.status(200).send(apiResponse)
            }).catch((err) => {
                let apiResponse = response.generate(constants.ERROR, messages.eSign.FAILURE, constants.HTTP_NOT_FOUND, err)
                res.status(400).send(apiResponse)
            })
        }).catch((err) => {
            let apiResponse = response.generate(constants.ERROR, messages.eSign.FAILURE, constants.HTTP_NOT_FOUND, err)
            res.status(400).send(apiResponse)
        })
    } catch (err) {
        let apiResponse = response.generate(constants.ERROR, messages.eSign.SERVERERROR, constants.HTTP_SERVER_ERROR, err)
        res.status(500).send(apiResponse)
    }
}
// callback url 
let callbackUrl = async function (response) {
    let result
    if (response.result) {
        result = response.result
    } else if (response.error) {
        result = response.error
    }
    await assetModel.findOneAndUpdate({ transactionId: response.transactionId }, { estamping: result }, { new: true, upsert: true })
}
module.exports = { panVerify, aadharVerify, bankVerify, allBankList, eSignature, eStamping, callbackUrl }