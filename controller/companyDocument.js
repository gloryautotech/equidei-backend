let axios = require("axios").default;
const { constants, messages } = require("../constants.js");
const response = require('../lib/responseLib');
const formData = require('form-data')
const fs = require('fs')
const userModel = require("../model/user.js")
const contentDisposition = require("content-disposition")


/*
Controller function to fetch the data from cin number for the system.
@param {object} req - The HTTP request object
@param {object} res - The HTTP response object
@returns {Promise<void>}
*/
const fetchDataWithCin = async function (req, res) {
    try {
        let cin = req.body.cin
        let options = {
            method: 'POST',
            url: `${process.env.SIGNZY_BASEURL}/patrons/${process.env.SIGNZY_PATRONID}/organizations`,
            headers: {
                Authorization: process.env.SIGNZY_AUTHTOKEN
            },
            data: {
                identifier: cin,
                service: "roc",
                callbackUrl: `${process.env.NETLIFY_URL}#/profile/641db74968ab14c9b89523cf`
            }
        };
        axios.request(options).then(async function (responseFromAxios) {
            let optionForFetch = {
                method: 'POST',
                url: `${process.env.SIGNZY_BASEURL}/hunts`,
                data: {
                    target: "Organization",
                    itemId: responseFromAxios.data.id,
                    accessToken: responseFromAxios.data.accessToken,
                    task: "detailedSearchByCin",
                    essentials: {
                        cin: cin
                    }
                }
            }
            axios.request(optionForFetch).then(function (result) {
                let apiResponse = response.generate(constants.SUCCESS, messages.cin.SUCCESS, constants.HTTP_SUCCESS, result.data,);
                res.status(200).send(apiResponse);
            })
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

/*
Controller function to verify gst number for the system.
@param {object} req - The HTTP request object
@param {object} res - The HTTP response object
@returns {Promise<void>}
*/
const gstVerify = async function (req, res) {
    try {
        let { gstNumber, companyName } = req.body
        let options = {
            method: 'POST',
            url: `https://sm-gst.scoreme.in/gst//external/gstinbasicinfo`,
            headers: {
                clientId: process.env.SCOREMECLIENTID,
                clientSecret: process.env.SCOREMECLIENTSECRET
            },
            data: {
                gstin: [`${gstNumber}`]
            }
        }
        axios.request(options).then(function (responseFromAxios) {
            let result = responseFromAxios?.data?.data?.tradeName
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

/*
Controller function to verify udhayam number for the system.
@param {object} req - The HTTP request object
@param {object} res - The HTTP response object
@returns {Promise<void>}
*/
let udyamDetails = async function (req, res) {
    try {
        let udyamNumber = req.body.udyamNumber
        let companyName = req.body.companyName
        let optionsForudyam = {
            method: 'POST',
            url: `${SIGNZY_BASEURL}/patrons/${process.env.SIGNZY_PATRONID}/udyamregistrations`,
            headers: {
                Authorization: process.env.SIGNZY_AUTHTOKEN
            },
            data: { essentials: { udyamNumber: `${udyamNumber}` } }
        };
        axios.request(optionsForudyam).then(function (responsefromUdyam) {
            let name = responsefromUdyam?.data?.result?.generalInfo?.nameOfEnterprise
            let check = name.includes(companyName)
            if (check) {
                let obj = { valid: true }
                let apiResponse = response.generate(constants.SUCCESS, messages.udhyam.SUCCESS, constants.HTTP_SUCCESS, obj);
                res.status(200).send(apiResponse);
            } else {
                let obj = { valid: false }
                let apiResponse = response.generate(constants.ERROR, messages.udhyam.notFetch, constants.HTTP_SUCCESS, obj);
                res.status(400).send(apiResponse);
            }
        }).catch(function (err) {
            let apiResponse = response.generate(
                constants.ERROR,
                messages.udhyam.FAILURE,
                constants.HTTP_SERVER_ERROR,
                err
            );
            res.status(400).send(apiResponse);
        });
    } catch (err) {
        let apiResponse = response.generate(
            constants.ERROR,
            messages.udhyam.serverError,
            constants.HTTP_SERVER_ERROR,
            err
        );
        res.status(500).send(apiResponse);
    }
}


const gstReportFetch = function (req, res) {
    try {
        let { gstNumber, userName, password, email } = req.body
        let options = {
            method: 'POST',
            url: `https://sm-gst.scoreme.in/gst/external/pwd/sendemaillink`,
            headers: {
                clientId: process.env.SCOREMECLIENTID,
                clientSecret: process.env.SCOREMECLIENTSECRET
            },
            data: {
                gstin: [`${gstNumber}`],
                email: [`${email}`],
            }
        }
        axios.request(options).then(function (responseFromAxios) {
            let tokenValue = responseFromAxios.data.data.referenceId

            let optionsForRefernceId = {
                method: 'POST',
                url: `https://sm-gst.scoreme.in/gst/external/pwd/gstanalysisrequest`,
                headers: {
                    clientId: process.env.SCOREMECLIENTID,
                    clientSecret: process.env.SCOREMECLIENTSECRET
                },
                data: JSON.stringify({
                    gstin: [`${gstNumber}`],
                    username: [`${userName}`],
                    password: [`${password}`],
                    from: '022022',
                    to: '022019',
                    linkFlag: ["1"],
                    tokenValue: [`${tokenValue}`]
                })
            }
            axios.request(optionsForRefernceId).then(function (responseFromAxios) {

                let referenceId = responseFromAxios.data.data.referenceId
                let optionsForReport = {
                    method: 'POST',
                    url: `https://sm-gst.scoreme.in/gst/external/getgstreport/${referenceId}`,
                    headers: {
                        clientId: process.env.SCOREMECLIENTID,
                        clientSecret: process.env.SCOREMECLIENTSECRET
                    },
                }

                axios.request(optionsForReport).then(async function (responseFromAxios) {
                    let jsonUrl = responseFromAxios.data.data.jsonUrl
                    const downloader = new Downloader({
                        url: jsonUrl,
                        directory: "./downloads",
                    });

                    const { filePath, downloadStatus } = await downloader.download()
                        .catch(e => {
                            return { filePath: undefined, downloadStatus: undefined };
                        });

                    const reportData = require(filePath)
                    res.send(reportData)

                }).catch(function (err) {
                    console.log(err)
                })
            }).catch(function (err) {
                console.log(err)
            })
        }).catch((err) => {
            console.log(err)
        })
    } catch (err) {

    }
}

const gstReport = async function (req, res) {
    try {
        let { gstNumber, userName, password, fromDate, toDate } = req.body
        let options = {
            method: 'POST',
            url: `https://preproduction.signzy.tech/api/v2/patrons/${process.env.SIGNZY_PATRONID}/gstanalytics`,
            headers: {
                Accept: '*/*',
                Authorization: process.env.SIGNZY_AUTHTOKEN
            },
            data: {
                task: 'createRequest',
                type: 'Lite',
                essentials: {
                    authType: 'PASSWORD',
                    gstin: [gstNumber],
                    username: [userName],
                    password: [password],
                    fromDate: [fromDate],
                    toDate: [toDate]
                }
            }
        };

        axios.request(options).then(function (response) {
            console.log(response.data.requestId)
            let requestId = response.data.requestId

            let options = {
                method: 'POST',
                url: `https://preproduction.signzy.tech/api/v2/patrons/${process.env.SIGNZY_PATRONID}/gstanalytics`,
                headers: {
                    Accept: '*/*',
                    Authorization: process.env.SIGNZY_AUTHTOKEN
                },
                data: {
                    task: 'getGstAnalyticsReport',
                    type: 'Detailed',
                    essentials: { requestId: requestId, gstin: [gstNumber] }
                }
            };

            axios.request(options).then(function (response) {
                console.log(response.data);
            }).catch(function (error) {
                console.error(error);
            });

        }).catch(function (error) {
            console.error(error);
        });
    } catch (err) {
        console.log(err)
    }
}


const camReport = async function (req, res) {
    try {
        let { gstin, gstinUsername, gstinFromDate, gstinToDate, gstinPassword, cinLlpin, entityType, bankCode, bankAccountType, bankAccountNumber, relatedPartyKeywords } = req.body
        let file = req.files[0]
        // let findUser = await userModel.findById(req.body.userId)
        // let gstin = findUser.companyDetails.GST.gstNumber
        // let gstinUsername = req.body.gstinUsername
        // let cinLlpin = findUser.companyDetails.cin
        // let entityType="company"
        // let bankCode = findUser.bankDetails.IFSC
        // let bankAccountType = findUser.bankDetails.accountType
        // let bankAccountNumber=findUser.bankDetails.accountNumber
        const form = new formData()
        const downloadBankDocument = await axios.get(req.body.bankStatementFile, { responseType: 'arraybuffer' })
        const bufferBank = Buffer.from(downloadBankDocument.data, "utf-8")
        let bankFileName = contentDisposition.parse(downloadBankDocument.headers["content-disposition"])
        form.append('bankStatementFiles', bufferBank, bankFileName.parameters.filename)
        const downloadItrDocument = await axios.get(req.body.itrFile, { responseType: 'arraybuffer' })
        const bufferItr = Buffer.from(downloadItrDocument.data, "utf-8")
        let itrFileName = contentDisposition.parse(downloadItrDocument.headers["content-disposition"])
        form.append('itrFiles', bufferItr, itrFileName.parameters.filename)
        // form.append('bankStatementFiles', fs.readFileSync(file.path), file.originalname)
        // form.append('itrFiles', fs.readFileSync(file.path), file.originalname)
        form.append('payload', JSON.stringify({
            gstin: gstin,
            gstinFromDate: gstinFromDate,
            gstinToDate: gstinToDate,
            cinLlpin: cinLlpin,
            entityType: entityType,
            bankCode: bankCode,
            bankAccountType: bankAccountType,
            bankAccountNumber: bankAccountNumber,
            relatedPartyKeywords: JSON.parse(relatedPartyKeywords)
        }))
        console.log(form)
        let options = {
            method: 'POST',
            url: "https://sm-ias.scoreme.in/ias/external/integratedanalysisreport",
            headers: {
                clientId: process.env.SCOREMECLIENTID,
                clientSecret: process.env.SCOREMECLIENTSECRET,
                "Content-Type": "application/json;"
            },
            // data: form,
            data: {
                bankStatementFiles: "https://res.cloudinary.com/dbd8wog43/image/upload/v1681377839/ndeeihbvjhdjjexffqqx.pdf",
                itrFiles: "https://res.cloudinary.com/dbd8wog43/image/upload/v1681377839/ndeeihbvjhdjjexffqqx.pdf",
                payload:
                {
                    gstin: [gstin],
                    gstinUsername: [gstinUsername],
                    gstinFromDate: [gstinFromDate],
                    gstinToDate: [gstinToDate],
                    gstinPassword: [gstinPassword],
                    cinLlpin: [cinLlpin],
                    entityType: [entityType],
                    bankCode: [bankCode],
                    bankAccountType: [bankAccountType],
                    bankAccountNumber: [bankAccountNumber],
                    relatedPartyKeywords: [JSON.parse(relatedPartyKeywords)]
                }
            }
        };
        console.log(options)
        axios.request(options).then(function (response) {
            console.log(response.data)
            //     console.log(response.data.referenceId);
            //     let options = {
            //         method: 'GET',
            //         url: `https://sm-ias.scoreme.in/ias/external/getintegratedanalysisreport/${response.data.referenceId}`,
            //         headers: {
            //             clientId: process.env.SCOREMECLIENTID,
            //             clientSecret: process.env.SCOREMECLIENTSECRET
            //         },
            //     }
            //     axios.request(options).then(function (response) {
            //         console.log(response)
            //     })
        }).catch(function (error) {
            console.error(error);
        });

    } catch (err) {
        console.log(err)
    }
}

module.exports = { fetchDataWithCin, gstVerify, udyamDetails, gstReportFetch, gstReport, camReport }
