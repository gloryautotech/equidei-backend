const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs').promises
const fs1 = require('fs')
const CryptoJS = require('crypto-js');
const JWT = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4OTM4NjY5Zi04NjI2LTRmMjQtOWI3OC1jY2U3ZWMyNDg1OGIiLCJlbWFpbCI6InByYW1pdEBwb2x5bm9taWFsLmFpIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImVkYTYxYmU5OGFlZmJmZmJmNzU3Iiwic2NvcGVkS2V5U2VjcmV0IjoiZDlhMzhkYjk5M2U2ZWQzOGM0YTE4NDA1MzI2YmI5NDdhOTA5MDQyNDQ3MjY4N2U5NDg3MWVjMjE0NTRlNTBjZCIsImlhdCI6MTY3NzQ5MDk0M30.sL7saKasIkSnt8YP8Ez-JMNbX1Ix_AH4zCB5hdXiUkk'
const { constants, messages } = require("../constants.js");
const response = require('../lib/responseLib');
const userModel = require("../controller/auth")

const pinataPinning = async function (req, res) {
    try {
        let { email } = req.body
        let user = await userModel.findOne({ email: email })
        const formData = new FormData();
        let src = req.files[0]
        const pdfBuffer = await fs.readFile(src.path)
        const byteArray = pdfBuffer.toJSON();
        const jsonString = JSON.stringify({ filename: 'pramit.pdf', data: byteArray['data'] });
        const ciphertext = CryptoJS.AES.encrypt(jsonString, user.userId).toString();
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
            const bytes = CryptoJS.AES.decrypt(response, user.userId);
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


module.exports = { pinataPinning, fetchIpfsFile }
