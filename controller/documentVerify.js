const axios = require("axios");
const formData = require('form-data')
const fs = require('fs')
const { constants, messages } = require("../constants.js");
const response = require('../lib/responseLib');
const userModel = require('../model/user')
const bankModel = require("../model/bankName")
const assetModel = require("../model/asset")
const contentDisposition = require("content-disposition")
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');

/*
Controller function to verify pan document kyc.
@param {object} req - The HTTP request object
@param {object} res - The HTTP response object
@returns {Promise<void>}
*/
const panVerify = async function (req, res) {
    try {
        // upload file
        let uploadResponse = [];
        let user = await userModel.findOne({ email: req.body.email })
        const form = new formData()
        const downloadDocument = await axios.get(user.PAN.file, { responseType: 'arraybuffer' })
        const buffer = Buffer.from(downloadDocument.data, "utf-8")
        let fileName = contentDisposition.parse(downloadDocument.headers["content-disposition"])
        form.append('file', buffer, fileName.parameters.filename)
        const optionsForUpload = {
            method: 'POST',
            url: process.env.SIGNZY_FILE_UPLOAD,
            data: form
        };
        await axios.request(optionsForUpload).then(function (responseFromAxios) {
            uploadResponse.push(responseFromAxios?.data?.file?.directURL)
            // create identity
            let identityResponse;
            const optionsForIdentity = {
                method: 'POST',
                url: `${process.env.SIGNZY_BASEURL}patrons/${process.env.SIGNZY_PATRONID}/identities`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: process.env.SIGNZY_AUTHTOKEN
                },
                data: JSON.stringify({
                    type: req.body.panType,
                    email: req.body.email,
                    callbackUrl: `${process.env.NETLIFY_URL}#/profile/641db74968ab14c9b89523cf`,
                    images: uploadResponse
                })
            };
            axios.request(optionsForIdentity).then(function (responseFromAxios) {
                identityResponse = responseFromAxios?.data
                // autoRecognition
                let autoRecognition;
                const optionsForAutoRecognition = {
                    method: 'POST',
                    url: `${process.env.SIGNZY_BASEURL}snoops`,
                    headers: { "Content-Type": "application/json" },
                    data: JSON.stringify({
                        service: "Identity",
                        itemId: `${identityResponse.id}`,
                        task: "autoRecognition",
                        accessToken: `${identityResponse.accessToken}`,
                        "essentials": {}
                    })
                };
                axios.request(optionsForAutoRecognition).then(async function (responseFromAxios) {
                    autoRecognition = responseFromAxios?.data
                    // varify
                    let optionsForVerify = {
                        method: 'POST',
                        url: `${process.env.SIGNZY_BASEURL}snoops`,
                        data: {
                            service: 'Identity',
                            itemId: `${autoRecognition.itemId}`,
                            accessToken: `${identityResponse.accessToken}`,
                            task: 'verification',
                            essentials: { number: `${user.PAN.panNumber}`, name: `${user.adminName}` }
                        }
                    };
                    axios.request(optionsForVerify).then(async function (responseFromAxios) {
                        let data = responseFromAxios?.data
                        if (data.response.result.verified == true) {
                            user.PAN.status = "Verified"
                            await userModel.findOneAndUpdate({ email: req.body.email }, user, { new: true })
                        } else {
                            user.PAN.status = "Rejected"
                            await userModel.findOneAndUpdate({ email: req.body.email }, user, { new: true })
                        }
                        let apiResponse = response.generate(constants.SUCCESS, messages.PAN.SUCCESS, constants.HTTP_SUCCESS, data.response.result)
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

/*
Controller function to verify aadhar document kyc.
@param {object} req - The HTTP request object
@param {object} res - The HTTP response object
@returns {Promise<void>}
*/
const aadharVerify = async function (req, res) {
    try {
        // upload file
        let uploadResponse = [];
        let user = await userModel.findOne({ email: req.body.email })
        const form = new formData()
        const downloadDocument = await axios.get(user.PAN.file, { responseType: 'arraybuffer' })
        const buffer = Buffer.from(downloadDocument.data, "utf-8")
        let fileName = contentDisposition.parse(downloadDocument.headers["content-disposition"])
        form.append('file', buffer, fileName.parameters.filename)
        const optionsForUpload = {
            method: 'POST',
            url: process.env.SIGNZY_FILE_UPLOAD,
            data: form
        };
        axios.request(optionsForUpload).then(function (responseFromUpload) {
            uploadResponse.push(responseFromUpload?.data?.file?.directURL)
            // create identity
            let identityResponse;
            const optionsForIdentity = {
                method: 'POST',
                url: `${process.env.SIGNZY_BASEURL}patrons/${process.env.SIGNZY_PATRONID}/identities`,
                headers: { "Content-Type": "application/json", Authorization: process.env.SIGNZY_AUTHTOKEN },
                data: {
                    type: "aadhaar",
                    email: req.body.email,
                    callbackUrl: `${process.env.NETLIFY_URL}#/profile/641db74968ab14c9b89523cf`,
                    images: uploadResponse
                }
            };
            axios.request(optionsForIdentity).then(function (responseIdentity) {
                identityResponse = responseIdentity?.data
                // autoRecognition
                const optionsForAutoRecognition = {
                    method: 'POST',
                    url: `${process.env.SIGNZY_BASEURL}snoops`,
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
                    let autoRecognition = responseRecognition?.data
                    // varify
                    let optionsForVarify = {
                        method: 'POST',
                        url: `${process.env.SIGNZY_BASEURL}snoops`,
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
                        let data = responseFromverify?.data
                        if (data.verified == true) {
                            user.aadhar.status = "Verified";
                            await userModel.findOneAndUpdate({ email: req.body.email }, user, { new: true })
                        } else {
                            user.aadhar.status = "Rejected";
                            await userModel.findOneAndUpdate({ email: req.body.email }, user, { new: true })
                        }
                        let apiResponse = response.generate(constants.SUCCESS, messages.AADHAR.SUCCESS, constants.HTTP_SUCCESS, data.response.result)
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

/*
Controller function to get all bank name list.
@param {object} req - The HTTP request object
@param {object} res - The HTTP response object
@returns {Promise<void>}
*/
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

/*
Controller function to verify bank statement document.
@param {object} req - The HTTP request object
@param {object} res - The HTTP response object
@returns {Promise<void>}
*/
let bankVerify = async function (req, res) {
    try {
        let uploadResponse;
        let user = await userModel.findOne({ email: req.body.email })
        const form = new formData()
        const downloadDocument = await axios.get(user.companyDetails.bankDetails.bankStatement.file, { responseType: 'arraybuffer' })
        const buffer = Buffer.from(downloadDocument.data, "utf-8")
        let fileName = contentDisposition.parse(downloadDocument.headers["content-disposition"])
        form.append('file', buffer, fileName.parameters.filename)
        const optionsForUpload = {
            method: 'POST',
            url: process.env.SIGNZY_FILE_UPLOAD,
            data: form
        };
        axios.request(optionsForUpload).then(function (responseFromAxios) {
            uploadResponse = responseFromAxios?.data?.file?.directURL
            var optionsConvert = {
                method: 'POST',
                url: `${process.env.SIGNZY_BASEURL}patrons/${process.env.SIGNZY_PATRONID}/converters`,
                headers: {
                    Authorization: process.env.SIGNZY_AUTHTOKEN
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
                let pdfUrl = responseFromAxios?.data?.result?.result?.convertedFile
                let optionsForBankStatement = {
                    method: 'POST',
                    url: `${process.env.SIGNZY_BASEURL}patrons/${process.env.SIGNZY_PATRONID}/bankstatements`,
                    headers: {
                        Authorization: process.env.SIGNZY_AUTHTOKEN
                    },
                    data: {
                        essentials: { url: pdfUrl, bankName: user.companyDetails.bankDetails.bankName, accountType: user.companyDetails.bankDetails.accountType }
                    }
                };
                axios.request(optionsForBankStatement).then(function (responseFromAxios) {
                    let responseData = responseFromAxios?.data
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

/*
Controller function to eSignature for the document.
@param {object} req - The HTTP request object
@param {object} res - The HTTP response object
@returns {Promise<void>}
*/
const eSignature = async function (req, res) {
    try {
        let assetId = req.params.assetId;
        let asset = await assetModel.findById(assetId)
        let user = await userModel.findById(asset.userId)
        let optionForLogin = {
            method: 'POST',
            url: `${process.env.SIGNZY_ESIGN_BASEURL}customers/login`,
            data: { username: process.env.SIGNZY_USERNAME, password: process.env.SIGNZY_PASSWORD }
        }
        axios.request(optionForLogin).then(async function (responseFromLoginApi) {
            let userId = responseFromLoginApi?.data?.userId
            let accessToken = responseFromLoginApi.data.id
            // upload file
            const form = new formData()
            let file = Buffer.from(req.body.data)
            form.append("file", file, { filename: "contract.pdf" })
            const optionsForUpload = {
                method: 'POST',
                url: process.env.SIGNZY_FILE_UPLOAD,
                data: form
            };
            axios.request(optionsForUpload).then(async function (responseFromUploadAPi) {
                let uploadResponse = responseFromUploadAPi?.data?.file?.directURL;
                let optionForurl = {
                    method: 'POST',
                    url: `${process.env.SIGNZY_ESIGN_BASEURL}customers/${userId}/aadhaaresigns`,
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

/*
Controller function to eStamping of the document.
@param {object} req - The HTTP request object
@param {object} res - The HTTP response object
@returns {Promise<void>}
*/
const eStamping = async function (req, res) {
    try {
        // upload file
        const form = new formData()
        let file = Buffer.from(req.body.data)
        form.append("file", file, { filename: "contract.pdf" })
        const optionsForUpload = {
            method: 'POST',
            url: process.env.SIGNZY_FILE_UPLOAD,
            data: form
        };
        await axios.request(optionsForUpload).then(async function (responseFromUploadAPi) {
            let uploadResponse = responseFromUploadAPi?.data?.file?.directURL;
            let findAsset = await assetModel.findById(req.params.assetId)
            let token = jwtToken(findAsset.userId)
            let optionsForEstamping = {
                method: 'POST',
                url: `${process.env.SIGNZY_BASEURL}patrons/${process.env.SIGNZY_PATRONID}/estamping`,
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
                        callbackUrl: `${process.env.RENDER_URL}api/document/callbackUrl?token=${token}`
                    }
                }
            }
            axios.request(optionsForEstamping).then(async (responseFromEsatmpingApi) => {
                await assetModel.findByIdAndUpdate(req.params.assetId, { msmeStatus: "Added to Inventory", adminStatus: "Added to Inventory", estampingTransactionId: responseFromEsatmpingApi.transactionId }, { new: true })
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

/*
Controller function to create token.
@param {object} req - The HTTP request object
@param {object} res - The HTTP response object
@returns {Promise<void>}
*/
function jwtToken(userId) {
    let token = jwt.sign(
        {
            userId: userId,
            expiresIn: "15d",
        },
        process.env.JWT_SECRET
    );
    return token
}
/*
Controller function to store result came from estamping api.
@param {object} req - The HTTP request object
@param {object} res - The HTTP response object
@returns {Promise<void>}
*/
let callbackUrl = async function (data) {
    try {
        let result;
        const authHeader = req.params.token;

        if (!authHeader) return next(new ErrorResponse('Not authorized', 401));

        const token = authHeader.split(' ')[1];

        if (!token) return next(new ErrorResponse('Not authorized', 401));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) return next(new ErrorResponse('Invalid token', 401));
        let findUser = await userModel.findById(decoded.userId)
        if (!findUser) {
            return next(new ErrorResponse('invalid token', 401));
        }
        if (data.result) {
            result = data.result
        } else if (data.error) {
            result = data.error
        }
        await assetModel.findOneAndUpdate({ estampingTransactionId: response.transactionId }, { estamping: result }, { new: true, upsert: true })
    } catch (err) {
        let apiResponse = response.generate(constants.ERROR, "Server Error", constants.HTTP_SERVER_ERROR, err)
        res.status(500).send(apiResponse)
    }
}
module.exports = { panVerify, aadharVerify, bankVerify, allBankList, eSignature, eStamping, callbackUrl }