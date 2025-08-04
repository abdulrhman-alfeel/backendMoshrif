const express = require('express')

const {Loginuser,LoginVerification, BringAllLoginActvity, CheckUserispresentornot, LoginVerificationv2, loginOut } = require('../function/companyselect/userCompanyselect')
const { verifyJWT } = require("../middleware/jwt");


const Login = ({ uploadQueue }) => {
  // This function is not used in this file, but it might be used in other files.
  // It is a placeholder for future use or for other modules that might require it.
  const router = express.Router();
  router.use(verifyJWT);
  
  router.route('/').get(Loginuser(uploadQueue));
  router.route('/verification').get(LoginVerification(uploadQueue));
  router.route('/v2/verification').get(LoginVerificationv2(uploadQueue));
  router.route('/BringAllLoginActvity').get(BringAllLoginActvity(uploadQueue));
  router.route('/Checkfinduser').get(CheckUserispresentornot(uploadQueue));
  router.route('/loginOut').get(loginOut(uploadQueue));

  return router;
}

module.exports = Login