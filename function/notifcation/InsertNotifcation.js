const { massges } = require("../../middleware/sendNotification");
const { DeleteTableNotifcation } = require("../../sql/delete");
const { insertTableNavigation } = require("../../sql/INsertteble");
const {
  SELECTTableIDcompanytoPost,
  SELECTTableNavigation,
  SELECTTableNavigationObjectOne,
  SelectVerifycompanyexistence,
} = require("../../sql/selected/selected");

const InsertNotifcation = async (
  token,
  notification,
  notification_type,
  navigationId,
  data,
  id,
  type = "pr.id",
  select = "pr.id"
) => {
  try {
    // await DeleteTableNotifcation();
    let result;
    if (type === true) {
      result = await SelectVerifycompanyexistence(id);
    } else {
      result = await SELECTTableIDcompanytoPost(id, type, select);
    }
    const endData = [
      type === true ? result?.id : result?.NumberCompany,
      type === true ? id : result?.id,
      JSON.stringify(notification),
      token.length > 0 ? JSON.stringify(token) : null,
      JSON.stringify({
        notification_type: notification_type,
        navigationId: navigationId,
        data: JSON.stringify(data),
      }),
      new Date().toUTCString(),
    ];
    await insertTableNavigation(endData);
    const maxData = await SELECTTableNavigationObjectOne(id);
    return maxData?.id;
  } catch (error) {
    console.log(error);
  }
};

// جلب بيانات الاشعارات لليوم
const BringDataNotifcation = async (req, res) => {
  try {
    const LastID = req.query.LastID;
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
    }
    const result = await SELECTTableNavigation([parseInt(LastID)]);
    
    const arrayNotifcation = await Sortdatauserfromnotification(result,userSession.userName);
    res
      .send({ success: "تمت العملية بنجاح", data: arrayNotifcation })
      .status(200);
  } catch (error) {
    console.log(error);
    res.send({ success: "فشل تنفيذ العملية العملية بنجاح" }).status(401);
  }
};


// جلب بيانات الاشعارات حسب الفلتر
const FilterNotifcation = async (req, res) =>{
  try{
    try {
      const {LastID,from,to} = req.query;
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      const result = await SELECTTableNavigation([parseInt(LastID),from,to],`Date(DateDay) BETWEEN ?  AND ?`);
      const arrayNotifcation = await Sortdatauserfromnotification(result,userSession.userName);
      res
        .send({ success: "تمت العملية بنجاح", data: arrayNotifcation })
        .status(200);
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل تنفيذ العملية العملية بنجاح" }).status(401);
    }
  }catch(error){
    console.log(error);
  }
}

const Sortdatauserfromnotification = (result,userName) =>{
  let arrayNotifcation = [];
  if (result.length > 0) {
    
    result.forEach(async (pic) => {
      // console.log(pic.tokens, userSession?.IDCompany);

      let Token = pic.tokens ? JSON.parse(pic.tokens) : [];
      // console.log(pic,Token);
      Token.forEach(async (item) => {
        if (item === userName) {
          const dataNotifction = JSON.parse(pic.data);
          arrayNotifcation.push({
            notification: JSON.parse(pic.notification),
            data: {
              id: pic.id,
              Date: pic.Date,
              notification_type: dataNotifction?.notification_type,
              navigationId: dataNotifction?.navigationId,
              data: JSON.stringify(dataNotifction?.data),
            },
          });
        }
      });
    });
  }
  return arrayNotifcation
}

module.exports = { InsertNotifcation, BringDataNotifcation , FilterNotifcation };
