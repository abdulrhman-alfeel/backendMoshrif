const express = require('express')

const {Loginuser,LoginVerification, BringAllLoginActvity} = require('../function/companyselect/userCompanyselect')
const router = express.Router()


router.route('/').get(Loginuser)
router.route('/verification').get(LoginVerification)
router.route('/BringAllLoginActvity').get(BringAllLoginActvity)


module.exports = router