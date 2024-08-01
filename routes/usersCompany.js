const express = require("express");
const { userCompany,userCompanySub } = require("../function/companyinsert/insertuserCompany");
const uploads = require("../middleware/uploads");
const router = express.Router();


router.route('/')
.post(uploads.single('image'),userCompany)

router.route('/Validity')
.post(userCompanySub)


module.exports = router