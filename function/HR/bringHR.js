const {
  SELECTTABLEHR,
  SELECTTABLEObjectHR,
  SELECTTableusersCompany,
  SELECTuserjustforHR,
} = require("../../sql/selected/selectuser");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const BringHR = () => {
  return async (req, res) => {
    try {
      const {  Dateday, LastID } = req.query; // Get parameters from request body
        const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      // Simulate fetching HR data
      const hrData = await SELECTTABLEHR(userSession?.IDCompany, Dateday, LastID);
      let array = [];

      for (let index = 0; index < hrData.length; index++) {
        const element = hrData[index];
        array.push({
          ...element,
          CheckInFile:element.CheckInFile ?  JSON.parse(element.CheckInFile) : {},
          CheckoutFile:element.CheckoutFile ?  JSON.parse(element.CheckoutFile) : {}
        })
        
      }
      // Send the HR data as a response
      res.status(200).send({ success: true, data: array });
    } catch (error) {
      console.error("Error fetching HR data:", error);
      res
        .status(500)
        .send({ success: false, message: "Failed to fetch HR data" });
    }
  };
};
const SearchHR = () => {
  return async (req, res) => {
    try {
      const {  Dateday, LastID, PhoneNumber } = req.query; // Get parameters from request body
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      // Simulate fetching HR data
      const hrData = await SELECTTABLEHR(
        userSession?.IDCompany,
        Dateday,
        LastID,
        `AND us.PhoneNumber=${PhoneNumber}`
      );

      let array = [];

      for (let index = 0; index < hrData.length; index++) {
        const element = hrData[index];
        array.push({
          ...element,
          CheckInFile:element.CheckInFile ?  JSON.parse(element.CheckInFile) : {},
          CheckoutFile:element.CheckoutFile ?  JSON.parse(element.CheckoutFile) : {}
        })
        
      }
      // Send the HR data as a response
      res.status(200).send({ success: true, data: array });
    } catch (error) {
      console.error("Error fetching HR data:", error);
      res
        .status(500)
        .send({ success: false, message: "Failed to fetch HR data" });
    }
  };
};
const { GoogleAuth } = require("google-auth-library");
const { HtmlStatmentHR } = require("../../pdf/writHtml");
const { convertHtmlToPdf } = require("../../pdf/convertotpdf");
const { SELECTTablecompany } = require("../../sql/selected/selected");
const { bucket } = require("../../bucketClooud");
const { deleteFileSingle } = require("../../middleware/Fsfile");
const { DateDay, dates } = require("../../middleware/Aid");
const { DateTime } = require("luxon");

const Userverification = () => {
  return async (req, res) => {
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
    }

    try {
      const { type } = req.query; // Get parameters from request body
      const date = new Date();
      
      const Dateday = DateDay(date);
      // Simulate fetching HR data
      // const Dateday =
      const hrData = await SELECTTABLEObjectHR(
        userSession?.IDCompany,
        Dateday,
        `AND us.PhoneNumber=${userSession?.PhoneNumber}`
      );

      // Send the HR data as a response
      let success =
        type === "CheckIn"
          ? !hrData || hrData?.CheckIntime === null
          : hrData?.CheckIntime !== null && hrData?.CheckOUTtime === null ;
        
      let accessToken;
      let uniqueFileName;
      if (success) {
        const auth = new GoogleAuth({
          keyFile: "backendMoshrif.json", // استبدل هذا بمسار ملف JSON الخاص بحساب الخدمة
          scopes: ["https://www.googleapis.com/auth/cloud-platform"], // نطاقات الوصول المطلوبة
        });

        const client = await auth.getClient();
        accessToken = (await client.getAccessToken()).token;
        uniqueFileName = uuidv4();
      }
      let message =
        type === "CheckOut" && !success
          ?hrData?.CheckOUTtime !== null ?   "لقد تم التحضير بالفعل":  "يجب تحضير الدخول اولاً"
          : "تم التحضير بالفعل";
      res.status(200).send({
        success: success,
        token: accessToken,
        nameFile: uniqueFileName,
        message: message,
      });
    } catch (error) {
      console.error("Error fetching HR data:", error);
      res
        .status(500)
        .send({ success: false, message: "Failed to fetch HR data" });
    }
  };
};

const BringUsersjustforHR = () => {
  return async (req, res) => {
    try {
      const userName = req.query.userName;
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      const result = await SELECTTableusersCompany(
        userSession?.IDCompany,
        `AND userName LIKE '%${userName}%' AND jobdiscrption='موظف' `,
        "",
        "id,IDCompany,userName,IDNumber,PhoneNumber,job,jobdiscrption"
      );
      let userarray = [];
      for (let index = 0; index < result.length; index++) {
        const element = result[index];
        const Datedayovertime = await SELECTuserjustforHR(
          userSession?.IDCompany,
          element?.id
        );
        userarray.push({
          ...element,
          Datedayovertime: Datedayovertime?.map(items => items.Dateday),
        });
      }
      if (userarray.length <= 0) {
        userarray = result;
      }
      res.status(200).send({ success: "تم تنفيذ العملية", data: userarray });
    } catch (error) {
      console.log(error);
      res.status(200).send({ success: "فشل تنفيذ العلمية" });
    }
  };
};


const createstatementPdf = () => {
  return async (req,res) => {
    const {  Dateday, PhoneNumber } = req.query; // Get parameters from request body
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
    const hrData = await SELECTTABLEHR(
        userSession?.IDCompany,
        Dateday,
        0,
        `AND us.PhoneNumber=${PhoneNumber}`,
        "",
      );
      let month =  new Date(hrData[0].Dateday).getUTCMonth() + 1;
      let years = new Date(hrData[0].Dateday).getUTCFullYear();
      let namefile = '';
      if(hrData.length > 0) {
        const company =  await SELECTTablecompany(userSession?.IDCompany);
        let arrayday = [];
      for(let p = 0 ; p < 31; p++){
        let num = p + 1;
        const number = String(num).length < 2 ? `0${num}`:num;
        let day= `${years}-${dates(month)}-${number}`;
        arrayday.push(day);
      }
      namefile =  `${hrData[0].userName}_${new Date().getMinutes()}.pdf`;
      const filePath = path.join(__dirname, "../../upload", namefile);
  
      const htmlContent = await HtmlStatmentHR(arrayday,hrData,company);
      await convertHtmlToPdf(htmlContent, filePath);
        if (fs.existsSync(filePath)) {
            await bucket.upload(filePath);
            // deleteFileSingle(namefile, "upload");
          } else {
            return res
              .status(400)
              .send({ success: "فشل في تنفيذ العملية - الملف غير موجود" });
          }
      }
    res.status(200).send({ success: "تمت العملية بنجاح", url: namefile });


  }
}

// const { DateTime } = require('luxon'); // You can use luxon for date handling
// function switchWeek(nameDays) {
//     const day = nameDays.trim();
//     switch (day) {
//         case 'Saturday':
//             return 'السبت';
//         case 'Sunday':
//             return 'الاحد';
//         case 'Monday':
//             return 'الاثنين';
//         case 'Tuesday':
//             return 'الثلاثاء';
//         case 'Wednesday':
//             return 'الاربعاء';
//         case 'Thursday':
//             return 'الخميس';
//         case 'Friday':
//             return 'الجمعة';
//         default:
//             return 'يوم غير معروف'; // Unknown day
//     }
// }
// // Get the current date and format it
// const currentDate = DateTime.fromISO('2025-06-25');
// const day = switchWeek(currentDate.toFormat('cccc')); // Get the full name of the day
// console.log(`اليوم هو: ${day}`);


// "2025-06-03"


module.exports = { BringHR, SearchHR, Userverification, BringUsersjustforHR ,createstatementPdf};
