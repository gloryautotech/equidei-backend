const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs').promises
const fs1 = require('fs')
const CryptoJS = require('crypto-js');
const JWT = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4OTM4NjY5Zi04NjI2LTRmMjQtOWI3OC1jY2U3ZWMyNDg1OGIiLCJlbWFpbCI6InByYW1pdEBwb2x5bm9taWFsLmFpIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImVkYTYxYmU5OGFlZmJmZmJmNzU3Iiwic2NvcGVkS2V5U2VjcmV0IjoiZDlhMzhkYjk5M2U2ZWQzOGM0YTE4NDA1MzI2YmI5NDdhOTA5MDQyNDQ3MjY4N2U5NDg3MWVjMjE0NTRlNTBjZCIsImlhdCI6MTY3NzQ5MDk0M30.sL7saKasIkSnt8YP8Ez-JMNbX1Ix_AH4zCB5hdXiUkk'
const { constants, messages } = require("../constants.js");
const response = require('../lib/responseLib');
const userModel = require("../model/user")
const assetModel = require("../model/asset")
let objTemplate = require("../contract.json")
let { jsPDF } = require("jspdf")
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const pdf = require('html-pdf');

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
                Authorization: JWT
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

const approve = async function (req, res) {
    try {
        const doc = new jsPDF();
        let asset = await assetModel.findOne({ _id: req.params.assetId })
        let array = []
        if (asset == "plantAndMachinary") {
            if (asset.purchaseBill.ipfsHash) {
                array.push("\n" + asset.purchaseBill.pfsHash)
            }
            if (asset.taxInvoice.ipfsHash) {
                array.push("\n" + asset.taxInvoice.ipfsHash)
            }
            if (asset.insuranceDoc.ipfsHash) {
                array.push("\n" + asset.insuranceDoc.ipfsHash)
            }
            if (asset.fixedAssetRegister.ipfsHash) {
                array.push("\n" + asset.fixedAssetRegister.ipfsHash)
            }
            if (asset.oldValuationReport.ipfsHash) {
                array.push("\n" + asset.oldValuationReport.ipfsHash)
            }
            if (asset.chargesPending.ipfsHash) {
                array.push("\n" + asset.chargesPending.ipfsHash)
            }
            if (asset.assetInvoice.ipfsHash) {
                array.push("\n" + asset.assetInvoice.ipfsHash)
            }
            if (asset.technicalSpecifications.ipfsHash) {
                array.push("\n" + asset.technicalSpecifications.ipfsHash)
            }
        } else {
            if (asset.propertyTax.ipfsHash) {
                array.push("\n" + asset.propertyTax.ipfsHash)
            }
            if (asset.insuranceDoc.ipfsHash) {
                array.push("\n" + asset.insuranceDoc.ipfsHash)
            }
            if (asset.powerOfAttorney.ipfsHash) {
                array.push("\n" + asset.powerOfAttorney.ipfsHash)
            }
            if (asset.invoice.ipfsHash) {
                array.push("\n" + asset.invoice.ipfsHash)
            }
            if (asset.clearanceCertificate.ipfsHash) {
                array.push("\n" + asset.clearanceCertificate.ipfsHash)
            }
            if (asset.fixedAssetRegister.ipfsHash) {
                array.push("\n" + asset.fixedAssetRegister.ipfsHash)
            }
            if (asset.oldValuationReport.ipfsHash) {
                array.push("\n" + asset.oldValuationReport.ipfsHash)
            }
            if (asset.pendingCharges.ipfsHash) {
                array.push("\n" + asset.pendingCharges.ipfsHash)
            }
        }
        let findUser = await userModel.findOne({ _id: asset.userId })
        let aadhar = findUser.aadhar.aadharNumber
        let pan = findUser.PAN.panNumber
        let name = findUser.adminName
        let transactionId = asset.transactionId
       




        const html = fs1.readFileSync('./trust_deed.html', 'utf8');
        const companyDetails = {
            name: name,
            aadhar: aadhar,
            pan: pan,
            array: array,
            address: "INDIA",
            date: "10/11/2022",
            data: "table"
        };
        const templateParser = (template, companyDetails) => {
            for (let key in companyDetails) {
                template = template.replaceAll(`{${key}}`, companyDetails[key]);
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

       await pdf.create(output, config).toFile('output.pdf', function (err, res) {
            if (err) return console.log(err);
            // { filename: '/path/to/output.pdf' }
        });


        const pdfFile = fs1.readFileSync('./output.pdf');
        const msg = {
            to: "pramitchoudhury0205@gmail.com",
            from: "joincensorblack@gmail.com",
            subject: "E-Stamping document",
            html: '<p>Please see the attached PDF file.</p>',
            attachments: [
                {
                    content: pdfFile.toString('base64'),
                    filename: 'file.pdf',
                    type: 'application/pdf',
                    disposition: 'attachment',
                },
            ],
        };
        await sgMail
            .send(msg)
            .then(async () => {
                await fs.unlink('./output.pdf')
                res.send({ data: "Email sent" })
            }).catch((err) => {
                console.log(err)
            })


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
