const { uploaddata } = require("../../bucketClooud");
const { verificationfromdata } = require("../../middleware/Aid");
const { implmentOpreationSingle } = require("../../middleware/Fsfile");
const {
  insertTablecompanySubProjectStagetemplet,
  insertTablecompanySubProjectStageSubtemplet2,
} = require("../../sql/INsertteble");
const {
  SELECTFROMTableStageTempletmax,
} = require("../../sql/selected/selected");

const insertStageHome = (uploadQueue) => {
  return async (req, res) => {
    try {
      const { Type, StageName, Days } = req.body;
      if (await verificationfromdata([Type, StageName, Days])) {
        const StageID = await SELECTFROMTableStageTempletmax();
        if (StageID && String(StageID)?.length !== 0) {
          await insertTablecompanySubProjectStagetemplet([
            Number(StageID) + 1,
            Type,
            StageName,
            Days,
          ]);
          res.send({ success: "تمت الاضافة بنجاح" }).status(200);
        } else {
          res.send({ success: "هناك خطأ" }).status(400);
        }
      } else {
        res.send({ success: "يرجى ادخال البيانات بشكل صحيح" }).status(400);
      }
    } catch (error) {
      console.log(error);
    }
  };
};

const insertStageSub = (uploadQueue) => {
  return async (req, res) => {
    try {
      const { StageID, StageSubName } = req.body;

      const attached = req.file ? req.file.filename : null;
      if (await verificationfromdata([StageID, StageSubName])) {
        if (attached !== null && attached !== undefined) {
          await insertTablecompanySubProjectStageSubtemplet2([
            StageID,
            StageSubName,
            attached,
          ]);
          await uploaddata(req.file);
          await implmentOpreationSingle("upload", attached);
        }
        await insertTablecompanySubProjectStageSubtemplet2([
          StageID,
          StageSubName,
          null,
        ]);

        res.send({ success: "تمت الاضافة بنجاح" }).status(200);
      } else {
        res.send({ success: "يرجى ادخال البيانات بشكل صحيح" }).status(400);
      }
    } catch (error) {
      console.log(error);
      res.send({ success: "حدث خطأ" }).status(400);
    }
  };
};

module.exports = {
  insertStageHome,
  insertStageSub,
};
