const express = require('express')

const {Loginuser,LoginVerification} = require('../function/companyselect/userCompanyselect')
const router = express.Router()


router.route('/').get(Loginuser)
router.route('/verification').get(LoginVerification)


module.exports = router