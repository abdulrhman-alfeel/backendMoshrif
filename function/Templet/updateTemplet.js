const { uploaddata } = require("../../bucketClooud");
const { implmentOpreationSingle } = require("../../middleware/Fsfile");
const {
  SELECTFROMTableStageTempletaObject,
} = require("../../sql/selected/selected");
const {
  UPDATETablecompanySubProjectStagetemplet,
  UPDATETablecompanySubProjectStageSubtemplet,
  UPDATETablecompanySubProjectStagesSubv2,
  UPDATEStopeProjectStageCUSTv2,
} = require("../../sql/update");

const UpdateStageHome = (uploadQueue) => {
  return async (req, res) => {
    try {
      const { StageID, Type, StageName, Days } = req.body;
      if (!StageID || !Type || !StageName) {
        return res.status(400).send({ error: "جميع الحقول مطلوبة" });
      }
      await UPDATETablecompanySubProjectStagetemplet([
        Type,
        StageName,
        Days,
        StageID,
      ]);
      res.send({ success: "تمت العملية بنجاح" }).status(200);
      const stage = await SELECTFROMTableStageTempletaObject(StageID);
      if (stage) {
        let split = stage?.StageName?.split("(");
        let b = split[1].trim();
        await UPDATEStopeProjectStageCUSTv2([
          Type,
          `${StageName} (${b}`,
          Days,
          stage?.StageIDtemplet,
        ]);
      }
    } catch (error) {
      console.error("Error inserting stage home:", error);
      res.status(500).send({ error: "حدث خطأ أثناء إدخال البيانات" });
    }
  };
};

const UpdateStageSub = (uploadQueue) => {
  return async (req, res) => {
    try {
      const { StageSubID, StageSubName } = req.body;
      const attached = req.file ? req.file.filename : null;

      if (!StageSubID || !StageSubName) {
        return res.status(400).send({ error: "جميع الحقول مطلوبة" });
      }
      if (!attached) {
        await UPDATETablecompanySubProjectStageSubtemplet([
          StageSubName,
          StageSubID,
        ]);
      } else {
        await UPDATETablecompanySubProjectStageSubtemplet(
          [StageSubName, attached, StageSubID],
          "StageSubName=?, attached=?"
        );
        await uploaddata(req.file);
        implmentOpreationSingle("upload", attached);
      }

      res.send({ success: "تمت العملية بنجاح" }).status(200);
      await UPDATETablecompanySubProjectStagesSubv2([
        StageSubName,
        attached,
        StageSubID,
      ]);
    } catch (error) {
      console.error("Error inserting stage sub:", error);
      res.status(500).send({ error: "حدث خطأ أثناء إدخال البيانات" });
    }
  };
};

module.exports = {
  UpdateStageHome,
  UpdateStageSub,
};
