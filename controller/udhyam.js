let axios = require("axios").default;
const { constants, messages } = require("../constants.js");
const response = require('../lib/responseLib');

let udyamDetails = async function (req, res) {
  try {
    let udyamNumber = req.body.udyamNumber
    let optionsForudyam = {
      method: 'POST',
      url: `https://preproduction.signzy.tech/api/v2/patrons/${process.env.PATRONID}/udyamregistrations`,
      headers: {
        Authorization: process.env.AUTHTOKEN
      },
      data: { essentials: { udyamNumber: `${udyamNumber}` } }
    };
    axios.request(optionsForudyam).then(function (responsefromUdyam) {
      let apiResponse = response.generate(constants.SUCCESS, messages.udhyam.SUCCESS, constants.HTTP_SUCCESS, responsefromUdyam.data,);
      res.status(200).send(apiResponse);
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

module.exports = { udyamDetails }