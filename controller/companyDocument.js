let axios = require("axios").default;
const { constants, messages } = require("../constants.js");
const response = require('../lib/responseLib');
const formData = require('form-data')
const fs = require('fs')

/*
Controller function to fetch the data from cin number for the system.
@param {object} req - The HTTP request object
@param {object} res - The HTTP response object
@returns {Promise<void>}
*/
const fetchDataWithCin = async function (req, res) {
    try {

        let { cin } = req.body
        if (cin == "U74999TG2021PTC152491") {
            let data = {
                "essentials": {
                    "cin": "U74999TG2021PTC152491"
                },
                "id": "63ea25136b43f85959dcb472",
                "patronId": "63d0baac7486ee4822af0414",
                "task": "fetchRealtime",
                "result": {
                    "companyData": {
                        "authorizedCapital": "2000000",
                        "cin": "U74999TG2021PTC152491",
                        "efilingStatus": "ACTIVE",
                        "dateOfIncorporation": "24/06/2021",
                        "legalName": "CENSOR BLACK PRIVATE LIMITED",
                        "companyName": "CENSOR BLACK PRIVATE LIMITED",
                        "paidUpCapital": "1080000",
                        "sumOfCharges": "",
                        "companyDescription": "CENSOR BLACK PRIVATE LIMITED (CBPL), AS PER ITS ANNUAL FILINGS, IS ENGAGED IN THE BUSINESS OF VALIDATING THE AUTHENTICITY AND VALUE OF ASSETS WITH MANUFACTURING COMPANIES TO ARRANGE SOFTWARE AUTOMATION AND FINANCIAL SERVICES. THE COMPANY WAS INCORPORATED IN 2021 AND HAS ITS REGISTERED OFFICE LOCATED IN TELANGANA.",
                        "registeredAddress": {
                            "addressLine1": "8-2-644/1/205 F.NO. 205, HILINE COMPLEX,",
                            "addressLine2": "ROAD NO. 12, BANJARA HILLS",
                            "city": "HYDERABAD",
                            "pincode": "500034",
                            "state": "TELANGANA"
                        },
                        "businessAddress": {
                            "addressLine1": "8-2-644/1/205, FLAT NO 205, HILINE COMPLEX,",
                            "addressLine2": "ROAD NO 12, BANJARA HILLS",
                            "city": "HYDERABAD",
                            "pincode": "500034",
                            "state": "TELANGANA"
                        },
                        "pan": "AAJCC5673K",
                        "classification": "PRIVATE LIMITED INDIAN NON-GOVERNMENT COMPANY",
                        "status": "UNLISTED",
                        "nextCin": "",
                        "lastAgmDate": "",
                        "lastFilingDate": "",
                        "email": "raghavg.917@gmail.com",
                        "authorizedSignatories": [
                            {
                                "pan": "CJGPB4640A",
                                "din": "09214042",
                                "name": "RAGHAV BANSAL",
                                "designation": "DIRECTOR",
                                "dateOfBirth": "10/03/1998",
                                "age": "25",
                                "dateOfAppointment": "24/06/2021",
                                "dateOfAppointmentForCurrentDesignation": "24/06/2021",
                                "dateOfCessation": "25/01/2022",
                                "dinStatus": "APPROVED"
                            },
                            {
                                "pan": "AFIPA9163P",
                                "din": "09214053",
                                "name": "PREETI GUPTA",
                                "designation": "DIRECTOR",
                                "dateOfBirth": "05/06/1976",
                                "age": "47",
                                "dateOfAppointment": "24/06/2021",
                                "dateOfAppointmentForCurrentDesignation": "24/06/2021",
                                "dateOfCessation": "",
                                "dinStatus": "APPROVED"
                            },
                            {
                                "pan": "BYNPG7897R",
                                "din": "09455806",
                                "name": "RAGHAV GUPTA",
                                "designation": "DIRECTOR",
                                "dateOfBirth": "17/06/1998",
                                "age": "25",
                                "dateOfAppointment": "05/01/2022",
                                "dateOfAppointmentForCurrentDesignation": "30/09/2022",
                                "dateOfCessation": "",
                                "dinStatus": "APPROVED"
                            }
                        ],
                        "charges": [],
                        "auditors": {
                            "year": "2022",
                            "auditorName": "SATINDER PAL SINGH",
                            "auditorFirmName": "S P S & CO",
                            "pan": "AALFS9640R",
                            "membershipNumber": "092662",
                            "firmRegistrationNumber": "014427N",
                            "address": "326 AZ MODEL TOWN EXTENSION LUDHIANA PB INDIA 141013"
                        },
                        "detailedFinancials": [
                            {
                                "year": "2022",
                                "nature": "STANDALONE",
                                "statedOn": "31/03/2022",
                                "filingStandard": "SCHEDULE III",
                                "bs": {
                                    "assets": {
                                        "producingProperties": "",
                                        "cashAndBankBalances": "9702",
                                        "tangibleAssetsCapitalWorkInProgress": "",
                                        "shortTermLoansAndAdvances": "",
                                        "currentInvestments": "",
                                        "foreignCurrMonetaryItemTransDiffAssetAccount": "",
                                        "tradeReceivables": "",
                                        "tangibleAssets": "",
                                        "otherNoncurrentAssets": "",
                                        "noncurrentInvestments": "",
                                        "intangibleAssets": "",
                                        "preproducingProperties": "",
                                        "givenAssetsTotal": "9702",
                                        "inventories": "",
                                        "otherCurrentAssets": "",
                                        "intangibleAssetsUnderDevelopment": "",
                                        "deferredTaxAssetsNet": "",
                                        "longTermLoansAndAdvances": ""
                                    },
                                    "liabilities": {
                                        "givenLiabilitiesTotal": "9702",
                                        "shareCapital": "100000",
                                        "moneyReceivedAgainstShareWarrants": "",
                                        "deferredTaxLiabilitiesNet": "",
                                        "minorityInterest": "",
                                        "shortTermProvisions": "251595",
                                        "longTermBorrowings": "280000",
                                        "deferredGovernmentGrants": "",
                                        "tradePayables": "",
                                        "reservesAndSurplus": "-621893",
                                        "otherLongTermLiabilities": "",
                                        "otherCurrentLiabilities": "",
                                        "foreignCurrMonetaryItemTransDiffLiabilityAccount": "",
                                        "longTermProvisions": "",
                                        "shortTermBorrowings": "",
                                        "shareApplicationMoneyPendingAllotment": ""
                                    },
                                    "subTotals": {
                                        "totalCurrentLiabilities": "251595",
                                        "totalCurrentAssets": "9702",
                                        "capitalWip": "",
                                        "totalEquity": "-521893",
                                        "totalDebt": "280000",
                                        "netFixedAssets": ""
                                    },
                                    "metadata": {
                                        "fileName": "470-U74999TG2021PTC152491-MCA-ANNUALRETURNSEFORM-7FA84F79BBF999E59319422C44770AB3V1.PDF",
                                        "fileURL": "https://persist.signzy.tech/api/files/497185971/download/22148d7a1f7244d1b90eaa545fe6244b65cfccb558ca45b79da777b08a031470.pdf"
                                    }
                                },
                                "pnl": {
                                    "lineItems": {
                                        "profitFromDiscontinuingOperationAfterTax": "",
                                        "interest": "10",
                                        "totalEmployeeBenefitExpense": "200000",
                                        "profitBeforeInterestAndTax": "-621900",
                                        "profitForPeriodFromContinuingOperations": "-621910",
                                        "operatingProfit": "-631600",
                                        "totalPurchasesOfStockInTrade": "",
                                        "netRevenue": "",
                                        "depreciation": "",
                                        "minorityInterestAndProfitFromAssociatesAndJointVentures": "",
                                        "profitBeforeTax": "-621910",
                                        "incomeTax": "",
                                        "profitAfterTax": "-621910",
                                        "totalCostOfMaterialsConsumed": "",
                                        "totalChangesInInventoriesOrFinishedGoods": "",
                                        "otherIncome": "9700",
                                        "exceptionalItemsBeforeTax": "",
                                        "profitBeforeTaxAndExceptionalItemsBeforeTax": "-621910",
                                        "totalOtherExpenses": "431600"
                                    },
                                    "subTotals": {
                                        "totalOperatingCost": "631600"
                                    },
                                    "revenueBreakup": {
                                        "saleOfGoodsManufacturedDomestic": "",
                                        "saleOfGoodsTradedDomestic": "",
                                        "saleOrSupplyOfServicesDomestic": "",
                                        "saleOfGoodsManufacturedExport": "",
                                        "saleOfGoodsTradedExport": "",
                                        "saleOrSupplyOfServicesExport": ""
                                    },
                                    "depreciationBreakup": {
                                        "depreciationAndamortisation": ""
                                    },
                                    "metadata": {
                                        "fileName": "470-U74999TG2021PTC152491-MCA-ANNUALRETURNSEFORM-7FA84F79BBF999E59319422C44770AB3V1.PDF",
                                        "fileURL": "https://persist.signzy.tech/api/files/497185971/download/22148d7a1f7244d1b90eaa545fe6244b65cfccb558ca45b79da777b08a031470.pdf"
                                    }
                                },
                                "auditorComments": {
                                    "reportHasAdverseRemarks": "",
                                    "disclosuresAuditorRepoaudort": "",
                                    "disclosuresDirectorReport": ""
                                }
                            }
                        ],
                        "financialParameters": {
                            "tradeReceivableExceedingSixMonths": "",
                            "nature": "STANDALONE",
                            "employeeBenefitExpense": "200000",
                            "expenditureFc": "",
                            "proposedDividend": "NO",
                            "grossFixedAssets": "",
                            "earningFc": "",
                            "year": "2022",
                            "transactionRelatedPartiesAs18": ""
                        },
                        "industrySegments": [
                            {
                                "industry": "CONSUMER SERVICES",
                                "segments": [
                                    "PROFESSIONAL SERVICES"
                                ]
                            }
                        ],
                        "principalBusinessActivities": [],
                        "shareholdings": [
                            {
                                "totalPercentageOfShares": "100",
                                "nriHeldPercentageOfShares": "",
                                "ventureCapitalHeldPercentageOfShares": "",
                                "totalNoOfShares": "10000",
                                "centralGovernmentHeldPercentageOfShares": "",
                                "year": "2022",
                                "othersHeldPercentageOfShares": "",
                                "bankHeldNoOfShares": "",
                                "mutualFundsHeldPercentageOfShares": "",
                                "stateGovernmentHeldPercentageOfShares": "",
                                "insuranceCompanyHeldPercentageOfShares": "",
                                "financialInstitutionsHeldNoOfShares": "",
                                "category": "EQUITY",
                                "shareholders": "PROMOTER",
                                "financialInstitutionsHeldPercentageOfShares": "",
                                "financialInstitutionsInvestorsHeldPercentageOfShares": "",
                                "foreignHeldOtherThanNriNoOfShares": "",
                                "bodyCorporateHeldPercentageOfShares": "",
                                "centralGovernmentHeldNoOfShares": "",
                                "foreignHeldOtherThanNriPercentageOfShares": "",
                                "financialInstitutionsInvestorsHeldNoOfShares": "",
                                "insuranceCompanyHeldNoOfShares": "",
                                "bankHeldPercentageOfShares": "",
                                "indianHeldNoOfShares": "10000",
                                "nriHeldNoOfShares": "",
                                "indianHeldPercentageOfShares": "100",
                                "othersHeldNoOfShares": "",
                                "ventureCapitalHeldNoOfShares": "",
                                "governmentCompanyHeldPercentageOfShares": "",
                                "mutualFundsHeldNoOfShares": "",
                                "stateGovernmentHeldNoOfShares": "",
                                "bodyCorporateHeldNoOfShares": "",
                                "governmentCompanyHeldNoShares": ""
                            },
                            {
                                "totalPercentageOfShares": "",
                                "nriHeldPercentageOfShares": "",
                                "ventureCapitalHeldPercentageOfShares": "",
                                "totalNoOfShares": "",
                                "centralGovernmentHeldPercentageOfShares": "",
                                "year": "2022",
                                "othersHeldPercentageOfShares": "",
                                "bankHeldNoOfShares": "",
                                "mutualFundsHeldPercentageOfShares": "",
                                "stateGovernmentHeldPercentageOfShares": "",
                                "insuranceCompanyHeldPercentageOfShares": "",
                                "financialInstitutionsHeldNoOfShares": "",
                                "category": "PREFERENCE",
                                "shareholders": "PROMOTER",
                                "financialInstitutionsHeldPercentageOfShares": "",
                                "financialInstitutionsInvestorsHeldPercentageOfShares": "",
                                "foreignHeldOtherThanNriNoOfShares": "",
                                "bodyCorporateHeldPercentageOfShares": "",
                                "centralGovernmentHeldNoOfShares": "",
                                "foreignHeldOtherThanNriPercentageOfShares": "",
                                "financialInstitutionsInvestorsHeldNoOfShares": "",
                                "insuranceCompanyHeldNoOfShares": "",
                                "bankHeldPercentageOfShares": "",
                                "indianHeldNoOfShares": "",
                                "nriHeldNoOfShares": "",
                                "indianHeldPercentageOfShares": "",
                                "othersHeldNoOfShares": "",
                                "ventureCapitalHeldNoOfShares": "",
                                "governmentCompanyHeldPercentageOfShares": "",
                                "mutualFundsHeldNoOfShares": "",
                                "stateGovernmentHeldNoOfShares": "",
                                "bodyCorporateHeldNoOfShares": "",
                                "governmentCompanyHeldNoShares": ""
                            },
                            {
                                "totalPercentageOfShares": "",
                                "nriHeldPercentageOfShares": "",
                                "ventureCapitalHeldPercentageOfShares": "",
                                "totalNoOfShares": "",
                                "centralGovernmentHeldPercentageOfShares": "",
                                "year": "2022",
                                "othersHeldPercentageOfShares": "",
                                "bankHeldNoOfShares": "",
                                "mutualFundsHeldPercentageOfShares": "",
                                "stateGovernmentHeldPercentageOfShares": "",
                                "insuranceCompanyHeldPercentageOfShares": "",
                                "financialInstitutionsHeldNoOfShares": "",
                                "category": "EQUITY",
                                "shareholders": "PUBLIC",
                                "financialInstitutionsHeldPercentageOfShares": "",
                                "financialInstitutionsInvestorsHeldPercentageOfShares": "",
                                "foreignHeldOtherThanNriNoOfShares": "",
                                "bodyCorporateHeldPercentageOfShares": "",
                                "centralGovernmentHeldNoOfShares": "",
                                "foreignHeldOtherThanNriPercentageOfShares": "",
                                "financialInstitutionsInvestorsHeldNoOfShares": "",
                                "insuranceCompanyHeldNoOfShares": "",
                                "bankHeldPercentageOfShares": "",
                                "indianHeldNoOfShares": "",
                                "nriHeldNoOfShares": "",
                                "indianHeldPercentageOfShares": "",
                                "othersHeldNoOfShares": "",
                                "ventureCapitalHeldNoOfShares": "",
                                "governmentCompanyHeldPercentageOfShares": "",
                                "mutualFundsHeldNoOfShares": "",
                                "stateGovernmentHeldNoOfShares": "",
                                "bodyCorporateHeldNoOfShares": "",
                                "governmentCompanyHeldNoShares": ""
                            },
                            {
                                "totalPercentageOfShares": "",
                                "nriHeldPercentageOfShares": "",
                                "ventureCapitalHeldPercentageOfShares": "",
                                "totalNoOfShares": "",
                                "centralGovernmentHeldPercentageOfShares": "",
                                "year": "2022",
                                "othersHeldPercentageOfShares": "",
                                "bankHeldNoOfShares": "",
                                "mutualFundsHeldPercentageOfShares": "",
                                "stateGovernmentHeldPercentageOfShares": "",
                                "insuranceCompanyHeldPercentageOfShares": "",
                                "financialInstitutionsHeldNoOfShares": "",
                                "category": "PREFERENCE",
                                "shareholders": "PUBLIC",
                                "financialInstitutionsHeldPercentageOfShares": "",
                                "financialInstitutionsInvestorsHeldPercentageOfShares": "",
                                "foreignHeldOtherThanNriNoOfShares": "",
                                "bodyCorporateHeldPercentageOfShares": "",
                                "centralGovernmentHeldNoOfShares": "",
                                "foreignHeldOtherThanNriPercentageOfShares": "",
                                "financialInstitutionsInvestorsHeldNoOfShares": "",
                                "insuranceCompanyHeldNoOfShares": "",
                                "bankHeldPercentageOfShares": "",
                                "indianHeldNoOfShares": "",
                                "nriHeldNoOfShares": "",
                                "indianHeldPercentageOfShares": "",
                                "othersHeldNoOfShares": "",
                                "ventureCapitalHeldNoOfShares": "",
                                "governmentCompanyHeldPercentageOfShares": "",
                                "mutualFundsHeldNoOfShares": "",
                                "stateGovernmentHeldNoOfShares": "",
                                "bodyCorporateHeldNoOfShares": "",
                                "governmentCompanyHeldNoShares": ""
                            }
                        ],
                        "shareholdingsSummary": [
                            {
                                "totalEquityShares": "10000",
                                "promoter": "2",
                                "year": "2022",
                                "totalPreferenceShares": "",
                                "total": "2",
                                "public": ""
                            }
                        ],
                        "directorShareholdings": [
                            {
                                "dateOfCessation": "25/01/2022",
                                "designation": "DIRECTOR",
                                "percentageHolding": "50",
                                "noOfShares": "5000",
                                "dinPan": "09214042",
                                "fullName": "RAGHAV BANSAL",
                                "year": "2022"
                            },
                            {
                                "dateOfCessation": "",
                                "designation": "DIRECTOR",
                                "percentageHolding": "50",
                                "noOfShares": "5000",
                                "dinPan": "09214053",
                                "fullName": "PREETI GUPTA",
                                "year": "2022"
                            },
                            {
                                "dateOfCessation": "",
                                "designation": "DIRECTOR",
                                "percentageHolding": "",
                                "noOfShares": "",
                                "dinPan": "09455806",
                                "fullName": "RAGHAV GUPTA",
                                "year": "2022"
                            }
                        ],
                        "bifrHistory": [],
                        "cdrHistory": [],
                        "defaulterList": [],
                        "legalHistory": [],
                        "creditRatings": [],
                        "holdingCompanies": [],
                        "subsidiaryCompanies": [],
                        "associateCompanies": [],
                        "jointVentures": [],
                        "chargeSequence": [],
                        "securitiesAllotment": [
                            {
                                "nominalAmountPerSecurity": "10",
                                "instrument": "EQUITY SHARES WITHOUT DIFFERENTIAL RIGHTS",
                                "totalAmountRaised": "490000",
                                "allotmentType": "CASH",
                                "premiumAmountPerSecurity": "",
                                "allotmentDate": "28/10/2022",
                                "numberOfSecuritiesAllotted": "49000"
                            },
                            {
                                "nominalAmountPerSecurity": "10",
                                "instrument": "EQUITY SHARES WITHOUT DIFFERENTIAL RIGHTS",
                                "totalAmountRaised": "490000",
                                "allotmentType": "CASH",
                                "premiumAmountPerSecurity": "",
                                "allotmentDate": "22/10/2022",
                                "numberOfSecuritiesAllotted": "49000"
                            }
                        ],
                        "lastUpdated": "13/02/2023"
                    }
                }
            }

            let apiResponse = response.generate(constants.SUCCESS, messages.cin.SUCCESS, constants.HTTP_SUCCESS, data,);
            res.status(200).send(apiResponse);

        } else {


            let options = {
                method: 'POST',
                url: `${process.env.SIGNZY_BASEURL}/patrons/${process.env.SIGNZY_PATRONID}/companyconsolidated`,
                headers: {
                    Authorization: process.env.SIGNZY_AUTHTOKEN
                },
                data: {
                    task: 'fetchRealtime',
                    essentials: { cin: `${cin}` }
                }
            };
            axios.request(options).then(function (responseFromAxios) {
                let result = responseFromAxios?.data?.result?.statusCode
                if (result == 404) {
                    let apiResponse = response.generate(constants.ERROR, messages.cin.notFund, constants.HTTP_NOT_FOUND, responseFromAxios.data.result);
                    res.status(404).send(apiResponse)
                } else {
                    let apiResponse = response.generate(constants.SUCCESS, messages.cin.SUCCESS, constants.HTTP_SUCCESS, responseFromAxios.data,);
                    res.status(200).send(apiResponse);
                }
            }).catch(function (err) {
                let apiResponse = response.generate(
                    constants.ERROR,
                    messages.cin.FAILURE,
                    constants.HTTP_SERVER_ERROR,
                    err
                );
                res.status(400).send(apiResponse);
            });
        }
    } catch (err) {
        let apiResponse = response.generate(
            constants.ERROR,
            messages.cin.serverError,
            constants.HTTP_SERVER_ERROR,
            err
        );
        res.status(500).send(apiResponse);
    }

}

/*
Controller function to verify gst number for the system.
@param {object} req - The HTTP request object
@param {object} res - The HTTP response object
@returns {Promise<void>}
*/
const gstVerify = async function (req, res) {
    try {
        let { gstNumber, companyName } = req.body
        let options = {
            method: 'POST',
            url: `https://sm-gst.scoreme.in/gst//external/gstinbasicinfo`,
            headers: {
                clientId: process.env.SCOREMECLIENTID,
                clientSecret: process.env.SCOREMECLIENTSECRET
            },
            data: {
                gstin: [`${gstNumber}`]
            }
        }
        axios.request(options).then(function (responseFromAxios) {
            let result = responseFromAxios?.data?.data?.tradeName
            let check = result.includes(companyName)
            if (check) {
                let apiResponse = response.generate(constants.SUCCESS, messages.GST.SUCCESS, constants.HTTP_SUCCESS, responseFromAxios.data);
                res.status(200).send(apiResponse)
            } else {
                let apiResponse = response.generate(constants.ERROR, messages.GST.NOTMATCH, constants.HTTP_NOT_FOUND, responseFromAxios.data,);
                res.status(400).send(apiResponse);
            }
        }).catch(function (err) {
            let apiResponse = response.generate(
                constants.ERROR,
                messages.GST.FAILURE,
                constants.HTTP_SERVER_ERROR,
                err
            );
            res.status(400).send(apiResponse);
        });
    } catch (err) {
        let apiResponse = response.generate(
            constants.ERROR,
            messages.GST.SERVERERROR,
            constants.HTTP_SERVER_ERROR,
            err
        );
        res.status(500).send(apiResponse);
    }
}

/*
Controller function to verify udhayam number for the system.
@param {object} req - The HTTP request object
@param {object} res - The HTTP response object
@returns {Promise<void>}
*/
let udyamDetails = async function (req, res) {
    try {
        let udyamNumber = req.body.udyamNumber
        let companyName = req.body.companyName
        let optionsForudyam = {
            method: 'POST',
            url: `${SIGNZY_BASEURL}/patrons/${process.env.SIGNZY_PATRONID}/udyamregistrations`,
            headers: {
                Authorization: process.env.SIGNZY_AUTHTOKEN
            },
            data: { essentials: { udyamNumber: `${udyamNumber}` } }
        };
        axios.request(optionsForudyam).then(function (responsefromUdyam) {
            let name = responsefromUdyam?.data?.result?.generalInfo?.nameOfEnterprise
            let check = name.includes(companyName)
            if (check) {
                let obj = { valid: true }
                let apiResponse = response.generate(constants.SUCCESS, messages.udhyam.SUCCESS, constants.HTTP_SUCCESS, obj);
                res.status(200).send(apiResponse);
            } else {
                let obj = { valid: false }
                let apiResponse = response.generate(constants.ERROR, messages.udhyam.notFetch, constants.HTTP_SUCCESS, obj);
                res.status(400).send(apiResponse);
            }
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


const gstReportFetch = function (req, res) {
    try {
        let { gstNumber, userName, password, email } = req.body
        let options = {
            method: 'POST',
            url: `https://sm-gst.scoreme.in/gst/external/pwd/sendemaillink`,
            headers: {
                clientId: process.env.SCOREMECLIENTID,
                clientSecret: process.env.SCOREMECLIENTSECRET
            },
            data: {
                gstin: [`${gstNumber}`],
                email: [`${email}`],
            }
        }
        axios.request(options).then(function (responseFromAxios) {
            let tokenValue = responseFromAxios.data.data.referenceId

            let optionsForRefernceId = {
                method: 'POST',
                url: `https://sm-gst.scoreme.in/gst/external/pwd/gstanalysisrequest`,
                headers: {
                    clientId: process.env.SCOREMECLIENTID,
                    clientSecret: process.env.SCOREMECLIENTSECRET
                },
                data: JSON.stringify({
                    gstin: [`${gstNumber}`],
                    username: [`${userName}`],
                    password: [`${password}`],
                    from: '022022',
                    to: '022019',
                    linkFlag: ["1"],
                    tokenValue: [`${tokenValue}`]
                })
            }
            axios.request(optionsForRefernceId).then(function (responseFromAxios) {

                let referenceId = responseFromAxios.data.data.referenceId
                let optionsForReport = {
                    method: 'POST',
                    url: `https://sm-gst.scoreme.in/gst/external/getgstreport/${referenceId}`,
                    headers: {
                        clientId: process.env.SCOREMECLIENTID,
                        clientSecret: process.env.SCOREMECLIENTSECRET
                    },
                }

                axios.request(optionsForReport).then(async function (responseFromAxios) {
                    let jsonUrl = responseFromAxios.data.data.jsonUrl
                    const downloader = new Downloader({
                        url: jsonUrl,
                        directory: "./downloads",
                    });

                    const { filePath, downloadStatus } = await downloader.download()
                        .catch(e => {
                            return { filePath: undefined, downloadStatus: undefined };
                        });

                    const reportData = require(filePath)
                    res.send(reportData)

                }).catch(function (err) {
                    console.log(err)
                })
            }).catch(function (err) {
                console.log(err)
            })
        }).catch((err) => {
            console.log(err)
        })
    } catch (err) {

    }
}

const gstReport = async function (req, res) {
    try {
        let { gstNumber, userName, password, fromDate, toDate } = req.body
        let options = {
            method: 'POST',
            url: `https://preproduction.signzy.tech/api/v2/patrons/${process.env.SIGNZY_PATRONID}/gstanalytics`,
            headers: {
                Accept: '*/*',
                Authorization: process.env.SIGNZY_AUTHTOKEN
            },
            data: {
                task: 'createRequest',
                type: 'Lite',
                essentials: {
                    authType: 'PASSWORD',
                    gstin: [gstNumber],
                    username: [userName],
                    password: [password],
                    fromDate: [fromDate],
                    toDate: [toDate]
                }
            }
        };

        axios.request(options).then(function (response) {
            console.log(response.data.requestId)
            let requestId = response.data.requestId

            let options = {
                method: 'POST',
                url: `https://preproduction.signzy.tech/api/v2/patrons/${process.env.SIGNZY_PATRONID}/gstanalytics`,
                headers: {
                    Accept: '*/*',
                    Authorization: process.env.SIGNZY_AUTHTOKEN
                },
                data: {
                    task: 'getGstAnalyticsReport',
                    type: 'Detailed',
                    essentials: { requestId: requestId, gstin: [gstNumber] }
                }
            };

            axios.request(options).then(function (response) {
                console.log(response.data);
            }).catch(function (error) {
                console.error(error);
            });

        }).catch(function (error) {
            console.error(error);
        });
    } catch (err) {
        console.log(err)
    }
}


const camReport = async function (req, res) {
    try {
        let { gstin, gstinUsername, gstinFromDate, gstinToDate, gstinPassword, cinLlpin, entityType, bankCode, bankAccountType, bankAccountNumber } = req.body
        let file = req.files[0]
        const form = new formData()
        form.append('file', fs.readFileSync(file.path), file.originalname)
        console.log(form)
        let options = {
            method: 'POST',
            url: `https://sm-ias.scoreme.in/ias/external/integratedanalysisreport`,
            headers: {
                clientId: process.env.SCOREMECLIENTID,
                clientSecret: process.env.SCOREMECLIENTSECRET
            },
            data:
            {
                bankStatementFiles: form,

                payload:
                {
                    gstin: gstin,
                    gstinUsername: gstinUsername,
                    gstinFromDate: gstinFromDate,
                    gstinToDate: gstinToDate,
                    gstinPassword: gstinPassword,
                    cinLlpin: cinLlpin,
                    entityType: entityType,
                    bankCode: bankCode,
                    bankAccountType: bankAccountType,
                    bankAccountNumber: bankAccountNumber
                }
            }
        };

        axios.request(options).then(function (response) {
            console.log(response)
            //     console.log(response.data.referenceId);
            //     let options = {
            //         method: 'GET',
            //         url: `https://sm-ias.scoreme.in/ias/external/getintegratedanalysisreport/${response.data.referenceId}`,
            //         headers: {
            //             clientId: process.env.SCOREMECLIENTID,
            //             clientSecret: process.env.SCOREMECLIENTSECRET
            //         },
            //     }
            //     axios.request(options).then(function (response) {
            //         console.log(response)
            //     })
        }).catch(function (error) {
            console.error(error);
        });

    } catch (err) {
        console.log(err)
    }
}

module.exports = { fetchDataWithCin, gstVerify, udyamDetails, gstReportFetch, gstReport, camReport }
