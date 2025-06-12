const express = require("express");
const { verifyJWTapi } = require("../middleware/jwtApi");
const {
  ProjectOpreationsinsert,
  ProjectOpreationsUpdate,
  FinancialOperationsDatainsert,
  FinancialOperationsDataUpdate,
  FinancialOperationsFile,
  DeleteOperationsFinancial,
  DeleteFileinFinancialOperationse,
  BringDatafileFinancial,
  FinancialUpdateInvoiceNo,
  AddfilesinArchives,
} = require("../function/api/Opreation");
const uploadsapis = require("../middleware/uploadsapis");

const router = express.Router();

router.use(verifyJWTapi);

router.route("/ProjectOpreations").post(ProjectOpreationsinsert);
router.route("/ProjectOpreations").put(ProjectOpreationsUpdate);

router.route("/AddfilesinArchives").post(uploadsapis.single("image"),AddfilesinArchives);

router.route("/FinancialOperatios").post(FinancialOperationsDatainsert);
router.route("/FinancialOperatios").put(FinancialOperationsDataUpdate);
router.route("/FinancialUpdateInvoiceNo").put(FinancialUpdateInvoiceNo);
router.route("/DeleteOperationsFinancial").delete(DeleteOperationsFinancial);
router.route("/DeleteFileinFinancial").delete(DeleteFileinFinancialOperationse);


router.route("/BringDatafileFinancial").get(BringDatafileFinancial);

router.route("/FinancialOperatiosFile").post(uploadsapis.any("image"),FinancialOperationsFile);

module.exports = router;
