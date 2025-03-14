const uploadController = require('../function/chate/workersUpload/uploadController.js')
const express = require("express");

const router = express.Router();
const uploadRoutes =({ uploadQueue }) => {
  
  // Upload routes
  router.post('/uploads/initialize', uploadController.initializeUpload(uploadQueue));
  router.put('/uploads/chunk', uploadController.handleChunk(uploadQueue));
  router.get('/uploads/resume/:fileId', uploadController.getResumeInfo);
  router.delete('/uploads/:fileId', uploadController.cancelUpload(uploadQueue));
  
  return router;
};
module.exports = {uploadRoutes}