const express = require('express')

const {Loginuser,LoginVerification, BringAllLoginActvity, CheckUserispresentornot, LoginVerificationv2 } = require('../function/companyselect/userCompanyselect')
const router = express.Router()
const { verifyJWT } = require("../middleware/jwt");

router.use(verifyJWT);

router.route('/').get(Loginuser);
router.route('/verification').get(LoginVerification);
router.route('/v2/verification').get(LoginVerificationv2);
router.route('/BringAllLoginActvity').get(BringAllLoginActvity);
router.route('/Checkfinduser').get(CheckUserispresentornot);


module.exports = router