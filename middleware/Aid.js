const {
  inserttableFlowmove,
  insertTablecompanySubProjectStagetemplet,
  insertTablecompanySubProjectStageSubtemplet,
  insertTablecompanySubProjectStageCUSTv2,
  insertTableusersBransh,
  insertTableusersProject,
  insertTableallStagestype,
} = require("../sql/INsertteble");
const { DateTime } = require("luxon");
const moment = require("moment-timezone");

const convertArabicToEnglish = (arabicNumber) => {
  const arabicToEnglishMap = {
    "٠": "0",
    "١": "1",
    "٢": "2",
    "٣": "3",
    "٤": "4",
    "٥": "5",
    "٦": "6",
    "٧": "7",
    "٨": "8",
    "٩": "9",
  };
  const inputString =
    typeof arabicNumber === "string" ? arabicNumber : String(arabicNumber);
  return inputString
    .split("")
    .map((char) => arabicToEnglishMap[char] || char)
    .join("");
};

const verificationfromdata = async (array) => {
  try {
    let count = 0;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      // console.log(String(element).trim());
      if (String(element).trim().length > 0) {
        count++;
      }
      if (count === array.length) {
        return true;
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// Function to calculate hours between two timestamps
function calculateHoursBetween(startTime, endTime) {
  // Parse the timestamps into Date objects
  const start = new Date(startTime);
  const end = new Date(endTime);

  // Calculate the difference in milliseconds
  const diffMs = end - start;
  console.log(diffMs);
  // Convert milliseconds to hours
  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours;
}

// دالة لحساب فارق الأيام
function calculateDaysDifference(date1, date2) {
  const date1Obj = new Date(date1);
  const date2Obj = new Date(date2);

  // حساب الفرق بالميلي ثانية
  const diffTime = Math.abs(date2Obj - date1Obj);
  return Math.ceil(diffTime / (1000 * 3600 * 24)); // تحويل الميلي ثانية إلى أيام

};





function calculateendDate(time=new Date()){
const today = new Date(time);
const year = today.getFullYear();
const month = today.getMonth();
// نجيب اليوم الأخير (اليوم 0 من الشهر القادم هو آخر يوم في الشهر الحالي)
const daysInMonth = new Date(year, month + 1, 0).getDate();
return daysInMonth
} 


function calculateAcountsubscripation (subscripatiion){
const daysInMonth = calculateendDate();
return  subscripatiion / daysInMonth
}

const dates = (time) => (String(time).length > 1 ? time : `0${time}`);
const DateDay = (date) =>
  `${date.getUTCFullYear()}-${dates(date.getUTCMonth() + 1)}-${dates(
    date.getUTCDate()
  )}`;

// Example usage:
// const hoursBetween = calculateHoursBetween('2023-01-01T08:00:00', '2023-01-01T17:30:00');
// console.log(`Hours between: ${hoursBetween.toFixed(2)}`); // Output: 9.50
// ترتيب المراحل
const ChangeDate = (teble, StartDate) => {
  const d3Value = new Date(StartDate); // replace with your D3.Value
  const newData = [...teble];

  newData[0].StartDate = d3Value;
  let days = newData[0].Days === 0 ? 1:newData[0].Days;
  const dataend = new Date(
    d3Value.setDate(d3Value.getDate() + days)
  );
  newData[0].EndDate = dataend;
  newData[0].OrderBy = 1;

  for (let i = 1; i < newData.length; i++) {
    newData[i].OrderBy = newData[i - 1].OrderBy + 1;
    newData[i].StartDate = new Date(newData[i - 1].EndDate);
    let days2 = newData[i].Days === 0 ? 1:newData[i].Days;
    const datanextEnd = new Date(
      d3Value.setDate(
        new Date(newData[i].StartDate).getDate() + days2
      )
    );
    newData[i].EndDate = datanextEnd;
  }
  return newData;
};
const subscripation = {
  company: 100,
  singular: 150,
};

// وظيفة ادخال البيانات في جدوول المراحل  الرئيسي
const Stage = async (teble, StartDate, types = "new") => {
  try {
    // let count = 2;
    // let Days = 5;

    // const futureDate = new Date(currentDate);
    // futureDate.setDate(currentDate.getDate() + 5);
    // console.log(newData,'helllow');

    const newData = await ChangeDate(teble, StartDate);
    console.log(newData[0].StartDate,newData[0].EndDate)
    for (let index = 0; index < newData.length; index++) {
      const item = teble[index];
      let number = types === "new" ? `(${index + 1})` : "";
     
      await insertTablecompanySubProjectStageCUSTv2([
        item.StageID,
        item.ProjectID,
        item.Type,
        `${item.StageName} ${number}`,
        item.Days,
        moment(item.StartDate).format("YYYY-MM-DD"),
        moment(item.EndDate).format("YYYY-MM-DD"),
        item.OrderBy,
        item.Referencenumber,
        item.Ratio,
        item.attached,
        item.rate
      ]);
    }
  } catch (err) {}
};

// حساب الايام للمراحل المشروع
const AccountDays = (numberBuilding, Days) => {
  try {
    let s;
    numberBuilding === 1
      ? (s = 1)
      : numberBuilding === 2
      ? (s = 1.5)
      : numberBuilding === 3
      ? (s = 2)
      : numberBuilding === 4
      ? (s = 2.5)
      : numberBuilding === 5
      ? (s = 3)
      : numberBuilding === 6
      ? (s = 3.5)
      : numberBuilding === 7
      ? (s = 4)
      : numberBuilding === 8
      ? (s = 4.5)
      : numberBuilding === 9
      ? (s = 5)
      : (s = 5.5);

    const count = Days * s;
    return Math.round(count);
  } catch (error) {
    console.log(error);
  }
};
const xlsx = require("xlsx");
const { SELECTTableusersCompanyall } = require("../sql/selected/selectuser");
const { UPDATECONVERTDATE } = require("../sql/update");

const StageTempletXsl2 = async (type = "StagesTempletEXcel.xlsx",number=0) => {
  try {
    try {
      // Read the Excel file
      const workbook = xlsx.readFile(type);

      // Get the first sheet
      const sheetName = workbook.SheetNames[number];
      const worksheet = workbook.Sheets[sheetName];

      const datad = xlsx.utils.sheet_to_json(worksheet);
      return datad;
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.log(error);
  }
};

const StageSubTempletXlsx = async (StageID) => {
  try {
    // Read the Excel file
    const workbook = xlsx.readFile("StagesSubTempletEXcel.xlsx");

    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Get the data from the sheet
    const data = xlsx.utils.sheet_to_json(worksheet);
    return data.filter((item) => item.StageID === StageID);
  } catch (error) {
    console.error(error);
  }
};

const insertStageinDatabase = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await StageTempletXsl2();
      if (data && data.length > 0) {
        for (const item of data) {
          await insertTablecompanySubProjectStagetemplet([
            item.StageID,
            item.Type,
            item.StageName,
            item.Days,
            item.OrderBy,
          ]);
        }
        const dataSub = await StageTempletXsl2("StagesSubTempletEXcel.xlsx");
        if (dataSub && dataSub.length > 0) {
          for (const item of dataSub) {
            await insertTablecompanySubProjectStageSubtemplet([
              item.StageID,
              item.StageSubName,
            ]);
          }
        }
        console.log("ok");
        resolve(true);
      } else {
        reject(new Error("No data found in the Excel file."));
      }
    } catch (error) {}
  });
};

// insertStageinDatabase();

const StageTempletXsl = async (type, kind = "all") => {
  try {
    try {
      // Read the Excel file
      const workbook = xlsx.readFile("StagesTempletEXcel.xlsx");

      // Get the first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const datad = xlsx.utils.sheet_to_json(worksheet);
      if (kind === "all") {
        return datad.filter(
          (item) =>
            String(item.Type).replace(" ", "").trim() ===
            String(type).replace(" ", "").trim()
        );
      } else {
        return datad.find((item) => item.StageID === type);
      }
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.log(error);
  }
};
const Addusertraffic = async (userName, PhoneNumber, Movementtype) => {
  try {
    const data = [
      userName,
      PhoneNumber,
      Movementtype,
      `${new Date().toUTCString()}`,
    ];
    await inserttableFlowmove(data);
  } catch (error) {
    console.log(error);
  }
};


function switchWeek(nameDays) {
  const day = nameDays.trim();
  switch (day) {
    case "Saturday":
      return "السبت";
    case "Sunday":
      return "الاحد";
    case "Monday":
      return "الاثنين";
    case "Tuesday":
      return "الثلاثاء";
    case "Wednesday":
      return "الاربعاء";
    case "Thursday":
      return "الخميس";
    case "Friday":
      return "الجمعة";
    default:
      return "يوم غير معروف"; // Unknown day
  }
}

const converttimetotext = (time) => {
  const currentDate = DateTime.fromISO(time);
  const day = switchWeek(currentDate.toFormat("cccc"));
  return day;
};

// Function to switch the month name in Arabic
function switchMonth(nameMonth) {
  switch (nameMonth) {
    case "January":
      return "يناير";
    case "February":
      return "فبراير";
    case "March":
      return "مارس";
    case "April":
      return "ابريل";
    case "May":
      return "مايو";
    case "June":
      return "يونيو";
    case "July":
      return "يوليو";
    case "August":
      return "أغسطس";
    case "September":
      return "سبتمبر";
    case "October":
      return "أكتوبر";
    case "November":
      return "نوفمبر";
    case "December":
      return "ديسمبر";
    default:
      return "شهر غير معروف"; // Unknown month
  }
}

// Convert time to Arabic month name
const convertTimeToMonth = (time) => {
  const currentDate = DateTime.fromISO(time);
  const month = switchMonth(currentDate.toFormat("MMMM")); // Extracting the full month name
  return month;
};


const moveviltayeuseer =()=>{
  return new Promise(async(resolve,reject)=>{
    try {
      const data = await SELECTTableusersCompanyall();
      if(data && data.length > 0){
        for (const item of data) {
          const validity = item.Validity ? JSON.parse(item.Validity) : [];
          for (const key of validity) {
            if(key.idBrinsh){
              await insertTableusersBransh([key.idBrinsh,item.id,key.job]);
              for (const key2 of key.project) {
                if(key2.idProject){

                  await insertTableusersProject([key.idBrinsh,key2.idProject,item.id,JSON.stringify(key2.ValidityProject)]);
                }
              }
            }
            }
        };
        resolve(true)
      }else{
        resolve(false)
      }
    } catch (error) {
      reject(error)
    }
  });
}
// moveviltayeuseer()
// تحويل صيغة التاريخ
// UPDATECONVERTDATE();
// اضافة المعرفات والانواع لجدول الانواع 
// insertTableallStagestype();

module.exports = {
  calculateDaysDifference,
  Stage,
  AccountDays,
  StageTempletXsl,
  dates,
  DateDay,
  convertArabicToEnglish,
  verificationfromdata,
  calculateHoursBetween,
  Addusertraffic,
  StageSubTempletXlsx,
  subscripation,
  calculateAcountsubscripation,
  calculateendDate,
  switchWeek,
  converttimetotext,
  convertTimeToMonth,
  StageTempletXsl2
};
