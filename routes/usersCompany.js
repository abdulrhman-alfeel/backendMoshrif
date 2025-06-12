const express = require("express");
const { userCompany } = require("../function/companyinsert/insertuserCompany");
const { BringUserCompany, BringUserCompanyinBrinsh, BringvalidityuserinBransh, BringUserCompanyinv2 } = require("../function/companyselect/userCompanyselect");
const { userCompanyUpdat, UpdatUserCompanyinBrinsh,DeletUser,UpdateToken, InsertmultipleProjecsinvalidity, UpdatUserCompanyinBrinshV2 } = require("../function/companyinsert/UpdatuserCompany");
const { verifyJWT } = require("../middleware/jwt");
const { BringDataNotifcation,FilterNotifcation, FilterNotifcationv2, BringDataNotifcationv2 } = require("../function/notifcation/InsertNotifcation");
const router = express.Router();

router.use(verifyJWT)

router.route('/')
.post(userCompany)
router.route('/updat')
.put(userCompanyUpdat)
router.route('/updat/userBrinsh')
.put(UpdatUserCompanyinBrinsh)
router.route('/updat/userBrinshv2')
.put(UpdatUserCompanyinBrinshV2)
router.route('/DeletUser')
.put(DeletUser)
router.route('/UpdateToken')
.put(UpdateToken)


router.route('/InsertmultipleProjecsinvalidity')
.put(InsertmultipleProjecsinvalidity)
router.route('/BringvalidityuserinBransh')
.get(BringvalidityuserinBransh)
router.route('/BringUserCompanyinv2')
.get(BringUserCompanyinv2)


router.route('/BringUserCompany')
.get(BringUserCompany)
router.route('/BringUserCompanyBrinsh')
.get(BringUserCompanyinBrinsh)

router.route('/BringDataNotifcation')
.get(BringDataNotifcation)
router.route('/FilterNotifcation')
.get(FilterNotifcation)
router.route('/BringDataNotifcationv2')
.get(BringDataNotifcationv2)
router.route('/FilterNotifcationv2')
.get(FilterNotifcationv2)


module.exports = router