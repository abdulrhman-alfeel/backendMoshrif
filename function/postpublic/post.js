const { insertTablePostPublic } = require("../../sql/INsertteble");
const { SELECTTableIDcompanytoPost } = require("../../sql/selected/selected");

const insertPostURL = async (items) => {
  try {
    if (Object.entries(items.File).length > 0) {
      console.log(items, "biii");
      const result = await SELECTTableIDcompanytoPost(items.ProjectID);
      console.log(result, "bi");
      const data = [
        items.Sender,
        items.File.name,
        items.File.type,
        items.File.location,
        items.StageID,
        items.ProjectID,
        result.IDcompanySub,
        result.NumberCompany,
      ];
      await insertTablePostPublic(data);
    }
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { insertPostURL };
