const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs').promises
const fs1 = require('fs')
const CryptoJS = require('crypto-js');
const { constants, messages } = require("../constants.js");
const response = require('../lib/responseLib');
const userModel = require("../model/user")
const assetModel = require("../model/asset")
let { jsPDF } = require("jspdf")
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY );

const pdf = require('html-pdf');
var html_to_pdf = require('html-pdf-node');

/*
Controller function to pining file in pinata ipfs.
@param {object} req - The HTTP request object
@param {object} res - The HTTP response object
@returns {Promise<void>}
*/
const pinataPinning = async function (req, res) {
    try {
        let { email } = req.body
        let user = await userModel.findOne({ email: email })
        const formData = new FormData();
        let src = req.files[0]
        const pdfBuffer = await fs.readFile(src.path)
        const byteArray = pdfBuffer.toJSON();
        const jsonString = JSON.stringify({ filename: 'pramit.pdf', data: byteArray['data'] });
        const ciphertext = CryptoJS.AES.encrypt(jsonString, user.uniqueId).toString();
        await fs.writeFile("pramit.txt", ciphertext)

        const file = fs1.createReadStream('./pramit.txt');
        formData.append('file', file)

        const metadata = JSON.stringify({
            name: "hash file"
        });
        formData.append('pinataMetadata', metadata);

        const options = JSON.stringify({
            cidVersion: 0,
        })
        formData.append('pinataOptions', options);
        const resIpfs = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            maxBodyLength: "Infinity",
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                Authorization: process.env.PINATA_JWT
            }
        });
        await fs.unlink('./pramit.txt')

        let apiResponse = response.generate(constants.SUCCESS, messages.PINATA.SUCCESS, constants.HTTP_CREATED, resIpfs.data.IpfsHash);
        res.send(apiResponse)
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

/*
Controller function to download file from ipfs.
@param {object} req - The HTTP request object
@param {object} res - The HTTP response object
@returns {Promise<void>}
*/
const fetchIpfsFile = async function (req, res) {
    try {
        let cid = req.params.cid
        const optionsForUpload = {
            method: 'GET',
            url: `https://gateway.pinata.cloud/ipfs/${cid}`,
        };
        await axios.request(optionsForUpload).then(async function (responseFromAxios) {
            let { email } = req.body
            let user = await userModel.findOne({ email: email })
            let response = responseFromAxios.data
            const bytes = CryptoJS.AES.decrypt(response, user.uniqueId);
            const plaintext = bytes.toString(CryptoJS.enc.Utf8);
            const data = JSON.parse(plaintext);
            await fs.writeFile(data.filename, Buffer.from(data.data))

            res.download('./pramit.pdf', async function () {
                await fs.unlink('./pramit.pdf')
            })

        }).catch((err) => {
            let apiResponse = response.generate(constants.ERROR, messages.PINATA.FAILURE, constants.HTTP_NOT_FOUND, err)
            res.status(400).send(apiResponse)
        })
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
/*
Controller function to approve the document.
@param {object} req - The HTTP request object
@param {object} res - The HTTP response object
@returns {Promise<void>}
*/
const approve = async function (req, res) {
    try {
        const doc = new jsPDF();
        let asset = await assetModel.findOne({ _id: req.params.assetId })
              
        let findUser = await userModel.findOne({ _id: asset.userId })
        let aadhar = findUser.aadhar.aadharNumber
        let pan = findUser.PAN.panNumber
        let name = findUser.adminName
        const html = fs1.readFileSync('./trust_deed.html', 'utf8');
        const companyDetails = {
            name: name,
            aadhar: aadhar,
            pan: pan,
            array: array,
            address: "INDIA",
            date: "11/11/2022",
            data: "table"
        };
        function replaceAll(string, search, replace) {
            return string.split(search).join(replace);
        }
        const templateParser = (template, companyDetails) => {
            for (let key in companyDetails) {
                // template = template.replaceAll(`{${key}}`, companyDetails[key]);
                template = replaceAll(template, `{${key}}`, companyDetails[key])
            }
            return template;
        };
        let output = templateParser(html, companyDetails)
        const options = { format: 'A4' };
        let config = {
            format: 'A4',
            orientation: 'potrait',
            border: {
                top: "1in",
                right: "0.75in",
                bottom: "1in",
                left: "1in"
            },
            footer: {
                height: "10mm",
                contents: {
                    default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                }
            }
        }
        let file = { content: output };
        html_to_pdf.generatePdf(file, options).then(async (pdfBuffer) => {
            await assetModel.findOneAndUpdate({_id:req.params.assetId}, {msmeStatus:"Valuation Accepted",adminStatus:"Valuation Accepted"},{new:true})
            let arrayBuffer = pdfBuffer.toJSON().data
            let apiResponse = response.generate(constants.SUCCESS, "pdf generate successfully ", constants.HTTP_CREATED, arrayBuffer);
            res.send(apiResponse)
        });

    } catch (err) {
        let apiResponse = response.generate(
            constants.ERROR,
            messages.udhyam.serverError,
            constants.HTTP_SERVER_ERROR,
            err
        );
        console.log(err)
        res.status(500).send(apiResponse);
    }
}

module.exports = { pinataPinning, fetchIpfsFile, approve }
