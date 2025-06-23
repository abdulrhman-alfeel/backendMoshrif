const redis = require("../../middleware/cache");
const {
  SELECTTablecompanySub,
  SELECTTablecompanyName,
  SELECTTablecompanySubProject,
  SELECTTablecompany,
  SELECTTablecompanySubLinkevaluation,
  SELECTTableFinancialCustody,
  SELECTTableMaxFinancialCustody,
  SELECTTablecompanyRegistrationall,
  SELECTTableUsernameBrinsh,
} = require("../../sql/selected/selected");
const {
  SELECTTableusersCompanyonObject,
} = require("../../sql/selected/selectuser");

const bringDataCompanyRegistration = () => {
  return async (req, res) => {
    try {
      const { type, LastID } = req.query;
      const company = await SELECTTablecompanyRegistrationall(type, LastID);
      res.send({ masseg: "sucssfuly", data: company }).status(200);
    } catch (err) {
      console.log(err);
      res.send({ masseg: "sucssfuly" }).status(400);
    }
  };
};
const bringDataCompany = () => {
  return async (req, res) => {
    try {
      // console.log(req.query);
      const idCompany = req.query.idCompany;
      const company = await SELECTTablecompany(idCompany);
      res.send({ masseg: "sucssfuly", data: company }).status(200);
    } catch (err) {
      console.log(err);
      res.send({ masseg: "فشل تنفيذ العملية" }).status(402);
    }
  };
};

const BringNameCompany = () => {
  return async (req, res) => {
    try {
      const IDCompany = req.query.IDCompany;
      const result = await SELECTTableUsernameBrinsh(IDCompany);

      res.send({ success: "successfuly", data: result }).status(200);
    } catch (err) {
      console.log(err);
      res.send({ success: false }).status(400);
    }
  };
};

// طلب بيانات الشركة والفروع

const biringDatabrinshCompany = () => {
  return async (req, res) => {
    try {
      const {IDCompany,type} = req.body;
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }

      const key = `Bransh:${userSession?.PhoneNumber}:${IDCompany}`;

      const cached = await redis.get(key);
      if (cached && type === "cache") {
        const cachedData = JSON.parse(cached);
        // console.log("Data fetched from cache");
        return res.send({ masseg: "succfuly", ...cachedData }).status(200);
      }

      const result = await getCompanyBranchesForUser(IDCompany, userSession);

      res
        .send({
          masseg: "succfuly",
          ...result,
        })
        .status(200);

      await redis.set(key, JSON.stringify(result), "EX",   60 * 1000 );
    } catch (error) {
      console.log(error);
    }
  };
};

// Standalone function to get company branches and related data for a user
async function getCompanyBranchesForUser(IDCompany, userSession) {
  const Datausere = await SELECTTableusersCompanyonObject(
    userSession.PhoneNumber
  );
  const validity =
    Datausere.Validity !== null ? JSON.parse(Datausere.Validity) : [];
  const company = await SELECTTablecompanyName(IDCompany);
  let arrayBrinsh = [];
  if (userSession.job !== "Admin") {

    const where =validity.length > 0 && validity
      ?.map((items) => items?.idBrinsh)
      ?.reduce((item, r) => `${String(item) + " , " + r}`);
    if (where) {
    const typeproject = `id IN (${where})`;
    const dataCompany = await SELECTTablecompanySub(
      IDCompany,
      "*",
      typeproject
    );
    arrayBrinsh = dataCompany;
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
      const ObjectBrinsh = {
        ...element,
        CountProject: Count[0]["COUNT(*)"],
        Linkevaluation: Boolean(evaluation?.urlLink) ? evaluation?.urlLink : "",
      };
      ObjectData.push(ObjectBrinsh);
    }
  }
  const Covenantnumber = await SELECTTableMaxFinancialCustody(
    IDCompany,
    "count",
    "COUNT(idOrder) AS count"
  );


  return {
    data: ObjectData,
    nameCompany: company.NameCompany,
    CommercialRegistrationNumber: company.CommercialRegistrationNumber,
    Country: company.Country,
    Covenantnumber: Covenantnumber.count,
  };
}

//  طلبات بيانات العهد

const BringDataFinancialCustody = () => {
  return async (req, res) => {
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
      let plase = parseInt(LastID) === 0 ? ">" : "<";
      switch (kindRequest) {
        case "معلقة":
          Bringaway =
            kindOpreation === "all"
              ? `OrderStatus='false' AND RejectionStatus='false' AND fi.id ${plase} ${LastID} `
              : `${Validityuser} AND OrderStatus='false' AND RejectionStatus='false' AND fi.id ${plase} ${LastID}`;
          break;
        case "مغلقة":
          Bringaway =
            kindOpreation === "all"
              ? `OrderStatus='true' AND fi.id ${plase} ${LastID}`
              : `${Validityuser} AND OrderStatus='true' AND RejectionStatus='false' AND fi.id ${plase} ${LastID}`;
          break;
        case "مرفوضة":
          Bringaway =
            kindOpreation === "all"
              ? `RejectionStatus='true' AND fi.id ${plase} ${LastID}`
              : `${Validityuser} AND RejectionStatus='true' AND fi.id ${plase} ${LastID}`;
          break;
      }
      const result = await SELECTTableFinancialCustody(IDCompany, Bringaway);
      res.send({ success: "تمت العملية بنجاح", data: result }).status(200);
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل تنفيذ العملية" }).status(500);
    }
  };
};

const KnowuserpermissioninCovenant = (Validity, IDCompanySub, userName) => {
  try {
    const findBrinsh = Validity.find(
      (items) =>
        parseInt(items.idBrinsh) === parseInt(IDCompanySub) &&
        items.Acceptingcovenant === true
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
  bringDataCompanyRegistration,
  BringNameCompany,
};
