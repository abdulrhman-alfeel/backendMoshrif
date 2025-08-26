const experss = require('express');
const { verifyJWT } = require('../middleware/jwt');
const { BringStageHomeTemplet, BringStageSubTemplet } = require('../function/Templet/selectedTemplet');
const { insertStageHome, insertStageSub } = require('../function/Templet/insertTemplet');
const { UpdateStageHome, UpdateStageSub } = require('../function/Templet/updateTemplet');
const { uploads } = require('../middleware/uploads');
const { DeletStageHome, DeletStageSub } = require('../function/Templet/deletetemplet');



const Templet = ({ uploadQueue }) => {
  const router = experss.Router();
  router.use(verifyJWT);

  router.get('/BringStageHomeTemplet', BringStageHomeTemplet(uploadQueue));
  router.get('/BringStageSubTemplet', BringStageSubTemplet(uploadQueue));

  router.post('/insertStageHome', insertStageHome(uploadQueue));
  router.post('/insertStageSub',uploads.single('file'), insertStageSub(uploadQueue));

  router.put('/UpdateStageHome', UpdateStageHome(uploadQueue));
  router.put('/UpdateStageSub',uploads.single('file'), UpdateStageSub(uploadQueue));

  router.delete('/DeletStageHome',DeletStageHome(uploadQueue));
  router.delete('/DeletStageSub', DeletStageSub(uploadQueue));
  return router;
};


module.exports = Templet;

