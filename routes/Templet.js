const experss = require('express');
const { verifyJWT } = require('../middleware/jwt');
const { BringStageHomeTemplet, BringStageSubTemplet, BringxlsxsheetTemplet, BringStagestypeforTemplet, BringStageSubTempletforProject } = require('../function/Templet/selectedTemplet');
const { insertStageHome, insertStageSub, insertStageTempletinDatabase, insertTypeTemplet } = require('../function/Templet/insertTemplet');
const { UpdateStageHome, UpdateStageSub, UpdateTypeTemplet } = require('../function/Templet/updateTemplet');
const { uploads } = require('../middleware/uploads');
const { DeletStageHome, DeletStageSub } = require('../function/Templet/deletetemplet');



const Templet = ({ uploadQueue }) => {
  const router = experss.Router();
  router.use(verifyJWT);

// BringxlsxTemplet
// insertTemplet

  router.get('/BringStageHomeTemplet', BringStageHomeTemplet(uploadQueue));
  router.get('/BringStageSubTemplet', BringStageSubTemplet(uploadQueue));
  router.get('/BringxlsxTemplet', BringxlsxsheetTemplet(uploadQueue));
  router.get('/BringStagestype', BringStagestypeforTemplet(uploadQueue));
  router.get('/BringTypeOFContract', BringStageSubTempletforProject(uploadQueue));

  router.get('/insertTypeTemplet/:Type', insertTypeTemplet(uploadQueue));
  router.post('/insertStageHome', insertStageHome(uploadQueue));
  router.post('/insertStageSub',uploads.single('file'), insertStageSub(uploadQueue));
  router.post('/insertTemplet',uploads.single('file'), insertStageTempletinDatabase(uploadQueue));

  router.put('/UpdateStageHome', UpdateStageHome(uploadQueue));
  router.put('/UpdateTypeTemplet', UpdateTypeTemplet(uploadQueue));
  router.put('/UpdateStageSub',uploads.single('file'), UpdateStageSub(uploadQueue));

  router.delete('/DeletStageHome',DeletStageHome(uploadQueue));
  router.delete('/DeletStageSub', DeletStageSub(uploadQueue));
  return router;
};


module.exports = Templet;

