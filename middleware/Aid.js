const { isEmpty } = require("bullmq");

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


module.exports = {dates,DateDay, convertArabicToEnglish, verificationfromdata,calculateHoursBetween };