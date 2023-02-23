const axios = require('axios');
const userModel = require('../model/user')
const { constants, messages } = require("../constants.js");
const response = require('../lib/responseLib');
const jwt = require("jsonwebtoken");
const transactionHistroy = require('../model/transaction.js');
const regex = new RegExp(
  /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
);

let paymentTokenCreate = async function (req, res) {
  try {

    let userId = req.body.userId
    let isTrue = regex.test(userId);
    let findUser
    let email;
    let contactNumber;
    if (isTrue) {
      email = userId
      findUser = await userModel.findOne({ email: userId })
    } else {
      contactNumber = userId
      findUser = await userModel.findOne({ mobile: userId })
    }
    if (findUser.isMobile == false) {
      let apiResponse = response.generate(constants.ERROR, messages.payment.EMAIL, constants.HTTP_NOT_FOUND,);
      res.send(apiResponse)
    } else if (findUser.isEmail == false) {
      let apiResponse = response.generate(constants.ERROR, messages.payment.MOBILE, constants.HTTP_NOT_FOUND,);
      res.send(apiResponse)
    } else if (findUser.isMobile == true && findUser.isEmail == true) {
      if (isTrue) {
        contactNumber = findUser.mobile
      } else {
        email = findUser.email
      }
      let b = new Date().getTime();
      let a = `${contactNumber}_${b}`
      let obj = {
        amount: process.env.ASSET_AMOUNT,
        contact_number: `${contactNumber}`,
        email_id: `${email}`,
        currency: `INR`,
        mtx: a
      }
      console.log(obj)

      const options = {
        method: 'POST',
        url: 'https://sandbox-icp-api.bankopen.co/api/payment_token',
        headers: {
          Authorization: `Bearer ${process.env.OPENMONEY_ACCESS_KEY}:${process.env.OPENMONEY_SECRET_KEY}`
        },
        data: obj
      };

      axios
        .request(options)
        .then(async function (responseFromAxios) {
          let data = responseFromAxios.data
          data.accessKey = process.env.OPENMONEY_ACCESS_KEY
          let objectToAddTransaction = {
            amount: data.amount,
            currency: data.currency,
            mtx: data.mtx,
            status: data.status,
            userId: findUser._id
          }
          await transactionHistroy.create(objectToAddTransaction)
          let apiResponse = response.generate(constants.SUCCESS, messages.payment.SUCCESS, constants.HTTP_CREATED, data);
          res.send(apiResponse)
        })
        .catch(function (err) {
          let apiResponse = response.generate(constants.ERROR, messages.payment.FAILURE, constants.HTTP_NOT_FOUND, err)
          res.send(apiResponse)
        });


    }
  } catch (err) {
    let apiResponse = response.generate(constants.ERROR, messages.payment.serverError, constants.HTTP_SERVER_ERROR, err)
    res.send(apiResponse)
  }

}

const getPaymentStatus = async function (req, res) {
  try {
    let { button, payment_id, payment_token_id, status } = req.body

    const options = {
      method: 'GET',
      url: `https://sandbox-icp-api.bankopen.co/api/payment_token/${payment_token_id}/payment`,
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.OPENMONEY_ACCESS_KEY}:${process.env.OPENMONEY_SECRET_KEY}`
      }
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response);
        res.send(response)
      })
      .catch(function (error) {
        console.error(error);
      });
  } catch (err) {

  }
}

module.exports = { paymentTokenCreate, getPaymentStatus }