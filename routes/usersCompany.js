const express = require("express");
const { userCompany,userCompanySub } = require("../function/companyinsert/insertuserCompany");
const uploads = require("../middleware/uploads");
const { BringUserCompany, BringUserCompanyinBrinsh } = require("../function/companyselect/userCompanyselect");
const { userCompanyUpdat, UpdatUserCompanyinBrinsh,DeletUser,UpdateToken } = require("../function/companyinsert/UpdatuserCompany");
const { verifyJWT } = require("../middleware/jwt");
const router = express.Router();

router.use(verifyJWT)
router.route('/')
.post(userCompany)
router.route('/updat')
.put(userCompanyUpdat)
router.route('/updat/userBrinsh')
.put(UpdatUserCompanyinBrinsh)
router.route('/DeletUser')
.put(DeletUser)
router.route('/UpdateToken')
.put(UpdateToken)
// .post(uploads.single('image'),userCompany)

router.route('/Validity')
.post(userCompanySub)
router.route('/BringUserCompany')
.get(BringUserCompany)
router.route('/BringUserCompanyBrinsh')
.get(BringUserCompanyinBrinsh)


module.exports = router