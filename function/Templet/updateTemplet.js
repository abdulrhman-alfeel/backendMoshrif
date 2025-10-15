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
  UPDATETableStagetype,
} = require("../../sql/update");

const UpdateStageHome = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        return res.status(401).send("Invalid session");
      }
      const { StageIDtemplet, Type, StageName, Days, Ratio, attached } =
        req.body;

      if (!StageIDtemplet || !Type || !StageName) {
        return res.status(400).send({ error: "جميع الحقول مطلوبة" });
      }

      const stage = await SELECTFROMTableStageTempletaObject(
        StageIDtemplet,
        userSession?.IDCompany,
        `,(SELECT SUM(Ratio) FROM StagesTemplet WHERE Type ='${Type}' AND IDCompany=${userSession?.IDCompany}) AS TotalRatio `
      );

      // حساب مجموع النسب التقديرية الحالية مع النسبة الجديدة
      const currentRatio = stage?.TotalRatio || 0; // إذا كانت النسبة غير موجودة، تعتبر 0
      const totalRatio = currentRatio + Number(Ratio);

      // التحقق إذا كانت النسبة الإجمالية أكبر من 100
      if (totalRatio > 100) {
        return res
          .status(400)
          .send({ error: "مجموع النسب لا يجب أن يتجاوز 100" });
      }
      await UPDATETablecompanySubProjectStagetemplet(
        req.body,
        userSession?.IDCompany,
        res
      );
      if (stage) {
        let split = stage?.StageName?.split("(");
        let b = split[1].trim();
        await UPDATEStopeProjectStageCUSTv2([
          Type,
          `${StageName} (${b}`,
          Days,
          parseInt(Ratio),
          attached,
          StageIDtemplet,
        ]);
        return res.send({ success: "تمت العملية بنجاح" }).status(200);
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
      const userSession = req.session.user;

      if (!userSession) {
        return res.status(401).send("Invalid session");
      }
      const { StageSubID, StageSubName } = req.body;
      const attached = req.file ? req.file.filename : null;

      if (!StageSubID || !StageSubName) {
        return res.status(400).send({ error: "جميع الحقول مطلوبة" });
      }
      if (!attached) {
        await UPDATETablecompanySubProjectStageSubtemplet([
          StageSubName,
          StageSubID,
          userSession.IDCompany,
        ]);
      } else {
        await UPDATETablecompanySubProjectStageSubtemplet(
          [StageSubName, attached, StageSubID, userSession.IDCompany],
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

const UpdateTypeTemplet = () => {
  return async (req, res) => {
    const {Type,id} = req.body;
    const userSession = req.session.user;
    if (!userSession) {
      return res.status(401).send("Invalid session");
    };
    console.log(Type,id);
    await UPDATETableStagetype(Type,id, userSession.IDCompany)
        return res.send({ success: "تمت العملية بنجاح" }).status(200);



  };
};

module.exports = {
  UpdateStageHome,
  UpdateStageSub,
  UpdateTypeTemplet
};
