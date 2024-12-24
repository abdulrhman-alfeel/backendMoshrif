const {
  SELECTTablecompanySub,
  SELECTTablecompanyName,
  SELECTTablecompanySubAnotherway,
  SELECTTablecompanySubProject,
  SELECTTablecompany,
  SELECTTablecompanySubLinkevaluation,
  SELECTTableFinancialCustody,
} = require("../../sql/selected/selected");
const {
  SELECTTableusersCompanyonObject,
} = require("../../sql/selected/selectuser");

const bringDataCompany = async (req, res) => {
  try {
    // console.log(req.query);
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
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
    }
    const job = userSession.job;

    const Datausere = await SELECTTableusersCompanyonObject(
      userSession.PhoneNumber
    );
    const validity = Datausere.Validity !== null ? JSON.parse(Datausere.Validity) : [];;
    const company = await SELECTTablecompanyName(IDCompany);
    let arrayBrinsh = [];
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

//  طلبات بيانات العهد

const BringDataFinancialCustody = async (req, res) => {
  try {
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
    }
    const resultUser = await SELECTTableusersCompanyonObject(
      userSession.PhoneNumber
    );
    let kindOpreation =
      resultUser.job === "Admin" || resultUser.job === "مالية"
        ? "all"
        : "Brinsh";
    let Bringaway;
    const IDCompany = userSession.IDCompany;
    const kindRequest = req.query.kindRequest;
    const LastID = req.query.LastID;

    const IDCompanySub = req.query.IDCompanySub;
    const Validityuser =
      resultUser.job !== "Admin"
        ? await KnowuserpermissioninCovenant(
            JSON.parse(resultUser.Validity),
            IDCompanySub,
            userSession.PhoneNumber
          )
        : "";
    switch (kindRequest) {
      case "معلقة":
        Bringaway =
          kindOpreation === "all"
            ? `OrderStatus='false' AND RejectionStatus='false' AND fi.id > ${LastID} `
            : `${Validityuser} AND OrderStatus='false' AND RejectionStatus='false' AND fi.id > ${LastID}`;
        break;
      case "مغلقة":
        Bringaway =
          kindOpreation === "all"
            ? `OrderStatus='true' AND fi.id > ${LastID}`
            : `${Validityuser} AND OrderStatus='true' AND RejectionStatus='false' AND fi.id > ${LastID}`;
        break;
      case "مرفوضة":
        Bringaway =
          kindOpreation === "all"
            ? `RejectionStatus='true' AND fi.id > ${LastID}`
            : `${Validityuser} AND RejectionStatus='true' AND fi.id > ${LastID}`;
        break;
    }
    const result = await SELECTTableFinancialCustody(IDCompany, Bringaway);
    res.send({ success: "تمت العملية بنجاح", data: result }).status(200);
  } catch (error) {
    console.log(error);
    res.send({ success: "فشل تنفيذ العملية" }).status(500);
  }
};

const KnowuserpermissioninCovenant = (Validity, IDCompanySub, userName) => {
  try {
    const findBrinsh = Validity.find(
      (items) =>
        parseInt(items.idBrinsh) === parseInt(IDCompanySub) && items.Acceptingcovenant === true
    );
    if (findBrinsh) {

      return `IDCompanySub=${IDCompanySub}`;
    } else {
      return `IDCompanySub=${IDCompanySub} AND Requestby=${userName}`;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  biringDatabrinshCompany,
  bringDataCompany,
  BringDataFinancialCustody,
};
