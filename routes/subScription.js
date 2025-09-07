const express = require('express');
const { verifyJWT } = require('../middleware/jwt');
const { bringInvoicedetails } = require('../function/subscripation/opreationSubscripation');



const subScription = ({ uploadQueue }) => {
  const router = express.Router();
  router.use(verifyJWT);

  router.get('/',bringInvoicedetails(uploadQueue));


  return router;
}


module.exports = subScription;