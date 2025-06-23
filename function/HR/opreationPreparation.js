const { calculateHoursBetween } = require("../../middleware/Aid");
const { inserttableAvailabilityday, insertTablecheckPreparation } = require("../../sql/INsertteble");
const { SELECTTABLEHRuser, SELECTTableusersCompanyonObject } = require("../../sql/selected/selectuser");
const { UPDATETableprepareOvertimeassignment, UPDATETablecheckPreparation } = require("../../sql/update");






const  opreationPreparation =  () => {
  return async (req,res) =>{

    try {
    const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
            // Assuming you have a function to insert HR data into the database
      const {PhoneNumber,Overtimeassignment,DateDay,type,Checktime,CheckFile} = req.body; // Get HR data from request body
      // Insert the HR data into the database (this is a placeholder, replace with actual DB logic)
      if (String(type).includes("Check")) {
        // Handle CheckPreparation type
        const user = await SELECTTableusersCompanyonObject(PhoneNumber,'id');
        console.log(DateDay);
        await CheckPreparation(userSession?.IDCompany, user.id, DateDay, Checktime, CheckFile, type);
      } else if (type === "Overtimeassignment") {
        // Handle Overtimeassignment type
        const newvalidy = Object.keys(PhoneNumber);

        for (let i = 0; i < newvalidy.length; i++) {

          if (!newvalidy || typeof newvalidy[i] !== 'number') {
            return res.status(400).send({ error: "Invalid user ID provided" });
          }
          await Overtimeassignmentopreation(userSession?.IDCompany, newvalidy[i], Overtimeassignment, DateDay);
        }
  
      } else {
        return res.status(400).send({ error: "Invalid type provided" });
      }
      
      res.status(200).send({ success: "تمت العملية بنجاح" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "فشل تنفيذ العملية" });
    }
  }
}




const Overtimeassignmentopreation  = async (IDCompany,idUser,Overtimeassignment,DateDay) => {
  try {
    const resultuser = await SELECTTABLEHRuser(IDCompany,idUser,DateDay);
    
    if(!resultuser || typeof resultuser !== 'object' || !resultuser?.id) {
    await inserttableAvailabilityday([IDCompany,idUser,Overtimeassignment]); // Replace with actual DB logic
    }else{
      await UPDATETableprepareOvertimeassignment([Overtimeassignment,resultuser.id]);
    }
  } catch (error) {
    console.error(error);
    throw new Error("فشل في تحديث أو إدخال بيانات التوافر");
  }
}

const CheckPreparation = async (IDCompany,idUser,DateDay,Checktime,CheckFile,type) => {
  try {
    const resultuser = await SELECTTABLEHRuser(IDCompany,idUser,DateDay);

    const check = type === 'CheckIn' ? "CheckIntime" : "CheckOUTtime";
    const checkfile = type === 'CheckIn' ? "CheckInFile" : "CheckoutFile";
    if(!resultuser || typeof resultuser !== 'object' || !resultuser?.id) {
      
      await insertTablecheckPreparation([IDCompany,idUser,Checktime,JSON.stringify(CheckFile)],check,checkfile); // Replace with actual DB logic
    }else{
    let Numberofworkinghours = '';
    if(type === 'CheckOut' && resultuser.CheckIntime) {
    
    const hoursBetween = calculateHoursBetween(resultuser.CheckIntime, Checktime);
    // console.log(`Hours between: ${hoursBetween.toFixed(2)}`); // Output: 9.50
    if (hoursBetween < 0) {
    throw new Error("الوقت غير صالح");
    }
    Numberofworkinghours= `,Numberofworkinghours=${hoursBetween.toFixed(2)}`

    if(resultuser.Overtimeassignment === 'true' && hoursBetween.toFixed(2) > 8){
      Numberofworkinghours= `,Numberofworkinghours=${hoursBetween.toFixed(2)},Numberofovertimehours=${hoursBetween.toFixed(2) - 8}`
    }
  }

  await UPDATETablecheckPreparation(Checktime,JSON.stringify(CheckFile),resultuser.id,check,checkfile,Numberofworkinghours);
  }
  } catch (error) {
    console.error(error);
    throw new Error("فشل في تحديث أو إدخال بيانات التحقق من الإعداد");
  }
}

module.exports = { opreationPreparation };