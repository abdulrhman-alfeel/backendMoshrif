const {
  SELECTTablecompanySub,
  SELECTTablecompanyName,
  SELECTTablecompanySubAnotherway,
  SELECTTablecompanySubProject,
  SELECTTablecompany,
  SELECTTablecompanySubLinkevaluation,
} = require("../../sql/selected/selected");

const bringDataCompany = async (req, res) => {
  try {
    console.log(req.query);
    const idCompany = req.query.idCompany;
    const company = await SELECTTablecompany(idCompany);
    res.send({ masseg: "sucssfuly", data: company }).status(200);
  } catch (err) {
    console.log(err);
    res.send({ masseg: "sucssfuly", data: company }).status(400);
  }
};

// طلب بيانات الشركة والفروع
const biringDatabrinshCompany = async (req, res) => {
  // console.log(req.body)
  try {
    const IDCompany = req.body.IDCompany;
    const job = req.body.job;
    const validity = req.body.Validity;
    const company = await SELECTTablecompanyName(IDCompany);
    let arrayBrinsh = [];
    // console.log(validity)
    if (job !== "Admin") {
      for (let index = 0; index < validity?.length; index++) {
        const element = validity[index];
        const dataBRinsh = await SELECTTablecompanySubAnotherway(
          element?.idBrinsh
        );
        arrayBrinsh.push(dataBRinsh);
      }
    } else {
      const dataCompany = await SELECTTablecompanySub(IDCompany);
      arrayBrinsh = dataCompany;
    }

    let ObjectData = [];
    for (let index = 0; index < arrayBrinsh.length; index++) {
      const element = arrayBrinsh[index];
      const Count = await SELECTTablecompanySubProject(element?.id, 0, "Count");
      const evaluation = await SELECTTablecompanySubLinkevaluation(element?.id);
      if (element !== undefined) {
        ObjectBrinsh = {
          ...element,
          CountProject: Count[0]["COUNT(*)"],
          Linkevaluation: Boolean(evaluation?.urlLink)
            ? evaluation?.urlLink
            : "",
        };
        
        ObjectData.push(ObjectBrinsh);
      }
    }
    res
      .send({
        masseg: "succfuly",
        data: ObjectData,
        nameCompany: company.NameCompany,
        CommercialRegistrationNumber: company.CommercialRegistrationNumber,
        Country: company.Country,
      })
      .status(200);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { biringDatabrinshCompany, bringDataCompany };
