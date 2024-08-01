const {
  insertTablecompany,
  insertTablecompanySub,
} = require("../../sql/INsertteble");
const db = require("../../sql/sqlite");

const insertDataCompany = async (req, res) => {
  const CommercialRegistrationNumber = req.body.CommercialRegistrationNumber;
  const BuildingNumber = req.body.BuildingNumber;
  const StreetName = req.body.StreetName;
  const NeighborhoodName = req.body.NeighborhoodName;
  const PostalCode = req.body.PostalCode;
  const City = req.body.City;
  const Country = req.body.Country;
  const TaxNumber = req.body.TaxNumber;
  const NumberOFbranchesAllowed = req.body.NumberOFbranchesAllowed;
  const NumberOFcurrentBranches = req.body.NumberOFcurrentBranches;
  const companySub = req.body.companySub;
  // console.log(req.body);

  const tableCompany = await insertTablecompany([
    CommercialRegistrationNumber,
    BuildingNumber,
    StreetName,
    NeighborhoodName,
    PostalCode,
    City,
    Country,
    TaxNumber,
    NumberOFbranchesAllowed,
    NumberOFcurrentBranches,
  ]);

  // console.log(tableCompany);
  if (tableCompany) {
    companySub?.forEach(async (element) => {
      await insertTablecompanySub([
        element?.NumberCompany,
        element?.NameSub,
        element?.BranchAddress,
      ]);
    });
  }
  res
    .send({
      success: true,
    })
    .status(200);
};

const inseertCompanybrinsh = async (req, res) => {
  const NumberCompany = req.body.NumberCompany;
  const NameSub = req.body.NameSub;
  const BranchAddress = req.body.BranchAddress;
  const Email = req.body.Email;
  const PhoneNumber = req.body.PhoneNumber
  const operation = await insertTablecompanySub([NumberCompany, NameSub, BranchAddress,Email,PhoneNumber]);
  
  res
  .send({
    success: operation ,
  })
  .status(200);
};
module.exports = { insertDataCompany ,inseertCompanybrinsh};
