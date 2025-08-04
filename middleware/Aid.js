const { isEmpty } = require("bullmq");
const { insertTablecompanySubProjectStageCUST } = require("../sql/INsertteble");

const convertArabicToEnglish = (arabicNumber) => {
  const arabicToEnglishMap = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5',
    '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  };
  const inputString = typeof arabicNumber === 'string' ? arabicNumber : String(arabicNumber);
  return inputString.split('').map(char => arabicToEnglishMap[char] || char).join('');
};




const verificationfromdata = async (array) => {
  try {
    let count = 0;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      // console.log(String(element).trim());
      if (String(element).trim().length > 0 ) {
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
    
    // Convert milliseconds to hours
    const diffHours = diffMs / (1000 * 60 * 60);
    
    return diffHours;
}

const dates = (time) => (String(time).length > 1 ? time : `0${time}`);
const DateDay = (date) =>  `${date.getUTCFullYear()}-${dates(
        date.getUTCMonth() + 1
      )}-${dates(date.getUTCDate())}`;

// Example usage:
// const hoursBetween = calculateHoursBetween('2023-01-01T08:00:00', '2023-01-01T17:30:00');
// console.log(`Hours between: ${hoursBetween.toFixed(2)}`); // Output: 9.50
// ترتيب المراحل

const ChangeDate = (teble, StartDate) => {
  const d3Value = new Date(StartDate); // replace with your D3.Value
  const newData = [...teble];

  newData[0].StartDate = d3Value.toDateString();
  const dataend = new Date(
    d3Value.setDate(d3Value.getDate() + newData[0].Days)
  );
  newData[0].EndDate = dataend.toDateString();
  newData[0].OrderBy = 1;

  for (let i = 1; i < newData.length; i++) {
    newData[i].OrderBy = newData[i - 1].OrderBy + 1;
    newData[i].StartDate = new Date(newData[i - 1].EndDate).toDateString();
    const datanextEnd = new Date(
      d3Value.setDate(
        new Date(newData[i].StartDate).getDate() + newData[i].Days
      )
    );
    newData[i].EndDate = datanextEnd.toDateString();
  }
  return newData;
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

    for (let index = 0; index < newData.length; index++) {
      const item = teble[index];
      let number = types === "new" ? `(${index + 1})` : "";
      await insertTablecompanySubProjectStageCUST([
        item.StageID,
        item.ProjectID,
        item.Type,
        `${item.StageName} ${number}`,
        item.Days,
        item.StartDate,
        item.EndDate,
        item.OrderBy,
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

module.exports = {
  Stage,AccountDays,StageTempletXsl,
  dates,DateDay, convertArabicToEnglish, verificationfromdata,calculateHoursBetween };