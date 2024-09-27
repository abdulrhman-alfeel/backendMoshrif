const { massges } = require("../../middleware/sendNotification");
const {
  SELECTTablecompanySubProjectLast_id,
  SELECTTablecompanySubProjectStageNotesOneObject,
  SELECTTablecompanySubProjectStageCUSTONe,
  SELECTProjectStartdate,
  SELECTTablecompanySubProjectStagesSub,
  SELECTTablecompanySubProjectfornotification,
  SELECTTablecompanySubProjectfornotificationEdit,
  SELECTDataPrivatPost,
} = require("../../sql/selected/selected");
const {
  SELECTTableusersCompanySub,
  SELECTTableLoginActivatActivaty,
} = require("../../sql/selected/selectuser");

const Projectinsert = async (IDcompanySub, userName, type = "إنشاء") => {
  try {
    let result = await SELECTTablecompanySubProjectLast_id(
      IDcompanySub,
      "max",
      type === "إنشاء" ? "RE.id" : "ca.id"
    );

    const { token, users } = await BringtokenuserCustom(
      IDcompanySub,
      userName,
      "all",
      "project"
    );

    const notification = {
      title: `${type} مشروع ${type === "إنشاء" ? "جديد" : result.Nameproject}`,
      body: `  لقد قام  ${userName} ب${type}  مشروع  ${
        type === "إنشاء" ? "جديد" : result.Nameproject
      } `,
      //   image: 'https://storage.googleapis.com/demo_backendmoshrif_bucket-2/Vector.png',
    };
    const notification_type = "Public";
    const navigationId = `${users[0].IDcompany}:${IDcompanySub}:${users[0].NameSub}:${users[0].PhoneNumber}:${users[0].Email}`;
    const data = {
      userName: userName,
      type: `companySubprojects ${type}`,
      data: result,
    };
    await massges(token, notification, notification_type, navigationId, data);
  } catch (error) {
    console.log(error);
  }
};
const Stageinsert = async (
  ProjectID,
  StageID = 0,
  userName,
  type = "إنشاء"
) => {
  try {
    let result = await SELECTTablecompanySubProjectStageCUSTONe(
      ProjectID,
      StageID,
      "notifcation",
      type === "إنشاء" ? "cu.projectID=?" : "cu.projectID=? AND cu.StageID=?"
    );
    const Project = await SELECTProjectStartdate(ProjectID);
    let resultObject = {};

    let resultnew = Object.entries(result).filter(
      ([key, value]) => key !== "Nameproject" && key !== "IDcompanySub"
    );
    await Promise.all(
      resultnew.map((item, index) => {
        resultObject[item[0]] = item[1];
      })
    );

    const { token } = await BringtokenuserCustom(ProjectID, userName, "Stage");

    const notification = {
      title: `${type} مرحلة ${
        type === "إنشاء" ? "جديد" : "في" + result.Nameproject
      }`,
      body: `  لقد قام  ${userName} ب${type}  مرحلة ${
        type === "إنشاء" ? "جديد" : ""
      }   في مشروع  "${result.Nameproject}"  `,
      //   image: 'https://storage.googleapis.com/demo_backendmoshrif_bucket-2/Vector.png',
    };
    const notification_type = "PageHomeProject";
    const navigationId = `${result.IDcompanySub}:${JSON.stringify(Project)}`;
    const data = {
      userName: userName,
      ProjectID:ProjectID,
      type: `StagesCUST ${type}`,
      data: resultObject,
    };
    await massges(token, notification, notification_type, navigationId, data);
  } catch (error) {
    console.log(error);
  }
};

const StageSubinsert = async (
  ProjectID,
  StageID = 0,
  userName,
  type = "إنشاء"
) => {
  try {
    let result = await SELECTTablecompanySubProjectStagesSub(
      ProjectID,
      StageID,
      "notification",
      type === "إنشاء"
        ? "su.StagHOMID=? AND su.ProjectID=?"
        : "su.StageSubID = ?"
    );
    const ProjecHome = await SELECTTablecompanySubProjectStageCUSTONe(
      ProjectID,
      StageID
    );
    let resultObject = {};

    let resultnew = Object.entries(result[0]).filter(
      ([key, value]) =>
        key !== "Nameproject" &&
        key !== "StageName" &&
        (key !== "ProjectID") & (key !== "StageID")
    );
    await Promise.all(
      resultnew.map((item, index) => {
        resultObject[item[0]] = item[1];
      })
    );
    const { token } = await BringtokenuserCustom(ProjectID, userName, "Stage");
    const notification = {
      title: `${type} مرحلة فرعية ${
        type === "إنشاء" ? "جديد" : "في " + result[0].StageName
      }`,
      body: `  لقد قام  ${userName} ب${type}  مرحلة ${
        type === "إنشاء" ? "جديد" : ""
      }   في مشروع  "${result[0].Nameproject}"   في مرحلة${
        result[0].StageName
      }`,
      //   image: 'https://storage.googleapis.com/demo_backendmoshrif_bucket-2/Vector.png',
    };
    const notification_type = "PageHomeProject";
    const navigationId = `${result.IDcompanySub}:${JSON.stringify(ProjecHome)}`;
    const data = {
      userName: userName,
      ProjectID:ProjectID,
      type: `StagesSub ${type}`,
      data: resultObject,
    };
    await massges(token, notification, notification_type, navigationId, data);
  } catch (error) {
    console.log(error);
  }
};
const StageSubNote = async (
  ProjectID,
  StageID,
  StageSubID,
  note,
  userName,
  type = "اضاف"
) => {
  try {
    let result = await SELECTTablecompanySubProjectStagesSub(
      StageSubID,
      StageID,
      "notification",
      "su.StageSubID = ?"
    );
    const ProjecHome = await SELECTTablecompanySubProjectStageCUSTONe(
      ProjectID,
      StageID
    );
    let resultObject = {};

    let resultnew = Object.entries(result[0]).filter(
      ([key, value]) =>
        key !== "Nameproject" &&
        key !== "StageName" &&
        (key !== "ProjectID") && (key !== "StageID") && key !== 'IDcompanySub'
    );
    await Promise.all(
      resultnew.map((item, index) => {
        resultObject[item[0]] = item[1];
      })
    );
    const { token } = await BringtokenuserCustom(ProjectID, userName, "Stage");
    const notification = {
      title: `قام  ${userName} ب${type}  ملاحظة `,
      body: note,
      //   image: 'https://storage.googleapis.com/demo_backendmoshrif_bucket-2/Vector.png',
    };
    const notification_type = "Phase";
    const navigationId = `${JSON.stringify(ProjecHome)}`;
    const data = {
      userName:userName,
      ProjectID:ProjectID,
      type: `StagesSub ${type}`,
      data: resultObject,
    };
    await massges(token, notification, notification_type, navigationId, data);
  } catch (error) {
    console.log(error);
  }
};
const CloseOROpenStagenotifcation = async (
  ProjectID,
  StageID,
  userName,
  type = "اغلاق"
) => {
  try {
    const ProjecHome = await SELECTTablecompanySubProjectStageCUSTONe(
      ProjectID,
      StageID
    );

    const { token } = await BringtokenuserCustom(ProjectID, userName, "Stage");
    const notification = {
      title: `قام  ${userName} ب${type}  المرحلة `,
      body: `قام  ${userName} ب${type}  مرحلة  ${ProjecHome.StageName}`,
      //   image: 'https://storage.googleapis.com/demo_backendmoshrif_bucket-2/Vector.png',
    };
    const notification_type = "PageHomeProject";
    const navigationId = `${ProjecHome.IDcompanySub}:${JSON.stringify(ProjecHome)}`;
    const data = {
      userName:userName,
      ProjectID:ProjectID,
      type: `StagesCUST ${type}`,
    };
    await massges(token, notification, notification_type, navigationId, data);
  } catch (error) {
    console.log(error);
  }
};
const AchievmentStageSubNote = async (StageSubID, userName, type = "إنجاز") => {
  try {
    let result = await SELECTTablecompanySubProjectStagesSub(
      StageSubID,
      0,
      "notification",
      "su.StageSubID = ?"
    );
    const ProjecHome = await SELECTTablecompanySubProjectStageCUSTONe(
      result[0].ProjectID,
      result[0].StageID
    );
    let resultObject = {};

    let resultnew = Object.entries(result[0]).filter(
      ([key, value]) =>
        key !== "Nameproject" &&
        key !== "StageName" &&
        (key !== "ProjectID") & (key !== "StageID")
    );
    await Promise.all(
      resultnew.map((item, index) => {
        resultObject[item[0]] = item[1];
      })
    );
    const { token } = await BringtokenuserCustom(
      result[0].ProjectID,
      userName,
      "Stage"
    );
    const notification = {
      title: `قام  ${userName} ب${type}  المرحلة الفرعية `,
      body: `قام  ${userName} ب${type}  المرحلة الفرعية  ${result[0].StageSubName}`,
      //   image: 'https://storage.googleapis.com/demo_backendmoshrif_bucket-2/Vector.png',
    };
    const notification_type = "Phase";
    const navigationId = `${JSON.stringify(ProjecHome)}`;
    const data = {
      userName:userName,
      ProjectID:result[0].ProjectID,
      type: `StagesSub ${type}`,
      data: resultObject,
    };
    await massges(token, notification, notification_type, navigationId, data);
  } catch (error) {
    console.log(error);
  }
};

const Delayinsert = async (idProject, StageID, userName, type = "إضافة") => {
  try {
    let resultObject = {};
    let result = await SELECTTablecompanySubProjectStageNotesOneObject(
      type === "إضافة" ? [idProject, StageID] : [idProject],
      type === "تعديل"
        ? "sn.StageNoteID=?"
        : "sn.StagHOMID=? AND sn.ProjectID=?"
    );
    let resultnew = Object.entries(result).filter(
      ([key, value]) =>
        key !== "Nameproject" && key !== "StageName" && key !== "last_id"
    );
    await Promise.all(
      resultnew.map((item, index) => {
        resultObject[item[0]] = item[1];
      })
    );

    const { token } = await BringtokenuserCustom(idProject, userName, "Delay");
    console.log(token,'kkkkkkkkkkkkk');
    const notification = {
      title: `${type} تأخيرات ${type === "إضافة" ? "جديد" : ""}`,
      body: `  لقد قام  ${userName} ب${type}  تأخيرات  ${
        type === "إضافة" ? "جديد" : ""
      }  في مرحلة  " ${result.StageName}" من مشروع "${result.Nameproject}"`,
      image:
        resultObject.ImageAttachment !== null
          ? `https://storage.googleapis.com/demo_backendmoshrif_bucket-2/${resultObject.ImageAttachment}`
          : null,
    };
    const notification_type = "Delays";
    const navigationId = `${resultObject.ProjectID}:${resultObject.StagHOMID}`;
    const data = {
      userName:userName,
      ProjectID:resultObject.ProjectID,
      type: `Delays ${type}`,
      data: resultObject,
    };
    await massges(token, notification, notification_type, navigationId, data);
  } catch (error) {
    console.log(error);
  }
};

const RearrangeStageProject = async (idProject, userName) => {
  try {
    let result = await SELECTTablecompanySubProjectStageCUSTONe(
      idProject,
      0,
      "notifcation",
      "cu.projectID=?"
    );
    let resultObject = {};
    let resultnew = Object.entries(result).filter(
      ([key, value]) => key !== "Nameproject" && key !== "IDcompanySub"
    );
    await Promise.all(
      resultnew.map((item, index) => {
        resultObject[item[0]] = item[1];
      })
    );
    const { token } = await BringtokenuserCustom(idProject, userName, "Delay");
    const notification = {
      title: `إعادة ترتيب المراحل `,
      body: `  لقد قام  ${userName} بإعادة ترتيب مراحل مشروع "${result.Nameproject}"`,
    };
    const notification_type = "PageHomeProject";
    const navigationId = `${result.IDcompanySub}:${JSON.stringify(resultnew)}`;
    const data = {
      userName:userName,
      ProjectID:idProject,
      type: `RearrangeStageProject`,
    };
    await massges(token, notification, notification_type, navigationId, data);
  } catch (error) {
    console.log(error);
  }
};
//  اشعارات المالية والطالبات
const Financeinsertnotification = async (
  projectID,
  kind = "مصروفات",
  type = "إضافة",
  userName,
  idEdit = null
) => {
  try {
    let stringSql =
      kind === "مصروفات"
        ? "Expense"
        : kind === "مرتجعات"
        ? "Returns"
        : kind === "عهد"
        ? "Revenue"
        : "Requests";
    let resultObject = {};
    let result =
      idEdit === null
        ? await SELECTTablecompanySubProjectfornotification(
            projectID,
            stringSql
          )
        : await SELECTTablecompanySubProjectfornotificationEdit(
            idEdit,
            stringSql,
            kind === "مصروفات"
              ? "Expenseid"
              : kind === "مرتجعات"
              ? "ReturnsId"
              : kind === "عهد"
              ? "RevenueId"
              : "RequestsID"
          );

    let resultnew = Object.entries(result).filter(
      ([key, value]) => key !== "Nameproject"
    );
    await Promise.all(
      resultnew.map((item, index) => {
        resultObject[item[0]] = item[1];
      })
    );

    const { token } = await BringtokenuserCustom(
      result.projectID,
      userName,
      "Finance"
    );
    console.log(token, result);
    const notification = {
      title: `${type} ${kind} ${type === "إضافة" ? "جديد" : ""}`,
      body: `  لقد قام  ${userName} ب${type}  ${kind}  ${
        type === "إضافة" ? "جديد" : ""
      }  في مشروع "${result.Nameproject}" <<${result.Data}>>`,
    };
    const notification_type = "Finance";
    const navigationId = `${result.projectID}`;
    const data = {
      ProjectID:result.projectID,
      userName:userName,
      kind: kind,
      type: type,
      data: resultObject,
    };
    await massges(token, notification, notification_type, navigationId, data);
  } catch (error) {
    console.log(error);
  }
};

// اشعارات التعليقات والاعجابات
const Postsnotification = async (
  PostID,
  type,
  userName,
  kind = "تعليق",
  idEdit = null
) => {
  try {
    const result = await SELECTDataPrivatPost(PostID, type, idEdit);

    let resultObject = {};
    let resultnew = Object.entries(result).filter(
      ([key, value]) => key !== "ProjectID" && key !== "postBy"
    );
    await Promise.all(
      resultnew.map((item, index) => {
        resultObject[item[0]] = item[1];
      })
    );
    const { token } = await Bringtokenuser(
      result.ProjectID,
      result.userName,
      "PublicationsBransh"
    );
    let string =
      kind === "تعليق" && type === "Comment"
        ? "جديد"
        : type !== "Comment"
        ? kind === "اعجاب" && type === "Likes"
          ? "منشور"
          : " الاعجاب بمنشور"
        : "";
    let comment = type === "Comment" ? `<<${result.commentText}>>` : "";
    const notification = {
      title: `${kind}  ${string}  `,
      body: `لقد قام  ${result.userName} ب${kind}  ${string} ${
        idEdit === null ? result.postBy : ""
      }  ${comment} `,
    };
    const notification_type = "PublicationsBransh";
    const navigationId = `${result.ProjectID}`;
    const data = {
      ProjectID:result.ProjectID,
      userName:userName,
      kind: kind,
      type: type,
      data: resultObject,
    };
    await massges(token, notification, notification_type, navigationId, data);
  } catch (error) {
    console.log(error);
  }
};

//  اشعارات الدردشة

const ChateNotfication = async (
  idProject,
  StageID,
  massgs,
  userName = "",
  Reply = {},
  File = {}
) => {
  try {
    let nameChate;
    if (Number(StageID)) {
      const Stage = await SELECTTablecompanySubProjectStageCUSTONe(
        idProject,
        StageID
      );
      nameChate = Stage.StageName;
    } else {
      nameChate = StageID;
    }
    const Project = await SELECTProjectStartdate(idProject);
    const { token } = await BringtokenuserCustom(idProject, userName, "chate");
    let title =
      Object.entries(Reply).length <= 0
        ? userName
        : `لقد قام ${userName} بالرد على رسالة ${Reply.Sender}`;
    const notification_type = "chate";
    const navigationId = `${idProject}:${StageID}`;
    let image = null;

    // استخراج الصورة الذي ارسلت إذا وجدت
    if (Object.entries(File).length > 0) {
      if (File.type === "video/mp4") {
        image = String(File.name).replace("mp4", "png");
      } else {
        image = File.name;
      }
    }

    if (image !== null) {
      image = `https://storage.googleapis.com/demo_backendmoshrif_bucket-2/${image}`;
    }

    //   image: 'https://storage.googleapis.com/demo_backendmoshrif_bucket-2/Vector.png',

    const notification = {
      title: title,
      // body: `في غرفة دردشة مشروع ${Project.Nameproject} قسم ${nameChate}  `  +`< ${massgs} >`,
      body:
        ` دردشة مشروع ${Project.Nameproject} قسم ${nameChate}  ` +
        `< ${massgs} >`,
      image: image,
    };
    const data = {
      ProjectID:idProject,
      userName:userName,
      type: `chate`,
    };
    await massges(token, notification, notification_type, navigationId, data);
  } catch (error) {
    console.log(error);
  }
};

// ChateNotfication(1,'طلبات','كيف الحال');

// اشعارات اضافة مستخدم او حذفة

const AddOrUpdatuser = async (PhoneNumber, Validity, type, userName) => {
  try {
    const result = await SELECTTableLoginActivatActivaty(PhoneNumber);
    console.log(result.token);
    const notification = {
      title: type,
      // body: `في غرفة دردشة مشروع ${Project.Nameproject} قسم ${nameChate}  `  +`< ${massgs} >`,
      // body:` ${type}لقد قام ${userName} ب`,
      body: ` لقد قام ${userName} ب${type}`,
    };
    const data = {
      userName:userName,
      type: `user`,
      data: Validity,
    };
    await massges([result.token], notification, "", "", data);
  } catch (error) {
    console.log(error);
  }
};

// bring token all users
const Bringtokenuser = async (ProjectID, userName, type = "all") => {
  let token = [];
  const users = await SELECTTableusersCompanySub(ProjectID, type);
  await Promise.all(
    users
      .filter((pic) => pic.userName !== userName)
      .map((item, index) => {
        token.push(item.token);
      })
  );
  return { token, users };
};

// bring token custom users
const BringtokenuserCustom = async (
  ProjectID,
  userName,
  type = "all",
  kind = "sub"
) => {
  let token = [];
  const users = await SELECTTableusersCompanySub(ProjectID, type);
  // console.log(users);
  await Promise.all(
    users
      .filter((pic) => pic.userName !== userName)
      .map((item, index) => {
        if (item.job === "Admin") {
          token.push(item.token);
        } else {
          const Validity =
            item.Validity !== null ? JSON.parse(item.Validity) : [];
          for (let index = 0; index < Validity.length; index++) {
            const element = Validity[index];
            if (element.idBrinsh === item.IDcompanySub) {
              if (element.job === "مدير الفرع" || kind !== "sub") {
                token.push(item.token);
              } else {
                for (let P = 0; P < element.project.length; P++) {
                  const elementProject = element.project[P];
                  if (elementProject.idProject === ProjectID) {
                    token.push(item.token);
                  }
                }
              }
            }
          }
        }
      })
  );
  // console.log(token);
  return { token, users };
};

// Projectinsert(1);

module.exports = {
  Projectinsert,
  Delayinsert,
  Stageinsert,
  StageSubinsert,
  StageSubNote,
  AchievmentStageSubNote,
  RearrangeStageProject,
  CloseOROpenStagenotifcation,
  ChateNotfication,
  Financeinsertnotification,
  Postsnotification,
  AddOrUpdatuser,
};
