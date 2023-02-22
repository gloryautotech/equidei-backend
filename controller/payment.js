const axios = require('axios');
const { constants, messages } = require("../constants.js");
const response = require('../lib/responseLib');


let paymentTokenCreate = async function (req, res) {
  try {
    // let { amount, contact_number, email_id, currency, mtx } = req.body
    const options = {
      method: 'POST',
      url: 'https://sandbox-icp-api.bankopen.co/api/payment_token',
      headers: {
        Authorization: 'Bearer a59e44c0-b118-11ed-b46b-25c110f10234:d948d042718007136ac3199f32bffcd01e66841f'
      },
      data: req.body
    };

    axios
      .request(options)
      .then(function (responseFromAxios) {
        let apiResponse = response.generate(constants.SUCCESS, messages.payment.SUCCESS, constants.HTTP_CREATED, responseFromAxios.data);
        res.send(apiResponse)
      })
      .catch(function (error) {
        console.error(error);
      });
  } catch (err) {
    let apiResponse = response.generate(constants.ERROR, messages.payment.serverError, constants.HTTP_SERVER_ERROR)
    res.send(apiResponse)
  }

}

module.exports = { paymentTokenCreate }