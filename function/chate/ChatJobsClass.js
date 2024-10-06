
const {
  insertTableChate,
  insertTableChateStage,
  insertTableViewsChateStage,
  insertTableViewsChate,
} = require("../../sql/INsertteble");
const {
  SELECTTableChateStageOtherroad,
  SELECTTableViewChateStage,
  SELECTTableChateotherroad,
  SELECTTableViewChate,
  SELECTLengthTableChateStage,
  SELECTLastTableChateStage,
  SELECTLengthTableChate,
  SELECTLastTableChate,
  SELECTLastTableChateStageDontEmpty,
  SELECTLastTableChateTypeDontEmpty,
  SELECTLastTableChateID,
  SELECTTableViewChateUser,
} = require("../../sql/selected/selected");
const { ChateNotfication } = require("../notifcation/NotifcationProject");
const { insertPostURL } = require("../postpublic/post");
const time = require("./TIME.JS");

let arra = [];
let arrachat = [];
//   عمليات استقبال وارسال ومشاهدة شات المراحل

// عملية ارسال واستقبال لشات المراحل
const ClassChatOpration = async (Socket, io) => {
  try {
    Socket.on("send_message", async (data) => {
      let result;
      const newData = Datadistribution(data);
      // console.log(data);
      // console.log(data?.StageID,'undfind')
      if (Number(data?.StageID)) {
        await insertTableChateStage(newData);
        result = await SELECTTableChateStageOtherroad(data.idSendr);
        //  ادخال البيانات جدول البوستات
      } else {
        await insertTableChate(newData);
        result = await SELECTTableChateotherroad(data.idSendr);
      }
      await insertPostURL(data);
      // console.log(result)
      result.File = JSON.parse(result.File);
      result.Reply = JSON.parse(result.Reply);
      result.arrived = true;
      io.to(`${data.ProjectID}:${data?.StageID}`)
        .timeout(50)
        .emit("received_message", result);
      await ChateNotfication(
        data.ProjectID,
        data?.StageID,
        data.message,
        data.Sender,
        data.Reply,
        data.File
      );
    });
  } catch (err) {
    // console.log(err.message);
  }
};

const Oprationditals = async (data) => {
  let result;
  const newData = Datadistribution(data);
  // console.log(newData);
  if (Number(data?.StageID)) {
    await insertTableChateStage(newData);
    result = await SELECTTableChateStageOtherroad(data.idSendr);
    //  ادخال البيانات جدول البوستات
    insertPostURL(data);
  } else {
    await insertTableChate(newData);
    result = await SELECTTableChateotherroad(data.idSendr);
  }
  // console.log(result)
  result.File = JSON.parse(result.File);
  result.Reply = JSON.parse(result.Reply);
  result.arrived = true;
  return result;
};
const Datadistribution = (data) => {
  try {
    let newData = [
      data.idSendr,
      data?.StageID,
      data.ProjectID,
      data.Sender,
      data.message,
      `${new Date().toUTCString()}`,
      JSON.stringify(data.File),
      JSON.stringify(data.Reply),
    ];
    return newData;
  } catch (err) {
    // console.log(err.message);
  }
};

let ViewArray = [];

// **************

const ClassChackTableChat = async (req, res) => {
  try {
    const ProjectID = req.query.ProjectID;
    const StageID = req.query.StageID;
    const lengthChat = req.query.lengthChat;
    const chatID = req.query.chatID;

    let arrayResult = [];
    //  جلب طول البيانات
    const count = Number(StageID)
      ? await SELECTLengthTableChateStage(ProjectID, StageID)
      : await SELECTLengthTableChate(ProjectID, StageID);

    if (count > lengthChat) {
      const number = count - lengthChat;
      if (number > 0) {
        let Total = number > 80 ? 80 : number;
        // console.log(Total)
        // جلب البيانات
        let result;
        if (lengthChat > 0) {
          result = Number(StageID)
            ? await SELECTLastTableChateStageDontEmpty(
                ProjectID,
                StageID,
                chatID
              )
            : await SELECTLastTableChateTypeDontEmpty(
                ProjectID,
                StageID,
                chatID
              );
          // console.log(count,lengthChat,number,result,'kkklklllllllllllllllll')
        } else {
          result = Number(StageID)
            ? await SELECTLastTableChateStage(ProjectID, StageID, Total)
            : await SELECTLastTableChate(ProjectID, StageID, Total);
          // console.log(result)
        }

        // فرز البيانات
        for (let index = 0; index < result.length; index++) {
          const element = result[index];
          element.File = JSON.parse(element.File);
          element.Reply = JSON.parse(element.Reply);
          arrayResult.push(element);
        }

        // ارسال البيانات
        res.send({ success: true, data: arrayResult }).status(200);
      }
    } else {
      res.send({ success: false, data: [] }).status(201);
    }
  } catch (err) {
    console.log(err);
    res.send({ success: false }).status(400);
  }
};

// عملية مشاهدة لرسائل شات
const ClassChatOprationView = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result;
      if (Number(data.type)) {
        result = await SELECTTableViewChateStage(data.chatID);
      } else {
        result = await SELECTTableViewChate(data.chatID);
      }
      const view = result?.find(
        (item) => item.userName === data.userName && item.chatID === data.chatID
      );
      if (!view) {
        if (Number(data.type)) {
          await insertTableViewsChateStage([data.chatID, data.userName]);
        } else {
          await insertTableViewsChate([data.chatID, data.userName]);
        }
        result = await verification(data);
        resolve(result);
      }
    } catch (err) {
      // console.log(err);
    }
  });
};
//  لطلب المشاهدات الناقسة للرسالة
const ClassViewChat = async (req, res) => {
  const type = req.query.type;
  const chatID = req.query.chatID;
  const data = { chatID: chatID, type: type };

  const result = await verification(data);

  res.send({ success: true, data: result }).status(200);
};

//  لاستقبال مشاهدات الرسائل
const ClassreceiveMessageViews = async (req, res) => {
  // console.log('helllow')
  const userName = req.body.userName;
  const ProjectID = req.body.ProjectID;
  const type = req.body.type;
  const result = await SELECTLastTableChateID(ProjectID, type, userName);
  for (let index = 0; index < result.length; index++) {
    const element = result[index];
    const data = await SELECTTableViewChateUser(element.chatID, userName, type);

    if (data.length === 0) {
      const viewSend = {
        ProjectID: ProjectID,
        chatID: element.chatID,
        userName: userName,
        Date: new Date(),
        type: type,
      };

      await ClassChatOprationView(viewSend);
    }
  }
  res.status(200).send("Message views updated successfully");
};

const verification = async (data) => {
  let result;
  try {
    if (Number(data.type)) {
      result = await SELECTTableViewChateStage(data.chatID);
    } else {
      result = await SELECTTableViewChate(data.chatID);
    }
    // console.log(result, "hhhhhhhhhhhhhhhh");

    return result;
  } catch (err) {
    // console.log(err);
  }
};

module.exports = {
  ClassChatOpration,
  ClassChatOprationView,
  ClassChackTableChat,
  Oprationditals,
  ClassViewChat,
  ClassreceiveMessageViews,
};
