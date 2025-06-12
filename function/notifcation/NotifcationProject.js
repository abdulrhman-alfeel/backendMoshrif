const { massges } = require("../../middleware/sendNotification");
const { insertTableNavigation } = require("../../sql/INsertteble");
const {
  SELECTTablecompanySubProjectLast_id,
  SELECTTablecompanySubProjectStageNotesOneObject,
  SELECTTablecompanySubProjectStageCUSTONe,
  SELECTProjectStartdate,
  SELECTTablecompanySubProjectStagesSub,
  SELECTTablecompanySubProjectfornotification,
  SELECTTablecompanySubProjectfornotificationEdit,
  SELECTDataPrivatPost,
  SELECTCOUNTCOMMENTANDLIKPOST,
  SELECTDataPrivatPostonObject,
  SELECTTableMaxFinancialCustody,
  SelectVerifycompanyexistence,
} = require("../../sql/selected/selected");
const {
  SELECTTableusersCompanySub,
  SELECTTableLoginActivatActivaty,
} = require("../../sql/selected/selectuser");
const { UpdateTableLoginActivatyValidityORtoken } = require("../../sql/update");
const { InsertNotifcation } = require("./InsertNotifcation");

const Projectinsert = async (IDcompanySub, userName, type = "إنشاء") => {
  try {
    let result = await SELECTTablecompanySubProjectLast_id(
      IDcompanySub,
      "max",
      type === "إنشاء" ? "RE.id" : "ca.id"
    );

    const { token, users, arraynameuser,jobUser } = await BringtokenuserCustom(
      result.NumberCompany,
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
    const navigationId = `${users[0]?.IDcompany}:${IDcompanySub}:${users[0].NameSub}:${users[0].PhoneNumber}:${users[0].Email}`;
    let data = {
      userName: userName,
      type: `companySubprojects ${type}`,
      data: result,
      NameSub: users[0].NameSub,
      IDcompany: users[0].IDcompany,
      IDcompanySub: IDcompanySub,
      PhoneNumber: users[0].PhoneNumber,
      Email: users[0].Email,
      jobUser:jobUser
    };
    const idmax = await InsertNotifcation(
      arraynameuser,
      notification,
      notification_type,
      navigationId,
      data,
      IDcompanySub,
      "su.id",
      "max(pr.id) AS id"
    );
    data = {
      ...data,
      id: idmax,
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

    const { token, arraynameuser,jobUser } = await BringtokenuserCustom(
      result.NumberCompany,
      ProjectID,
      userName,
      "Stage"
    );

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
    let data = {
      userName: userName,
      ProjectID: ProjectID,
      type: `StagesCUST ${type}`,
      data: resultObject,
      IDcompanySub: result.IDcompanySub,
      Project: Project,
      jobUser:jobUser
    };
    const idmax = await InsertNotifcation(
      arraynameuser,
      notification,
      notification_type,
      navigationId,
      data,
      ProjectID,
      "pr.id"
    );
    data = {
      ...data,
      id: idmax,
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
    const { token, arraynameuser,jobUser } = await BringtokenuserCustom(
      ProjecHome.NumberCompany,
      ProjectID,
      userName,
      "Stage"
    );
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
    let data = {
      userName: userName,
      ProjectID: ProjectID,
      type: `StagesSub ${type}`,
      data: resultObject,
      IDcompanySub: result.IDcompanySub,
      jobUser:jobUser
    };
    const idmax = await InsertNotifcation(
      arraynameuser,
      notification,
      notification_type,
      navigationId,
      data,
      ProjectID,
      "pr.id"
    );
    data = {
      ...data,
      id: idmax,
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
        key !== "ProjectID" &&
        key !== "StageID" &&
        key !== "IDcompanySub"
    );
    await Promise.all(
      resultnew.map((item, index) => {
        resultObject[item[0]] = item[1];
      })
    );
    const { token, jobUser } = await BringtokenuserCustom(
      ProjecHome.NumberCompany, 
      ProjectID,
      userName,
      "Stage"
    );
    const notification = {
      title: `قام  ${userName} ب${type}  ملاحظة `,
      body: note,
      //   image: 'https://storage.googleapis.com/demo_backendmoshrif_bucket-2/Vector.png',
    };
    const notification_type = "Phase";
    const navigationId = `${JSON.stringify(ProjecHome)}`;
    let data = {
      userName: userName,
      ProjectID: ProjectID,
      type: `StagesSub ${type}`,
      data: resultObject,
      IDcompanySub: result[0].IDcompanySub,
      jobUser:jobUser
    };
    // const idmax = await InsertNotifcation(
    //   arraynameuser,
    //   notification,
    //   notification_type,
    //   navigationId,
    //   data,
    //   ProjectID
    // );
    // data = {
    //   ...data,
    //   id: idmax,
    // };
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

    const { token, arraynameuser,jobUser } = await BringtokenuserCustom(
      ProjecHome.NumberCompany,
      ProjectID,
      userName,
      "Stage"
    );
    const notification = {
      title: `قام  ${userName} ب${type}  المرحلة `,
      body: `قام  ${userName} ب${type}  مرحلة  ${ProjecHome.StageName}`,
      //   image: 'https://storage.googleapis.com/demo_backendmoshrif_bucket-2/Vector.png',
    };
    const notification_type = "PageHomeProject";
    const navigationId = `${ProjecHome.IDcompanySub}:${JSON.stringify(
      ProjecHome
    )}`;
    let data = {
      userName: userName,
      ProjectID: ProjectID,
      type: `StagesCUST ${type}`,
      IDcompanySub: ProjecHome.IDcompanySub,
      jobUser:jobUser
    };
    const idmax = await InsertNotifcation(
      arraynameuser,
      notification,
      notification_type,
      navigationId,
      data,
      ProjectID
    );
    data = {
      ...data,
      id: idmax,
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
      ProjecHome.NumberCompany,
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
    let data = {
      userName: userName,
      ProjectID: result[0].ProjectID,
      type: `StagesSub ${type}`,
      data: resultObject,
    };
    // const idmax = await InsertNotifcation(
    //   arraynameuser,
    //   notification,
    //   notification_type,
    //   navigationId,
    //   data,
    //   result[0].ProjectID
    // );
    // data = {
    //   ...data,
    //   id: idmax,
    // };
    await massges(token, notification, notification_type, navigationId, data);
  } catch (error) {
    console.log(error);
  }
};

const Delayinsert = async (idProject, StageID, userName, type = "إضافة") => {
  try {
    let resultObject = {};
    let result = await SELECTTablecompanySubProjectStageNotesOneObject(
      type === "إضافة" ? [parseInt(StageID), parseInt(idProject)] : [parseInt(idProject)],
      type === "تعديل"
        ? "sn.StageNoteID=?"
        : "sn.StagHOMID=? AND sn.ProjectID=?"
    );
    let resultnew = Object.entries(result).filter(
      ([key, value]) =>
        key !== "Nameproject" &&
        key !== "StageName" &&
        key !== "last_id" &&
        key !== "IDcompanySub"
    );
    await Promise.all(
      resultnew.map((item, index) => {
        resultObject[item[0]] = item[1];
      })
    );

    const { token, arraynameuser ,jobUser} = await BringtokenuserCustom(
      result.NumberCompany,
      idProject,
      userName,
      "Delay"
    );
    // console.log(result, "kkkkkkkkkkkkk", idProject, StageID);
    const notification = {
      title: `${type} تأخيرات ${type === "إضافة" ? "جديد" : ""}`,
      body: `  لقد قام  ${userName} ب${type}  تأخيرات  ${
        type === "إضافة" ? "جديد" : ""
      }  في مرحلة  " ${result.StageName}" من مشروع "${result.Nameproject}"`,
      image:
        resultObject.ImageAttachment !== null
          ? `https://storage.googleapis.com/demo_backendmoshrif_bucket-1/${resultObject.ImageAttachment}`
          : null,
    };
    const notification_type = "Delays";
    const navigationId = `${result.ProjectID}:${resultObject.StagHOMID}`;
    let data = {
      userName: userName,
      ProjectID: result.ProjectID,
      type: `Delays ${type}`,
      data: resultObject,
      StageID: resultObject.StagHOMID,
      IDcompanySub: result,
      jobUser:jobUser
    };
    const idmax = await InsertNotifcation(
      arraynameuser,
      notification,
      notification_type,
      navigationId,
      data,
      result.ProjectID
    );
    data = {
      ...data,
      id: idmax,
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
    const { token, arraynameuser ,jobUser} = await BringtokenuserCustom(
      result.NumberCompany,
      idProject,
      userName,
      "Delay"
    );
    const notification = {
      title: `إعادة ترتيب المراحل `,
      body: `  لقد قام  ${userName} بإعادة ترتيب مراحل مشروع "${result.Nameproject}"`,
    };
    const notification_type = "PageHomeProject";
    const navigationId = `${result.IDcompanySub}:${JSON.stringify(resultnew)}`;
    let data = {
      userName: userName,
      ProjectID: idProject,
      type: `RearrangeStageProject`,
      IDcompanySub: result.IDcompanySub,
      jobUser:jobUser
    };
    const idmax = await InsertNotifcation(
      arraynameuser,
      notification,
      notification_type,
      navigationId,
      data,
      idProject
    );
    data = {
      ...data,
      id: idmax,
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
      ([key, value]) => key !== "Nameproject" && key !== "IDcompanySub"
    );
    await Promise.all(
      resultnew.map((item, index) => {
        resultObject[item[0]] = item[1];
      })
    );

    const { token, arraynameuser,jobUser } = await BringtokenuserCustom(
      result.NumberCompany,
      result.projectID,
      userName,
      kind === "طلب" ? "chate" : "Finance",
      "sub"
    );
    // console.log(token, result.projectID);
    const notification = {
      title: `${type} ${kind} ${type === "إضافة" ? "جديد" : ""}`,
      body: `  لقد قام  ${userName} ب${type}  ${kind}  ${
        type === "إضافة" ? "جديد" : ""
      }  في مشروع "${result.Nameproject}" <<${result.Data}>>`,
    };
    let notification_type = stringSql === "Requests" ? "Requests" : "Finance";
    const navigationId = String(result.projectID);
    let data = {
      ProjectID: result.projectID,
      userName: userName,
      kind: kind,
      type: type,
      data: resultObject,
      IDcompanySub: result.IDcompanySub,
      jobUser:jobUser
    };
    // console.log(token, notification, notification_type, navigationId, data);
    const idmax = await InsertNotifcation(
      arraynameuser,
      notification,
      notification_type,
      navigationId,
      data,
      result.projectID
    );
    data = {
      ...data,
      id: idmax,
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
    const { token, arraynameuser,jobUser } = await Bringtokenuser(
      result.CommpanyID,
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
    const Count = await SELECTCOUNTCOMMENTANDLIKPOST(PostID, type);

    const notification_type = "PublicationsBransh";
    const navigationId = `${result.ProjectID}`;
    let data = {
      ProjectID: result.ProjectID,
      userName: userName,
      kind: kind,
      type: type,
      data: resultObject,
      PostID: PostID,
      count: Count["COUNT(userName)"],
      jobUser:jobUser
    };
    const idmax = await InsertNotifcation(
      arraynameuser,
      notification,
      notification_type,
      navigationId,
      data,
      result.ProjectID
    );
    data = {
      ...data,
      id: idmax,
    };

    await massges(token, notification, notification_type, navigationId, data);
  } catch (error) {
    console.log(error);
  }
};
const PostsnotificationCansle = async (
  PostID,
  type,
  userName,
  kind = "إلغاء الاعجاب"
) => {
  try {
    const result = await SELECTDataPrivatPostonObject(PostID);
    const Count = await SELECTCOUNTCOMMENTANDLIKPOST(PostID, "Likes");

    const { token, arraynameuser ,jobUser} = await Bringtokenuser(
      result.CommpanyID,
      result.ProjectID,
      userName,
      "PublicationsBransh"
    );
    // console.log(result, userName, token);

    const notification = {
      title: `إلغاء الاعجاب بمنشور `,
      body: `لقد قام  ${userName} بإلغاء الاعجاب على منشور  ${result.postBy} `,
    };
    const notification_type = "PublicationsBransh";
    const navigationId = `${result.ProjectID}`;
    let data = {
      ProjectID: result.ProjectID,
      userName: userName,
      kind: kind,
      type: type,
      data: [],
      PostID: PostID,
      count: Count["COUNT(userName)"],
      jobUser:jobUser
    };
    const idmax = await InsertNotifcation(
      arraynameuser,
      notification,
      notification_type,
      navigationId,
      data,
      result.ProjectID
    );
    data = {
      ...data,
      id: idmax,
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

    let arrayuser;
    let tokenuser;
    let bodymassge;
    let insertnavigation = "pr.id";
    let IDCompanySub= 0;
    let Nameproject = "";
    let job ;
    if (
      StageID !== "قرارات" &&
      StageID !== "استشارات" &&
      StageID !== "اعتمادات" &&
      StageID !== "تحضير"
    ) {
      const Project = await SELECTProjectStartdate(idProject);
      IDCompanySub = Project?.IDCompanySub;
      Nameproject = Project?.Nameproject;

      if (Number(StageID) || StageID === "A1" || StageID === ":A1") {
        const Stage = await SELECTTablecompanySubProjectStageCUSTONe(
        idProject,
        StageID
        );
        nameChate = Stage.StageName;
      } else {
        nameChate = StageID;
      }
    
      const { token, arraynameuser,jobUser } = await BringtokenuserCustom(
        Project.NumberCompany,
        idProject,
        userName,
        "chate"
      );
      arrayuser = arraynameuser;
      tokenuser = token;
      job = jobUser;
      bodymassge = `دردشة مشروع ${Project?.Nameproject} قسم ${nameChate}`;
    } else {
      const company = await SelectVerifycompanyexistence(idProject);
      const { token, arraynameuser,jobUser } = await Bringtokenuser(
        company.id,
        idProject,
        userName,
        StageID,
        "RE.CommercialRegistrationNumber=?"
      );
      arrayuser = arraynameuser;
      tokenuser = token;
      nameChate = StageID;
      bodymassge = `دردشة ${nameChate}`;
      insertnavigation = true;
      job = jobUser;

    }

    let title =
      Object.entries(Reply).length <= 0
        ? userName
        : `لقد قام ${userName} بالرد على رسالة ${Reply.Sender}`;
    const notification_type = "Chate";
    const navigationId = `${idProject}:${StageID}`;
    let image = null;
    let typfile = null;
    // استخراج الصورة الذي ارسلت إذا وجدت
    if (Object.entries(File).length > 0) {
        image = String(File.type).includes("video") ?  String(File.name).replace("mp4", "png") : File.name;
        image = `https://storage.googleapis.com/demo_backendmoshrif_bucket-1/${image}`;
     
      if (String(File.type).includes("video")) {
        typfile = "ارفق فديو";
      } else if (String(File.type).includes("image")) {
        typfile = "ارفق صورة";
      } else {
        typfile = "ارفق ملف";
      }
    }
    // console.log(tokenuser,arrayuser);

    const notification = {
      title: title,
      // body: `في غرفة دردشة مشروع ${Project.Nameproject} قسم ${nameChate}  `  +`< ${massgs} >`,
      body: bodymassge + `< ${String(massgs).length > 0 ? massgs : typfile} >`,
      image: image,
    };
    let data = {
      ProjectID: idProject,
      userName: userName,
      type: `chate`,
      kind: "new",
      nameRoom: nameChate,
      Nameproject: Nameproject,
      StageID: StageID,
      IDcompanySub: IDCompanySub,
      jobUser:job
    };
    const idmax = await InsertNotifcation(
      arrayuser,
      notification,
      notification_type,
      navigationId,
      data,
      idProject,
      insertnavigation
    );
    data = {
      ...data,
      id: idmax,
    };
    await massges(
      tokenuser,
      notification,
      notification_type,
      navigationId,
      data
    );
  } catch (error) {
    console.log(error);
  }
};

const ChateNotficationdelete = async (
  idProject,
  StageID,
  massgs,
  userName = "",
  chatID
) => {
  try {
    let nameChate;
    let arrayuser;
    let tokenuser;
    let bodymassge;
    let insertnavigation = "pr.id";
 
    if (
      StageID !== "قرارات"    &&
      StageID !== "استشارات"  &&
      StageID !== "اعتمادات"
    ) {
         const Stage = await SELECTTablecompanySubProjectStageCUSTONe(
      idProject,
      StageID
    );
      if (Number(StageID) || StageID === "A1" || StageID === ":A1") {
        nameChate = Stage.StageName;
      } else {
        nameChate = StageID;
      }
      const Project = await SELECTProjectStartdate(idProject);
      const { token, arraynameuser } = await BringtokenuserCustom(
        Stage.NumberCompany,
        idProject,
        userName,
        "chate"
      );
      arrayuser = arraynameuser;
      tokenuser = token;
      bodymassge = `دردشة مشروع ${Project?.Nameproject} قسم ${nameChate}`;
    } else {
      const company = await SelectVerifycompanyexistence(idProject);
      const { token, arraynameuser } = await Bringtokenuser(
        company.id,
        idProject,
        userName,
        StageID,
        "RE.CommercialRegistrationNumber=?"
      );
      arrayuser = arraynameuser;
      tokenuser = token;
      nameChate = StageID;
      bodymassge = `دردشة ${nameChate}`;
      insertnavigation = true;
    }
    let title = `لقد قام ${userName} حذف الرسالة `;
    const notification_type = "Chate";
    const navigationId = `${idProject}:${StageID}`;
    let typfile = null;

    const notification = {
      title: title,
      body: bodymassge + `< ${String(massgs).length > 0 ? massgs : typfile} >`,
    };
    let data = {
      ProjectID: idProject,
      userName: userName,
      StageID: StageID,
      type: `chatedelete`,
      nameRoom: nameChate,
      chatID: chatID,
    };
    const idmax = await InsertNotifcation(
      arrayuser,
      notification,
      notification_type,
      navigationId,
      data,
      idProject,
      insertnavigation
    );
    data = {
      ...data,
      id: idmax,
    };
    await massges(
      tokenuser,
      notification,
      notification_type,
      navigationId,
      data
    );
  } catch (error) {
    console.log(error);
  }
};

// ChateNotfication(1,'طلبات','كيف الحال');

// اشعارات اضافة مستخدم او حذفة

const AddOrUpdatuser = async (PhoneNumber, Validity, type, userName) => {
  try {
    const result = await SELECTTableLoginActivatActivaty(PhoneNumber);
    // console.log(result.token);
    const notification = {
      title: type,
      body: ` لقد قام ${userName} ب${type}`,
    };
    const data = {
      ProjectID: 0,
      userName: userName,
      type: `user`,
      data: Validity,
    };
    const endData = [
      0,
      0,
      JSON.stringify(notification),
      JSON.stringify([userName]),
      JSON.stringify({
        notification_type: "user",
        navigationId: "user",
        data: JSON.stringify(data),
      }),
      new Date().toUTCString(),
    ];
    await insertTableNavigation(endData);
    await UpdateTableLoginActivatyValidityORtoken(
      JSON.stringify(Validity),
      PhoneNumber,
      "Validity"
    );
    await massges([String(result.token)], notification, "", "", data);
  } catch (error) {
    console.log(error);
  }
};

// طلبات العهد
const CovenantNotfication = async (
  IDCompanySub,
  PhoneNumber,
  type = "request",
  id = 0
) => {
  try {
    let result;
    let tokens;
    let arraynameusers;
    let IDCompanySubs = IDCompanySub;
    let job = '';
    if (type === "request") {
      result = await SELECTTableLoginActivatActivaty(PhoneNumber);

      const { token, arraynameuser,jobUser } = await BringtokenuserCustom(
        result.IDCompany,
        IDCompanySubs,
        result.userName,
        "all",
        "CovenantBrinsh"
      );
      tokens = token;
      arraynameusers = arraynameuser;
      job = jobUser
    } else {
      const datacovenent = await SELECTTableMaxFinancialCustody(id, "all");
      result = await SELECTTableLoginActivatActivaty(datacovenent.Requestby);
      tokens = [String(result.token)];
      arraynameusers = [result.userName];
      IDCompanySubs = datacovenent.IDCompanySub;
    }

    let title =
      type === "request"
        ? `لقد قام ${result.userName} بطلب عهده `
        : type === "acceptance"
        ? `لقد قام ${PhoneNumber} بقبول عهدتك `
        : `لقد قام ${PhoneNumber} برفض عهدتك `;

    const notification_type = "CovenantBrinsh";
    const navigationId = `${IDCompanySubs}`;

    const notification = {
      title: title,
      body: title,
    };
    let data = {
      ProjectID: 0,
      userName: result.userName,
      IDCompanySub: IDCompanySubs,
      type:
        type === "request"
          ? "arrayOpen"
          : type === "acceptance"
          ? "arrayClosed"
          : `arrayReject`,
      jobUser:job
    };
    const endData = [
      IDCompanySubs,
      0,
      JSON.stringify(notification),
      JSON.stringify(arraynameusers),
      JSON.stringify({
        notification_type: notification_type,
        navigationId: navigationId,
        data: JSON.stringify(data),
      }),
      new Date().toUTCString(),
    ];
    await insertTableNavigation(endData);

    await massges(tokens, notification, notification_type, navigationId, data);
  } catch (error) {
    console.log(error);
  }
};

// bring token all users
const Bringtokenuser = async (
  IDCompany,
  ProjectID,
  userName,
  type = "all",
  wheretype = "PR.id =?"
) => {
  let token = [];
  let arraynameuser = [];
  let jobUser ;

  const users = await SELECTTableusersCompanySub(IDCompany,ProjectID, type, wheretype);
  await Promise.all(
    users
      .map((item, index) => {
      if(item.userName !== userName){
        if(type === 'PublicationsBransh' || wheretype === "RE.CommercialRegistrationNumber=?"){
          if (item.jobdiscrption === "موظف") {
            token.push(item.token);
            arraynameuser.push(item.userName);
          }
        }else if (wheretype === "PR.id =?") {
          token.push(item.token);
          arraynameuser.push(item.userName);
        } else {
          if (item.jobdiscrption === "موظف") {
            token.push(item.token);
            arraynameuser.push(item.userName);
          }
        }
      }else{
        jobUser = item.job
      }
      })
  );
  return { token, users, arraynameuser ,jobUser};
};

// bring token custom users
const BringtokenuserCustom = async (
  IDCompany,
  ProjectID,
  userName,
  type = "all",
  kind = "sub"
) => {
  let token = [];
  let arraynameuser = [];
  let jobUser ;
  const users = await SELECTTableusersCompanySub(IDCompany,ProjectID, type);
  await Promise.all(
    users
      .map((item, index) => {
        if(item.userName !== userName){
          if (item.job === "Admin" || item.job === "مالية") {
            token.push(item.token);
            arraynameuser.push(item.userName);
          } else {
            const Validity =
              item.Validity !== null ? JSON.parse(item.Validity) : [];
            for (let index = 0; index < Validity.length; index++) {
              const element = Validity[index];
              if (parseInt(element.idBrinsh) === parseInt(item.IDcompanySub)) {
                if (
                  kind === "CovenantBrinsh" &&
                  element.Acceptingcovenant === true
                ) {
                  token.push(item.token);
                  arraynameuser.push(item.userName);
                } else if (element.job === "مدير الفرع" || kind !== "sub") {
                  if (kind !== "sub") {
                    if (element.jobdiscrption === "موظف") {
                      token.push(item.token);
                      arraynameuser.push(item.userName);
                    }
                  } else {
                    token.push(item.token);
                    arraynameuser.push(item.userName);
                  }
                } else {
                  for (let P = 0; P < element?.project?.length; P++) {
                    const elementProject = element?.project[P];
                    if (elementProject.idProject === ProjectID) {
                      if (type === "Finance") {
                        const findValidityProject =
                          elementProject?.ValidityProject?.find(
                            (V) => V === "إشعارات المالية"
                          );
                        if (findValidityProject) {
                          token.push(item.token);
                          arraynameuser.push(item.userName);
                        }
                      } else {
                        token.push(item.token);
                        arraynameuser.push(item.userName);
                      }
                    }
                  }
                }
              }
            }
          }
        }else{
          jobUser = item.job
        }
      })
  );
  // console.log(token);
  return { token, users, arraynameuser,jobUser };
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
  PostsnotificationCansle,
  ChateNotficationdelete,
  CovenantNotfication,
};
