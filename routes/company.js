const express = require("express");
const {
  insertDataCompany,
  inseertCompanybrinsh,
  InsertLinkevaluation,
  OpenOrCloseopreationStopfinance,
  insertRequestFinancialCustody,
} = require("../function/companyinsert/insertCompany");
const {biringDatabrinshCompany, bringDataCompany, BringDataFinancialCustody, bringDataCompanyRegistration} = require('../function/companyselect/bringCompany');
const { UpdateCompanybrinsh, UpdateDataCompany, Acceptandrejectrequests, Updatecovenantrequests, Deletecovenantrequests, UpdateApiCompany, AgreedRegistrationCompany, UpdatedataRegistration } = require("../function/companyinsert/UpdateCompany");
const { BringNameCompany } = require("../function/companyselect/userCompanyselect");
const { verifyJWT } = require("../middleware/jwt");
const router = express.Router();
router.use(verifyJWT);

router.route("/").post(insertDataCompany);
router.route("/AgreedRegistrationCompany").get(AgreedRegistrationCompany);
router.route("/UpdatedataRegistration").put(UpdatedataRegistration);
router.route("/bringCompanyRegitration").get(bringDataCompanyRegistration);





router.route("/").get(bringDataCompany);
router.route("/OpenOrCloseopreationStopfinance").get(OpenOrCloseopreationStopfinance);
router.route("/").put(UpdateDataCompany);

router.route("/brinshName").get(BringNameCompany);
router.route("/UpdateApiCompany").get(UpdateApiCompany);


router.route("/brinsh").post(inseertCompanybrinsh);
router.route("/brinsh/bring").post(biringDatabrinshCompany);
router.route("/brinsh/Update").put(UpdateCompanybrinsh);
router.route("/brinsh/InsertLinkevaluation").post(InsertLinkevaluation);

// عمليات العهد
router.route("/brinsh/insertRequestFinancialCustody").post(insertRequestFinancialCustody); 
router.route("/brinsh/BringDataFinancialCustody").get(BringDataFinancialCustody);
router.route("/brinsh/Acceptandrejectrequests").put(Acceptandrejectrequests);
router.route("/brinsh/Deletecovenantrequests").get(Deletecovenantrequests);
router.route("/brinsh/Updatecovenantrequests").put(Updatecovenantrequests);

module.exports = router;
