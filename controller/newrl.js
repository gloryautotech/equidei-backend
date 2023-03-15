const axios = require('axios');
const assetModel= require("../model/asset")


const blockChain = async function (req, res) {
    try {
        const NODE_URL = 'http://archive1-testnet1.newrl.net:8421';
        const CUSTODIAN_WALLET = {
            public: 'fa6b979ab5aece3c8e49f12c80b6b731310a83f63da6aa7664513d80bb111b407b2d15710c9ceb4c82bd99f8f9eea5033c0b9793490fe239aa6ea393cd808f97',
            private: '82050029d18cfc34d84337f24fda1d6f48d0b6b93ac5589ba84bca81c61f4a1d',
            address: '0x98d93b8e90a7d180d2818b415ab6fb898b16efb1'
        };
let publicKey=CUSTODIAN_WALLET.public
        // async function addWallet(publicKey) {
            const addWalletRequest = {
                "custodian_address": CUSTODIAN_WALLET['address'],
                "ownertype": "1",
                "jurisdiction": "910",
                "kyc_docs": [
                    {
                        "type": 1,
                        "hash": "QmRhcF1PQgRUAbY5a1bnQXqsM1b2SwnapGvtxob5o8ix5C"
                    }
                ],
                "specific_data": {},
                "public_key": publicKey
            };

            const addWalletResponse = await axios.post(NODE_URL + '/add-wallet', addWalletRequest);
            let unsignedTransaction = addWalletResponse.data;
            unsignedTransaction['transaction']['fee'] = 1000000;

            const signTransactionResponse = await axios.post(NODE_URL + '/sign-transaction', {
                "wallet_data": CUSTODIAN_WALLET,
                "transaction_data": unsignedTransaction
            });
            const signedTransaction = signTransactionResponse.data;

            console.log('signed_transaction', signedTransaction);
            console.log('Sending wallet add transaction to chain');
            const validateTransactionResponse = await axios.post(NODE_URL + '/validate-transaction', signedTransaction);
            console.log('Got response from chain\n', validateTransactionResponse.data);
            // assert(validateTransactionResponse.status == 200);
        // }





        // async function generateWalletAddress() {
        //     const generateWalletAddressResponse = await axios.get(NODE_URL + '/generate-wallet-address');
        //     const wallet = generateWalletAddressResponse.data;
        //     console.log('New wallet\n', wallet, '\n');
        //     return wallet['public'];
        // }

        // async function main() {
        //     // let publicKey = prompt('Enter public key[leave blank to create new key pair]: ');


        //     // publicKey = await generateWalletAddress();
        //     // console.log((publicKey));


        //     await addWallet(CUSTODIAN_WALLET.public);
        // }

        // main();
    } catch (err) {

    }
}

module.exports = { blockChain }