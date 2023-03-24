let axios = require("axios").default;
const { constants, messages } = require("../constants.js");
const response = require('../lib/responseLib');

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
                url: `https://preproduction.signzy.tech/api/v2/patrons/${process.env.PATRONID}/companyconsolidated`,
                headers: {
                    Authorization: process.env.AUTHTOKEN
                },
                data: {
                    task: 'fetchRealtime',
                    essentials: { cin: `${cin}` }
                }
            };
            axios.request(options).then(function (responseFromAxios) {
                let result = responseFromAxios.data.result.statusCode
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
module.exports = { fetchDataWithCin }
