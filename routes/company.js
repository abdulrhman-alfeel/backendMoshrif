const express = require("express");
const {
  insertDataCompany,
  inseertCompanybrinsh,
} = require("../function/companyinsert/insertCompany");
const router = express.Router();

router.route("/").post(insertDataCompany);

router.route("/brinsh").post(inseertCompanybrinsh);

module.exports = router;
