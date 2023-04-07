const axios = require('axios');
const assetModel = require("../model/asset")
const Downloader = require("nodejs-file-downloader");
const fs = require("fs").promises
const fs1 = require("fs")
const { constants, messages } = require("../constants.js");
const response = require('../lib/responseLib');
const userModel = require("../model/user")
const CryptoJS = require('crypto-js');
const FormData = require('form-data');
var html_to_pdf = require('html-pdf-node');

/*
Controller function to create newrl wallet.
@param {object} req - The HTTP request object
@param {object} res - The HTTP response object
@returns {Promise<void>}
*/
const pinataUpload = async function (req, res) {
    try {
        // Extract assetId from request body
        let assetId = req.body.assetId;
        let transactionId;;

        // Initialize an array to store the new URLs after uploading to IPFS
        let arrayForNewrl = [];
        let findAsset = await assetModel.findById(assetId).lean();

        // Iterate through each key in the asset object
        for (let key in findAsset) {
            if (findAsset[key].url) {
                let url = findAsset[key].url
                const downloader = new Downloader({
                    url: url,
                    directory: "./downloads",
                });
                const { filePath, downloadStatus } = await downloader.download()
                    .catch(e => {
                        return { filePath: undefined, downloadStatus: undefined };
                    });

                // Read the downloaded file and encrypt it with a secret key
                let user = await userModel.findOne({ _id: findAsset.userId })
                let secretKey = user.uniqueId + process.env.IPFSHASHsECRETKEY
                const pdfBuffer = await fs.readFile(filePath)
                const byteArray = pdfBuffer.toJSON();
                const jsonString = JSON.stringify({ filename: 'contract.pdf', data: byteArray['data'] });
                const ciphertext = CryptoJS.AES.encrypt(jsonString, secretKey).toString();

                // Write the encrypted file to disk and create a FormData object with the file
                // await fs.writeFile("document.txt", ciphertext)
                // const formData = new FormData();
                // const file = fs1.createReadStream('./document.txt');
                // formData.append('file', file)

                // const metadata = JSON.stringify({
                //     name: "hash file"
                // });
                // formData.append('pinataMetadata', metadata);

                // const options = JSON.stringify({
                //     cidVersion: 0,
                // })
                // formData.append('pinataOptions', options);
                // const resIpfs = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                //     maxBodyLength: "Infinity",
                //     headers: {
                //         'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                //         Authorization: process.env.JWT
                //     }
                // });
                await fs.unlink('./document.txt')
                await fs.unlink(filePath)
                let ipfsHash = resIpfs.data.IpfsHash
                findAsset[key].ipfsHash = ipfsHash
                let obj = {
                    name: key,
                    file: ciphertext
                }
                arrayForNewrl.push(obj)
            }
        }

        // newrl api
        const NODE_URL = process.env.NEWRL_BASEURL;
        const WALLET = {
            public: '51017a461ecccdc082a49c3f6e17bb9a6259990f6c4d1c1dbb4e067878ddfa71cb4afbe6134bad588395edde20b92c6dd5abab4108d7e6aeb42a06229205cabb',
            private: '92a365e63db963a76c0aa1389aee1ae4d25a4539311595820b295d3a77e07618',
            address: '0x1342e0ae1664734cbbe522030c7399d6003a07a8',
        };


        const token_code = req.body.token_code;
        const amount = req.body.amount;
        const first_owner = req.body.first_owner;
        if (first_owner === '') {
            first_owner = WALLET.address;
        }
        const add_wallet_request = {
            token_name: token_code,
            token_code: token_code,
            token_type: '1',
            first_owner: first_owner,
            custodian: WALLET.address,
            legal_doc: '686f72957d4da564e405923d5ce8311b6567cedca434d252888cb566a5b4c401',
            amount_created: amount,
            tokendecimal: 2,
            disallowed_regions: [],
            is_smart_contract_token: false,
            token_attributes: {
                assetId: assetId,
                documents: arrayForNewrl,
            },
        };
        await axios.post(NODE_URL + '/add-token', add_wallet_request)
            .then((response) => {
                let unsigned_transaction = response.data;
                transactionId = unsigned_transaction.transaction.trans_code
                unsigned_transaction.transaction.fee = 1000000; // 1NWRL is the minimum fee. 1000000 = 1 NWRL as decimals is 0

                return axios.post(NODE_URL + '/sign-transaction', {
                    wallet_data: WALLET,
                    transaction_data: unsigned_transaction,
                });
            })
            .then((response) => {
                let signed_transaction = response.data;
                return axios.post(NODE_URL + '/submit-transaction', signed_transaction);
            })
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('Failed to validate transaction');
                }
            })
            .catch((err) => {
                let apiResponse = response.generate(constants.ERROR, "axios error", constants.HTTP_NOT_FOUND, err)
                res.status(400).send(apiResponse)
            });
        findAsset.transactionId = transactionId
        let updateAsset = await assetModel.findOneAndUpdate({ _id: assetId }, findAsset, { new: true })
        let findUser = await userModel.findOne({ _id: findAsset.userId })
        let aadhar = findUser.aadhar.aadharNumber
        let pan = findUser.PAN.panNumber
        let name = findUser.adminName
        

        const html = fs1.readFileSync('./trust_deed.html', 'utf8');
        const companyDetails = {
            name: name,
            aadhar: aadhar,
            pan: pan,
            address: "INDIA",
            date: "11/11/2022",
            data: "table",
            transactionId:transactionId
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
        html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
            let arrayBuffer = pdfBuffer.toJSON().data
            let apiResponse = response.generate(constants.SUCCESS, "pdf generate successfully ", constants.HTTP_CREATED, arrayBuffer);
            res.send(apiResponse)

        });

        // let apiResponse = response.generate(constants.SUCCESS, messages.PINATA.SUCCESS, constants.HTTP_CREATED, updateAsset);
        // res.send(apiResponse)

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


const blockChain = async function (req, res) {
    try {
        const NODE_URL = 'https://lakeshore-testnetgw.newrl.net';
        const WALLET = {
            public: '51017a461ecccdc082a49c3f6e17bb9a6259990f6c4d1c1dbb4e067878ddfa71cb4afbe6134bad588395edde20b92c6dd5abab4108d7e6aeb42a06229205cabb',
            private: '92a365e63db963a76c0aa1389aee1ae4d25a4539311595820b295d3a77e07618',
            address: '0x1342e0ae1664734cbbe522030c7399d6003a07a8',
        };

        const token_code = prompt('Enter token code: ');
        const amount = prompt('Issue amount: ');
        let first_owner = prompt('First owner[leave blank for custodian]: ');

        if (first_owner === '') {
            first_owner = WALLET.address;
        }

        const add_wallet_request = {
            token_name: token_code,
            token_code: token_code,
            token_type: '1',
            first_owner: first_owner,
            custodian: WALLET.address,
            legal_doc: '686f72957d4da564e405923d5ce8311b6567cedca434d252888cb566a5b4c401',
            amount_created: amount,
            tokendecimal: 2,
            disallowed_regions: [],
            is_smart_contract_token: false,
            token_attributes: {
                some_attib_used_by_your_app: 34,
                attrib2: 'test',
                area_of_farm: 34343,
            },
        };

        axios.post(NODE_URL + '/add-token', add_wallet_request)
            .then((response) => {
                let unsigned_transaction = response.data;
                unsigned_transaction.transaction.fee = 1000000; // 1NWRL is the minimum fee. 1000000 = 1 NWRL as decimals is 0

                return axios.post(NODE_URL + '/sign-transaction', {
                    wallet_data: WALLET,
                    transaction_data: unsigned_transaction,
                });
            })
            .then((response) => {
                let signed_transaction = response.data;

                return axios.post(NODE_URL + '/validate-transaction', signed_transaction);
            })
            .then((response) => {
                if (response.status !== 200) {
                    throw new Error('Failed to validate transaction');
                }
            })
            .catch((error) => {
                console.error(error);
            });

    } catch (err) {

    }
}

module.exports = { blockChain, pinataUpload }