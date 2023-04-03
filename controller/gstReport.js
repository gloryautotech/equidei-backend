const axios = require("axios");
const { constants, messages } = require("../constants.js");
const response = require('../lib/responseLib');
const Downloader = require("nodejs-file-downloader");

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
                data: {
                    gstin: [`${gstNumber}`],
                    username: [`${userName}`],
                    password: [`${password}`],
                    from: '022022',
                    to: '022019',
                    linkFlag: ["1"],
                    tokenValue: [`${tokenValue}`]
                }
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

module.exports = { gstReportFetch }