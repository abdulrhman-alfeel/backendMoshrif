const { DeleteTableChate } = require("../../sql/delete");
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
  SELECTLastTableChateStage,
  SELECTLastTableChate,
  SELECTLastTableChateStageDontEmpty,
  SELECTLastTableChateTypeDontEmpty,
  SELECTLastTableChateID,
  SELECTTableViewChateUser,
  SELECTLastmassgeuserinchat,
} = require("../../sql/selected/selected");
const {
  ChateNotfication,
  ChateNotficationdelete,
} = require("../notifcation/NotifcationProject");
const { insertPostURL } = require("../postpublic/post");
const { deleteFileSingle } = require("../../middleware/Fsfile");

//   عمليات استقبال وارسال ومشاهدة شات المراحل

// عملية ارسال واستقبال لشات المراحل
const ClassChatOpration = async (Socket, io) => {
  try {
    Socket.on("send_message", async (data) => {
      let result;
      const chackdata = Number(data?.StageID)
        ? await SELECTTableChateStageOtherroad(
            data.idSendr,
            data.Sender,
            "idSendr=? AND Sender=?"
          )
        : await SELECTTableChateStageOtherroad(
            data.idSendr,
            data.Sender,
            "idSendr=? AND Sender=?",
            "Chat"
          );

      if (!chackdata) {
        if (data.kind === "new") {
          const newData = Datadistribution(data);
          if (Number(data?.StageID)) {
            await insertTableChateStage(newData);
            result = await SELECTTableChateStageOtherroad(data.idSendr);
            //  ادخال البيانات جدول البوستات
          } else {
            await insertTableChate(newData);
            result = await SELECTTableChateotherroad(data.idSendr);
          }

          // حذف الملف
          if (Object.keys(data.File).length > 0) {
            deleteFileSingle(data.File.name, "upload", data.File.type);
          }
          // "./upload"

          if (result) {
            if (
              data?.StageID !== "قرارات" &&
              data?.StageID !== "استشارات" &&
              data?.StageID !== "اعتمادات" &&
              data?.StageID !== "تحضير"
            ) {
              await insertPostURL(data);
            }
            result.File = JSON.parse(result.File);
            result.Reply = JSON.parse(result.Reply);
            result.arrived = true;
            result.kind = "new";
            if (data?.StageID !== "تحضير") {
              await ChateNotfication(
                data.ProjectID,
                data?.StageID,
                data.message,
                data.Sender,
                data.Reply,
                data.File
              );
            }
          }
        } else {
          result = await DeleteChatfromdatabaseanddatabaseuser(data);
        }
      } else {
        result = {
          ...chackdata,
          File: JSON.parse(chackdata.File),
          Reply: JSON.parse(chackdata.Reply),
          arrived: true,
          kind: "mssageEnd",
        };
      }

      io.to(`${data.ProjectID}:${data?.StageID}`)
        .timeout(50)
        .emit("received_message", result);
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

// عمليات حذف الرساله
const DeleteChatfromdatabaseanddatabaseuser = async (data) => {
  try {
    const chatID = data.chatID;
    let dataopration = {
      ProjectID: data.ProjectID,
      StageID: data.StageID,
      kind: data.kind,
      chatID: chatID,
    };
    if (Number(data.type)) {
      await DeleteTableChate("ChatSTAGE", chatID);
    } else {
      await DeleteTableChate("Chat", chatID);
    }
    await ChateNotficationdelete(
      data.ProjectID,
      data?.StageID,
      data.message,
      data.Sender,
      chatID
    );
    return dataopration;
  } catch (error) {
    console.log(error);
  }
};

// **************
// جلب الرسائل الناقصة
const ClassChackTableChat = async (req, res) => {
  try {
    const ProjectID = req.query.ProjectID;
    const StageID = req.query.StageID;
    const lengthChat = req.query.lengthChat;
    // const chatID = req.query.chatID;
    const userSession = req.session.user;

    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
    }
    let arrayResult = [];
    //  جلب طول البيانات
    const Listchat = Number(StageID)
      ? await SELECTLastmassgeuserinchat(
          ProjectID,
          StageID,
          userSession.userName
        )
      : await SELECTLastmassgeuserinchat(
          ProjectID,
          StageID,
          userSession.userName,
          "Chat"
        );
    console.log(Listchat, "massage new ");
    // جلب البيانات
    let result;
    if (Listchat.last_id !== null && lengthChat > 0) {
      result = Number(StageID)
        ? await SELECTLastTableChateStageDontEmpty(
            ProjectID,
            StageID,
            Listchat?.last_id
          )
        : await SELECTLastTableChateTypeDontEmpty(
            ProjectID,
            StageID,
            Listchat?.last_id
          );
    } else {
      result = Number(StageID)
        ? await SELECTLastTableChateStage(ProjectID, StageID, 80)
        : await SELECTLastTableChate(ProjectID, StageID, 80);
      // console.log(result)
    }
    // فرز البيانات
    if (result?.length > 0 && result !== undefined) {
      for (let index = 0; index < result.length; index++) {
        const element = result[index];
        element.File = JSON.parse(element.File);
        element.Reply = JSON.parse(element.Reply);
        arrayResult.push(element);
      }
    }
    // ارسال البيانات
    res.send({ success: true, data: arrayResult }).status(200);
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

    if (data?.length === 0) {
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
