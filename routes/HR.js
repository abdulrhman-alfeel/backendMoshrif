const express = require('express');
const { verifyJWT } = require('../middleware/jwt');
const { opreationPreparation } = require('../function/HR/opreationPreparation');
const { BringHR, SearchHR, Userverification } = require('../function/HR/bringHR');



const HR = ({ uploadQueue }) => {
  const router = express.Router();
  router.use(verifyJWT);

  // Define your HR-related routes here
  // Example route for getting HR data
  router.post('/Preparation',opreationPreparation(uploadQueue));

  // Example route for updating HR data
  router.get('/BringHR',BringHR(uploadQueue));
  router.get('/SearchHR',SearchHR(uploadQueue));
  router.get('/Userverification',Userverification(uploadQueue));

  return router;
}


module.exports = HR;