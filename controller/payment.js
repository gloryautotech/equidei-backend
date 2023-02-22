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
        Authorization: `Bearer ${process.env.OPENMONEY_ACCESS_KEY}:${process.env.OPENMONEY_SECRET_KEY}`
      },
      data: req.body
    };

    axios
      .request(options)
      .then(function (responseFromAxios) {
        let data = responseFromAxios.data
        data.accessKey = process.env.OPENMONEY_ACCESS_KEY
        let apiResponse = response.generate(constants.SUCCESS, messages.payment.SUCCESS, constants.HTTP_CREATED, data);
        res.send(apiResponse)
      })
      .catch(function (error) {
        let apiResponse = response.generate(constants.ERROR, messages.payment.FAILURE, constants.HTTP_NOT_FOUND)
    res.send(apiResponse)
      });
  } catch (err) {
    let apiResponse = response.generate(constants.ERROR, messages.payment.serverError, constants.HTTP_SERVER_ERROR)
    res.send(apiResponse)
  }

}

module.exports = { paymentTokenCreate }