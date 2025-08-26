const {
  SELECTFROMTableStageTempletall,
  SELECTFROMTableSubStageTempletall,
} = require("../../sql/selected/selected");

const BringStageHomeTemplet = (uploadQueue) => {
  return async (req, res) => {
    try {
      const {StageIDtemplet = 0 } = req.query;
      if (
        typeof StageIDtemplet === "undefined" ||
        StageIDtemplet === null ||
        StageIDtemplet === ""
      ) {
        return res.status(400).send({ error: "StageIDtemplet is required" });
      }
      // Logic to fetch the stage home template by StageIDtemplet
      // This is a placeholder; replace with actual database query
      const stageHomeTemplate = await SELECTFROMTableStageTempletall(
        StageIDtemplet
      );
      res
        .send({ success: "تمت العملية بنجاح", data: stageHomeTemplate })
        .status(200);
    } catch (error) {
      console.error("Error fetching stage home template:", error);
      res
        .status(500)
        .send({ error: "An error occurred while fetching the template" });
    }
  };
};

const BringStageSubTemplet = (uploadQueue) => {
  return async (req, res) => {
    try {
      const {StageID, StageSubID } = req.query;
      if (typeof StageSubID === "undefined" || StageSubID === null || StageSubID === "") {
        return res.status(400).send({ error: "StageSubID is required" });
      };
      // Logic to fetch the stage sub template by StageSubID
      // This is a placeholder; replace with actual database query
      const stageSubTemplate = await SELECTFROMTableSubStageTempletall(
        StageID,
        StageSubID
      );
      res
        .send({ success: "تمت العملية بنجاح", data: stageSubTemplate })
        .status(200);
    } catch (error) {
      console.error("Error fetching stage sub template:", error);
      res
        .status(500)
        .send({ error: "An error occurred while fetching the template" });
    }
  };
};

module.exports = {
  BringStageHomeTemplet,
  BringStageSubTemplet,
};
