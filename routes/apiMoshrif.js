const express = require("express");
const { verifyJWTapi } = require("../middleware/jwtApi");
const {
  ProjectOpreationsinsert,
  ProjectOpreationsUpdate,
  FinancialOperationsDatainsert,
  FinancialOperationsDataUpdate,
  FinancialOperationsFile,
  DeleteOperationsFinancial,
} = require("../function/api/Opreation");
const uploads = require("../middleware/uploads");

const router = express.Router();

router.use(verifyJWTapi);
router.route("/ProjectOpreations").post(ProjectOpreationsinsert);
router.route("/ProjectOpreations").put(ProjectOpreationsUpdate);

router.route("/FinancialOperatios").post(FinancialOperationsDatainsert);
router.route("/FinancialOperatios").put(FinancialOperationsDataUpdate);
router.route("/DeleteOperationsFinancial").delete(DeleteOperationsFinancial);

router.route("/FinancialOperatiosFile").post(uploads.any("image"),FinancialOperationsFile);

module.exports = router;
