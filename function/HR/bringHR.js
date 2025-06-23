
const {
  SELECTTABLEHR,
  SELECTTABLEObjectHR,
} = require("../../sql/selected/selectuser");
const { v4: uuidv4 } = require("uuid");

const BringHR = () => {
  return async (req, res) => {
    try {
      const { IDCompany, Dateday, LastID } = req.query; // Get parameters from request body
      // Simulate fetching HR data
      const hrData = await SELECTTABLEHR(IDCompany, Dateday, LastID);
      // Send the HR data as a response
      res.status(200).send({ success: true, data: hrData });
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
      const { IDCompany, Dateday, LastID, userName } = req.query; // Get parameters from request body
      // Simulate fetching HR data
      const hrData = await SELECTTABLEHR(
        IDCompany,
        Dateday,
        LastID,
        `AND us.userName=${userName}`
      );

      // Send the HR data as a response
      res.status(200).send({ success: true, data: hrData });
    } catch (error) {
      console.error("Error fetching HR data:", error);
      res
        .status(500)
        .send({ success: false, message: "Failed to fetch HR data" });
    }
  };
};
const { GoogleAuth } = require("google-auth-library");

const Userverification = () => {
  return async (req, res) => {
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
    }

    const dates = (time) => String(time).length > 1 ? time :`0${time}`;
    try {
      const { type } = req.query; // Get parameters from request body
      const date = new Date();
      const Dateday = `${date.getUTCFullYear()}-${dates(
        date.getUTCMonth() + 1
      )}-${dates(date.getUTCDate())}`;
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
          ?!hrData || hrData?.CheckIntime === null
          :hrData?.CheckIntime !== null && hrData?.CheckOUTtime === null;
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
      let message = type === 'CheckOut' && !success ? 'يجب تحضير الدخول اولاً' :"تم التحضير من قبل";
      res.status(200).send({
        success: success,
        token: accessToken, 
        nameFile: uniqueFileName,
        message:message
      });
    } catch (error) {
      console.error("Error fetching HR data:", error);
      res
        .status(500)
        .send({ success: false, message: "Failed to fetch HR data" });
    }
  };
};

module.exports = { BringHR, SearchHR, Userverification };
