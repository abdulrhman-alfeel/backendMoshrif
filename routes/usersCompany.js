const express = require("express");
const { userCompany } = require("../function/companyinsert/insertuserCompany");
const { BringUserCompany, BringUserCompanyinBrinsh, BringvalidityuserinBransh } = require("../function/companyselect/userCompanyselect");
const { userCompanyUpdat, UpdatUserCompanyinBrinsh,DeletUser,UpdateToken, InsertmultipleProjecsinvalidity } = require("../function/companyinsert/UpdatuserCompany");
const { verifyJWT } = require("../middleware/jwt");
const { BringDataNotifcation,FilterNotifcation } = require("../function/notifcation/InsertNotifcation");
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


router.route('/InsertmultipleProjecsinvalidity')
.put(InsertmultipleProjecsinvalidity)
router.route('/BringvalidityuserinBransh')
.get(BringvalidityuserinBransh)


router.route('/BringUserCompany')
.get(BringUserCompany)
router.route('/BringUserCompanyBrinsh')
.get(BringUserCompanyinBrinsh)

router.route('/BringDataNotifcation')
.get(BringDataNotifcation)
router.route('/FilterNotifcation')
.get(FilterNotifcation)


module.exports = router