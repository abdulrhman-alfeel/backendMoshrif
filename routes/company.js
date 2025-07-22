const express = require("express");
const {
  insertDataCompany,
  inseertCompanybrinsh,
  InsertLinkevaluation,
  OpenOrCloseopreationStopfinance,
  insertRequestFinancialCustody,
} = require("../function/companyinsert/insertCompany");
const {
  biringDatabrinshCompany,
  bringDataCompany,
  BringDataFinancialCustody,
  bringDataCompanyRegistration,
  BringNameCompany,
} = require("../function/companyselect/bringCompany");
const {
  UpdateCompanybrinsh,
  UpdateDataCompany,
  Acceptandrejectrequests,
  Updatecovenantrequests,
  Deletecovenantrequests,
  UpdateApiCompany,
  AgreedRegistrationCompany,
  UpdatedataRegistration,
  DeleteCompanyRegistration,
  Branchdeletionprocedures,
  Implementedbyopreation,
} = require("../function/companyinsert/UpdateCompany");

const { verifyJWT } = require("../middleware/jwt");

const company = ({ uploadQueue }) => {
  const router = express.Router();
  // router.use(verifyJWT);

  router.route("/").post(insertDataCompany(uploadQueue));
  router
    .route("/AgreedRegistrationCompany")
    .get(AgreedRegistrationCompany(uploadQueue));
  router
    .route("/UpdatedataRegistration")
    .put(UpdatedataRegistration(uploadQueue));
  router
    .route("/bringCompanyRegitration")
    .get(bringDataCompanyRegistration(uploadQueue));
  router
    .route("/DeleteCompanyRegistration")
    .delete(DeleteCompanyRegistration(uploadQueue));

  router.route("/").get(bringDataCompany(uploadQueue));
  router
    .route("/OpenOrCloseopreationStopfinance")
    .get(OpenOrCloseopreationStopfinance(uploadQueue));
  router.route("/").put(UpdateDataCompany(uploadQueue));

  router.route("/brinshName").get(BringNameCompany(uploadQueue));
  router.route("/UpdateApiCompany").get(UpdateApiCompany(uploadQueue));

  router.route("/brinsh").post(inseertCompanybrinsh(uploadQueue));
  router.route("/brinsh/bring").post(biringDatabrinshCompany(uploadQueue));
  router.route("/brinsh/Update").put(UpdateCompanybrinsh(uploadQueue));
  router
    .route("/brinsh/InsertLinkevaluation")
    .post(InsertLinkevaluation(uploadQueue));

  // عمليات العهد
  router
    .route("/brinsh/insertRequestFinancialCustody")
    .post(insertRequestFinancialCustody(uploadQueue));
  router
    .route("/brinsh/BringDataFinancialCustody")
    .get(BringDataFinancialCustody(uploadQueue));
  router
    .route("/brinsh/Acceptandrejectrequests")
    .put(Acceptandrejectrequests(uploadQueue));
  router
    .route("/brinsh/Deletecovenantrequests")
    .get(Deletecovenantrequests(uploadQueue));
  router
    .route("/brinsh/Updatecovenantrequests")
    .put(Updatecovenantrequests(uploadQueue));

  // حذف فرع
  router
    .route("/brinsh/deleteBranch")
    .get(Branchdeletionprocedures(uploadQueue));
  router
    .route("/brinsh/Implementedbyopreation")
    .delete(Implementedbyopreation(uploadQueue));
  return router;
};

module.exports = company;
