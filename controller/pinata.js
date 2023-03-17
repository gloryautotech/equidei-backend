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
        let array = ["jhihuyftdsfrghhj", "yutrsedfghjk", "lkjhuiytrsedfxgcjh"]
        if (asset == "plantAndMachinary") {
            if (asset.purchaseBill.IpfsHash) {
                array.push(asset.purchaseBill.IpfsHash)
            } else if (asset.taxInvoice.IpfsHash) {
                array.push(asset.taxInvoice.IpfsHash)
            } else if (asset.insuranceDoc.IpfsHash) {
                array.push(asset.insuranceDoc.IpfsHash)
            } else if (asset.fixedAssetRegister.IpfsHash) {
                array.push(asset.fixedAssetRegister.IpfsHash)
            } else if (asset.oldValuationReport.IpfsHash) {
                array.push(asset.oldValuationReport.IpfsHash)
            } else if (asset.chargesPending.IpfsHash) {
                array.push(asset.chargesPending.IpfsHash)
            } else if (asset.assetInvoice.IpfsHash) {
                array.push(asset.assetInvoice.IpfsHash)
            } else if (asset.technicalSpecifications.IpfsHash) {
                array.push(asset.technicalSpecifications.IpfsHash)
            }
        } else {
            if (asset.propertyTax.IpfsHash) {
                array.push(asset.propertyTax.IpfsHash)
            } else if (asset.insuranceDoc.IpfsHash) {
                array.push(asset.insuranceDoc.IpfsHash)
            } else if (asset.powerOfAttorney.IpfsHash) {
                array.push(asset.powerOfAttorney.IpfsHash)
            } else if (asset.invoice.IpfsHash) {
                array.push(asset.invoice.IpfsHash)
            } else if (asset.clearanceCertificate.IpfsHash) {
                array.push(asset.clearanceCertificate.IpfsHash)
            } else if (asset.fixedAssetRegister.IpfsHash) {
                array.push(asset.fixedAssetRegister.IpfsHash)
            } else if (asset.oldValuationReport.IpfsHash) {
                array.push(asset.oldValuationReport.IpfsHash)
            } else if (asset.pendingCharges.IpfsHash) {
                array.push(asset.pendingCharges.IpfsHash)
            }
        }
        // let findUser = await userModel.findOne({ _id: asset.userId })
        // let aadhar = findUser.aadhar.aadharNumber
        // let pan = findUser.PAN.panNumber
        // let name = findUser.name
        let objForAddData = {
            name: "pramit",
            aadhar: 123434,
            pan: 1234567,
            array: array,
            trId: "pr123456789"
        }


        let padding = 10;
        const templateParser = (template, companyDetails) => {
            for (let key in companyDetails) {
                template = template.replace(`{${key}}`, companyDetails[key]);
            }
            return template;
        };

        for (let key in objTemplate) {
            if (key == "heading") {
                doc.setFontSize(20);
                // Calculate x and y positions to center the heading
                var pageWidth = doc.internal.pageSize.width;
                var textWidth = doc.getStringUnitWidth(objTemplate[key].value) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                var xPos = (pageWidth - textWidth) / 2;
                var yPos = 30; // Adjust as needed
                doc.text(objTemplate[key].value, xPos, yPos);
            } else if (key == "pararaph") {
                let contentWidth = doc.internal.pageSize.width - (padding * 2);
                let contentHeight = doc.internal.pageSize.height - (padding * 2);
                let contentX = padding;
                doc.setFontSize(15)
                let parsedTemplate = templateParser(objTemplate[key].value, objForAddData);
                doc.text(parsedTemplate, contentX, 50, { maxWidth: 190 }, { width: contentWidth, height: contentHeight });
            }
        }

        doc.save("test.pdf");

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

module.exports = { pinataPinning, fetchIpfsFile, approve }
