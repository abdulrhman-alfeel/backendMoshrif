const express = require("express");
const {
  insertDataCompany,
  inseertCompanybrinsh,
  InsertLinkevaluation,
} = require("../function/companyinsert/insertCompany");
const {biringDatabrinshCompany, bringDataCompany} = require('../function/companyselect/bringCompany');
const { UpdateCompanybrinsh, UpdateDataCompany } = require("../function/companyinsert/UpdateCompany");
const { BringNameCompany } = require("../function/companyselect/userCompanyselect");
const router = express.Router();

router.route("/").post(insertDataCompany);
router.route("/").get(bringDataCompany);
router.route("/").put(UpdateDataCompany);

router.route("/brinshName").get(BringNameCompany);
router.route("/brinsh").post(inseertCompanybrinsh);
router.route("/brinsh/bring").post(biringDatabrinshCompany);
router.route("/brinsh/Update").put(UpdateCompanybrinsh);
router.route("/brinsh/InsertLinkevaluation").post(InsertLinkevaluation);

module.exports = router;
