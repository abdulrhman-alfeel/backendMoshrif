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

/**
 * إرسال إشعار عند إنشاء أو تعديل مشروع
 * @param {number|string} companySubId - رقم الشركة الفرعية
 * @param {string} userName - اسم المستخدم الذي قام بالفعل
 * @param {string} type - نوع العملية (إنشاء | تعديل) - القيمة الافتراضية "إنشاء"
 */
const Projectinsert = async (companySubId, userName, type = "إنشاء") => {
  try {
    // ✅ استرجاع آخر مشروع متعلق بالشركة الفرعية
    const projectResult = await SELECTTablecompanySubProjectLast_id(
      companySubId,
      "max",
      type === "إنشاء" ? "RE.id" : "ca.id"
    );

    // ✅ جلب بيانات المستخدمين المرتبطين بالمشروع
    const { token, users, arraynameuser, jobUser } = await BringtokenuserCustom(
      projectResult.NumberCompany,
      companySubId,
      userName,
      "all",
      "project"
    );

    if (!users || users.length === 0) {
      console.warn("⚠️ لم يتم العثور على مستخدمين لإرسال الإشعار.");
      return;
    }

    // ✅ تجهيز بيانات الإشعار
    const notification = {
      title: `${type} مشروع ${type === "إنشاء" ? "جديد" : projectResult.Nameproject}`,
      body: `لقد قام ${userName} ب${type} مشروع ${type === "إنشاء" ? "جديد" : projectResult.Nameproject}`,
    };

    const notificationType = "Public";
    const navigationId = `${users[0].IDcompany}:${companySubId}:${users[0].NameSub}:${users[0].PhoneNumber}:${users[0].Email}`;

    let data = {
      userName,
      type: `companySubprojects ${type}`,
      data: projectResult,
      NameSub: users[0].NameSub,
      IDcompany: users[0].IDcompany,
      IDcompanySub: companySubId,
      PhoneNumber: users[0].PhoneNumber,
      Email: users[0].Email,
      jobUser,
    };

    // ✅ إدخال الإشعار في قاعدة البيانات
    const idmax = await InsertNotifcation(
      arraynameuser,
      notification,
      notificationType,
      navigationId,
      data,
      companySubId,
      "su.id",
      "max(pr.id) AS id"
    );

    // ✅ تحديث البيانات المرسلة مع معرف الإشعار
    data = { ...data, id: idmax };

    // ✅ إرسال الإشعار للمستخدمين
    await massges(token, notification, notificationType, navigationId, data);

  } catch (error) {
    console.error("❌ خطأ أثناء إرسال إشعار المشروع:", error);
  }
};
/**
 * إرسال إشعار عند إنشاء أو تعديل مرحلة في مشروع
 * @param {number|string} projectId - رقم المشروع
 * @param {number|string} stageId - رقم المرحلة (افتراضي = 0)
 * @param {string} userName - اسم المستخدم الذي قام بالفعل
 * @param {string} type - نوع العملية (إنشاء | تعديل) - القيمة الافتراضية "إنشاء"
 */
const Stageinsert = async (projectId, stageId = 0, userName, type = "إنشاء") => {
  try {
    // ✅ استرجاع بيانات المرحلة/المشروع
    const stageData = await SELECTTablecompanySubProjectStageCUSTONe(
      projectId,
      stageId,
      "notifcation",
      type === "إنشاء"
        ? "cu.projectID=?"
        : "cu.projectID=? AND cu.StageID=?"
    );

    // ✅ استرجاع بيانات المشروع (تاريخ البدء وغيره)
    const projectDetails = await SELECTProjectStartdate(projectId);

    if (!stageData) {
      // console.warn(`⚠️ لم يتم العثور على بيانات مرحلة للمشروع ID=${projectId}.`);
      return;
    }

    // ✅ تصفية البيانات (إزالة الحقول غير المهمة)
    const stageObject = Object.fromEntries(
      Object.entries(stageData).filter(
        ([key]) => key !== "Nameproject" && key !== "IDcompanySub"
      )
    );

    // ✅ جلب بيانات المستخدمين
    const { token, arraynameuser, jobUser } = await BringtokenuserCustom(
      stageData.NumberCompany,
      projectId,
      userName,
      "Stage"
    );

    if (!arraynameuser || arraynameuser.length === 0) {
      // console.warn("⚠️ لم يتم العثور على مستخدمين لإرسال إشعار المرحلة.");
      return;
    }

    // ✅ تجهيز الإشعار
    const notification = {
      title: `${type} مرحلة ${type === "إنشاء" ? "جديدة" : "في " + stageData.Nameproject}`,
      body: `لقد قام ${userName} ب${type} مرحلة ${type === "إنشاء" ? "جديدة" : ""} في مشروع "${stageData.Nameproject}"`,
    };

    const notificationType = "PageHomeProject";
    const navigationId = `${stageData.IDcompanySub}:${JSON.stringify(projectDetails)}`;

    let data = {
      userName,
      ProjectID: projectId,
      type: `StagesCUST ${type}`,
      data: stageObject,
      IDcompanySub: stageData.IDcompanySub,
      Project: projectDetails,
      jobUser,
    };

    // ✅ إدخال الإشعار في قاعدة البيانات
    const idmax = await InsertNotifcation(
      arraynameuser,
      notification,
      notificationType,
      navigationId,
      data,
      projectId,
      "pr.id"
    );

    // ✅ إضافة معرف الإشعار للبيانات
    data = { ...data, id: idmax };

    // ✅ إرسال الإشعار للمستخدمين
    await massges(token, notification, notificationType, navigationId, data);

    // console.log(`✅ تم إرسال إشعار ${type} المرحلة في مشروع "${stageData.Nameproject}".`);
  } catch (error) {
    console.error("❌ خطأ أثناء إرسال إشعار المرحلة:", error);
  }
};


/**
 * إرسال إشعار عند إنشاء أو تعديل مرحلة فرعية في مشروع
 * @param {number|string} ProjectID - رقم المشروع
 * @param {number|string} StageID - رقم المرحلة (افتراضي = 0)
 * @param {string} userName - اسم المستخدم الذي قام بالفعل
 * @param {string} type - نوع العملية (إنشاء | تعديل) - القيمة الافتراضية "إنشاء"
 */
const StageSubinsert = async (ProjectID, StageID = 0, userName, type = "إنشاء") => {
  try {
    // جلب بيانات المرحلة الفرعية
    const stageResult = await SELECTTablecompanySubProjectStagesSub(
      ProjectID,
      StageID,
      "notification",
      type === "إنشاء"
        ? "su.StagHOMID=? AND su.ProjectID=?"
        : "su.StageSubID = ?"
    );

    // جلب بيانات المشروع والمرحلة الرئيسية
    const projectHome = await SELECTTablecompanySubProjectStageCUSTONe(ProjectID, StageID);

    // تجهيز كائن البيانات مع استبعاد الحقول غير المطلوبة
    const resultObject = Object.fromEntries(
      Object.entries(stageResult[0]).filter(
        ([key]) => !["Nameproject", "StageName", "ProjectID", "StageID"].includes(key)
      )
    );

    // جلب توكن المستخدم ومعلوماته
    const { token, arraynameuser, jobUser } = await BringtokenuserCustom(
      projectHome.NumberCompany,
      ProjectID,
      userName,
      "Stage"
    );

    // تجهيز إشعار المستخدم
    const notification = {
      title: `${type} مرحلة فرعية ${type === "إنشاء" ? "جديدة" : "في " + stageResult[0].StageName}`,
      body: `قام ${userName} ب${type} مرحلة ${
        type === "إنشاء" ? "جديدة" : ""
      } في مشروع "${stageResult[0].Nameproject}" ضمن المرحلة "${stageResult[0].StageName}"`,
      // image: 'https://storage.googleapis.com/demo_backendmoshrif_bucket-2/Vector.png',
    };

    const notification_type = "PageHomeProject";
    const navigationId = `${stageResult[0].IDcompanySub}:${JSON.stringify(projectHome)}`;

    // تجهيز بيانات الإشعار
    let data = {
      userName,
      ProjectID,
      type: `StagesSub ${type}`,
      data: resultObject,
      IDcompanySub: stageResult[0].IDcompanySub,
      jobUser,
    };

    // إدخال الإشعار في قاعدة البيانات
    const idmax = await InsertNotifcation(
      arraynameuser,
      notification,
      notification_type,
      navigationId,
      data,
      ProjectID,
      "pr.id"
    );

    // إضافة معرف الإشعار إلى البيانات
    data = { ...data, id: idmax };

    // إرسال الإشعار فعليًا
    await massges(token, notification, notification_type, navigationId, data);

  } catch (error) {
    console.error("Error in StageSubinsert:", error);
  }
};

/**
 * إرسال إشعار عند إضافة أو تعديل ملاحظة في مرحلة فرعية
 * @param {number|string} ProjectID - رقم المشروع
 * @param {number|string} StageID - رقم المرحلة الرئيسية
 * @param {number|string} StageSubID - رقم المرحلة الفرعية
 * @param {string} note - نص الملاحظة
 * @param {string} userName - اسم المستخدم الذي قام بالفعل
 * @param {string} type - نوع العملية (اضاف | تعديل) - القيمة الافتراضية "اضاف"
 */
const StageSubNote = async (ProjectID, StageID, StageSubID, note, userName, type = "اضاف") => {
  try {
    // جلب بيانات المرحلة الفرعية
    const stageSubResult = await SELECTTablecompanySubProjectStagesSub(
      StageSubID,
      StageID,
      "notification",
      "su.StageSubID = ?"
    );

    // جلب بيانات المشروع والمرحلة الرئيسية
    const projectHome = await SELECTTablecompanySubProjectStageCUSTONe(ProjectID, StageID);

    // تجهيز كائن البيانات مع استبعاد الحقول غير المطلوبة
    const resultObject = Object.fromEntries(
      Object.entries(stageSubResult[0]).filter(
        ([key]) => !["Nameproject", "StageName", "ProjectID", "StageID", "IDcompanySub"].includes(key)
      )
    );

    // جلب توكن المستخدم ومعلوماته
    const { token, jobUser } = await BringtokenuserCustom(
      projectHome.NumberCompany,
      ProjectID,
      userName,
      "Stage"
    );

    // تجهيز إشعار المستخدم
    const notification = {
      title: `قام ${userName} ب${type} ملاحظة`,
      body: note,
      // image: 'https://storage.googleapis.com/demo_backendmoshrif_bucket-2/Vector.png',
    };

    const notification_type = "Phase";
    const navigationId = JSON.stringify(projectHome);

    // تجهيز بيانات الإشعار
    const data = {
      userName,
      ProjectID,
      type: `StagesSub ${type}`,
      data: resultObject,
      IDcompanySub: stageSubResult[0].IDcompanySub,
      jobUser,
    };

    // إرسال الإشعار فعليًا
    await massges(token, notification, notification_type, navigationId, data);

  } catch (error) {
    console.error("Error in StageSubNote:", error);
  }
};



/**
 * إرسال إشعار عند إغلاق أو فتح مرحلة في مشروع
 * @param {number|string} ProjectID - رقم المشروع
 * @param {number|string} StageID - رقم المرحلة
 * @param {string} userName - اسم المستخدم الذي قام بالفعل
 * @param {string} type - نوع العملية (اغلاق | فتح) - القيمة الافتراضية "اغلاق"
 */
const CloseOROpenStagenotifcation = async (ProjectID, StageID, userName, type = "اغلاق") => {
  try {
    // جلب بيانات المشروع والمرحلة
    const projectHome = await SELECTTablecompanySubProjectStageCUSTONe(ProjectID, StageID);

    // جلب توكن المستخدم ومعلوماته
    const { token, arraynameuser, jobUser } = await BringtokenuserCustom(
      projectHome.NumberCompany,
      ProjectID,
      userName,
      "Stage"
    );

    // تجهيز الإشعار
    const notification = {
      title: `قام ${userName} ب${type} المرحلة`,
      body: `قام ${userName} ب${type} مرحلة ${projectHome.StageName}`,
      // image: 'https://storage.googleapis.com/demo_backendmoshrif_bucket-2/Vector.png',
    };

    const notification_type = "PageHomeProject";
    const navigationId = `${projectHome.IDcompanySub}:${JSON.stringify(projectHome)}`;

    // تجهيز بيانات الإشعار
    let data = {
      userName,
      ProjectID,
      type: `StagesCUST ${type}`,
      IDcompanySub: projectHome.IDcompanySub,
      jobUser,
    };

    // إدخال الإشعار في قاعدة البيانات
    const idmax = await InsertNotifcation(
      arraynameuser,
      notification,
      notification_type,
      navigationId,
      data,
      ProjectID
    );

    // إضافة معرف الإشعار للبيانات
    data = { ...data, id: idmax };

    // إرسال الإشعار للمستخدمين
    await massges(token, notification, notification_type, navigationId, data);

  } catch (error) {
    console.error("Error in CloseOROpenStageNotification:", error);
  }
};

/**
 * إرسال إشعار عند إنجاز مرحلة فرعية في مشروع
 * @param {number|string} StageSubID - رقم المرحلة الفرعية
 * @param {string} userName - اسم المستخدم الذي قام بالفعل
 * @param {string} type - نوع العملية (إنجاز) - القيمة الافتراضية "إنجاز"
 */
const AchievmentStageSubNote = async (StageSubID, userName, type = "إنجاز") => {
  try {
    // جلب بيانات المرحلة الفرعية
    const result = await SELECTTablecompanySubProjectStagesSub(
      StageSubID,
      0,
      "notification",
      "su.StageSubID = ?"
    );

    if (!result || result.length === 0) return;

    const stageSub = result[0];

    // جلب بيانات المشروع الرئيسي
    const projectHome = await SELECTTablecompanySubProjectStageCUSTONe(
      stageSub.ProjectID,
      stageSub.StageID
    );

    // إنشاء نسخة من بيانات المرحلة بدون الحقول غير الضرورية
    const resultObject = Object.fromEntries(
      Object.entries(stageSub).filter(
        ([key]) => !["Nameproject", "StageName", "ProjectID", "StageID"].includes(key)
      )
    );

    // جلب توكن المستخدم
    const { token } = await BringtokenuserCustom(
      projectHome?.NumberCompany,
      stageSub.ProjectID,
      userName,
      "Stage"
    );

    // إعداد الإشعار
    const notification = {
      title: `قام ${userName} ب${type} المرحلة الفرعية`,
      body: `قام ${userName} ب${type} المرحلة الفرعية ${stageSub.StageSubName}`,
      // image: 'https://storage.googleapis.com/demo_backendmoshrif_bucket-2/Vector.png',
    };

    const notification_type = "Phase";
    const navigationId = `${JSON.stringify(projectHome)}`;

    // بيانات الإشعار
    const data = {
      userName,
      ProjectID: stageSub.ProjectID,
      type: `StagesSub ${type}`,
      data: resultObject,
    };

    // إرسال الإشعار
    await massges(token, notification, notification_type, navigationId, data);

  } catch (error) {
    console.error("Error in AchievmentStageSubNote:", error);
  }
};

/**
 * إرسال إشعار عند إضافة أو تعديل تأخير في مرحلة مشروع
 * @param {number|string} idProject - رقم المشروع
 * @param {number|string} StageID - رقم المرحلة
 * @param {string} userName - اسم المستخدم الذي قام بالفعل
 * @param {string} type - نوع العملية (إضافة | تعديل) - القيمة الافتراضية "إضافة"
 */
const Delayinsert = async (idProject, StageID, userName, type = "إضافة") => {
  try {
    // جلب بيانات التأخير
    const result = await SELECTTablecompanySubProjectStageNotesOneObject(
      type === "إضافة"
        ? [parseInt(StageID), parseInt(idProject)]
        : [parseInt(idProject)],
      type === "تعديل"
        ? "sn.StageNoteID=?"
        : "sn.StagHOMID=? AND sn.ProjectID=?"
    );

    if (!result) return;

    // إنشاء نسخة من البيانات بدون الحقول غير الضرورية
    const resultObject = Object.fromEntries(
      Object.entries(result).filter(
        ([key]) =>
          !["Nameproject", "StageName", "last_id", "IDcompanySub"].includes(key)
      )
    );

    // جلب توكن المستخدم والمستخدمين المرتبطين
    const { token, arraynameuser, jobUser } = await BringtokenuserCustom(
      result.NumberCompany,
      idProject,
      userName,
      "Delay"
    );

    // إعداد الإشعار
    const notification = {
      title: `${type} تأخيرات ${type === "إضافة" ? "جديد" : ""}`,
      body: `لقد قام ${userName} ب${type} تأخيرات ${
        type === "إضافة" ? "جديد" : ""
      } في مرحلة "${result.StageName}" من مشروع "${result.Nameproject}"`,
      image:
        resultObject.ImageAttachment !== null
          ? `https://storage.googleapis.com/demo_backendmoshrif_bucket-1/${resultObject.ImageAttachment}`
          : null,
    };

    const notification_type = "Delays";
    const navigationId = `${result.ProjectID}:${resultObject.StagHOMID}`;

    // بيانات الإشعار
    let data = {
      userName,
      ProjectID: result.ProjectID,
      type: `Delays ${type}`,
      data: resultObject,
      StageID: resultObject.StagHOMID,
      IDcompanySub: result.IDcompanySub,
      jobUser,
    };

    // إدراج الإشعار في النظام
    const idmax = await InsertNotifcation(
      arraynameuser,
      notification,
      notification_type,
      navigationId,
      data,
      result.ProjectID
    );

    // تحديث البيانات بالمعرف الجديد
    data = { ...data, id: idmax };

    // إرسال الإشعار للمستخدمين
    await massges(token, notification, notification_type, navigationId, data);

  } catch (error) {
    console.error("Error in Delayinsert:", error);
  }
};


/**
 * إرسال إشعار عند إعادة ترتيب مراحل مشروع
 * @param {number|string} idProject - رقم المشروع
 * @param {string} userName - اسم المستخدم الذي قام بالفعل
 */
const RearrangeStageProject = async (idProject, userName) => {
  try {
    // جلب بيانات المشروع
    const result = await SELECTTablecompanySubProjectStageCUSTONe(
      idProject,
      0,
      "notifcation",
      "cu.projectID=?"
    );

    if (!result) return;

    // إنشاء نسخة من البيانات بدون الحقول غير الضرورية
    const resultObject = Object.fromEntries(
      Object.entries(result).filter(
        ([key]) => !["Nameproject", "IDcompanySub"].includes(key)
      )
    );

    // جلب توكن المستخدم والمستخدمين المرتبطين
    const { token, arraynameuser, jobUser } = await BringtokenuserCustom(
      result.NumberCompany,
      idProject,
      userName,
      "Delay"
    );

    // إعداد الإشعار
    const notification = {
      title: `إعادة ترتيب المراحل`,
      body: `لقد قام ${userName} بإعادة ترتيب مراحل مشروع "${result.Nameproject}"`,
    };

    const notification_type = "PageHomeProject";
    const navigationId = `${result.IDcompanySub}:${JSON.stringify(resultObject)}`;

    // بيانات الإشعار
    let data = {
      userName,
      ProjectID: idProject,
      type: `RearrangeStageProject`,
      IDcompanySub: result.IDcompanySub,
      jobUser,
    };

    // إدراج الإشعار في النظام
    const idmax = await InsertNotifcation(
      arraynameuser,
      notification,
      notification_type,
      navigationId,
      data,
      idProject
    );

    // تحديث البيانات بالمعرف الجديد
    data = { ...data, id: idmax };

    // إرسال الإشعار للمستخدمين
    await massges(token, notification, notification_type, navigationId, data);

  } catch (error) {
    console.error("Error in RearrangeStageProject:", error);
  }
};

//  اشعارات المالية والطالبات
/**
 * إرسال إشعار عند إضافة أو تعديل عنصر مالي في مشروع
 * @param {number|string} projectID - رقم المشروع
 * @param {string} kind - نوع العملية المالية (مصروفات | مرتجعات | عهد | طلب)
 * @param {string} type - نوع الإجراء (إضافة | تعديل) - القيمة الافتراضية "إضافة"
 * @param {string} userName - اسم المستخدم الذي قام بالفعل
 * @param {number|null} idEdit - معرف العنصر عند التعديل، القيمة الافتراضية null
 */
const Financeinsertnotification = async (
  projectID,
  kind = "مصروفات",
  type = "إضافة",
  userName,
  idEdit = null
) => {
  try {
    // تحديد جدول البيانات حسب نوع العملية المالية
    const tableMap = {
      مصروفات: "Expense",
      مرتجعات: "Returns",
      عهد: "Revenue",
      طلب: "Requests",
    };
    const idMap = {
      مصروفات: "Expenseid",
      مرتجعات: "ReturnsId",
      عهد: "RevenueId",
      طلب: "RequestsID",
    };

    const stringSql = tableMap[kind] || "Requests";
    const idColumn = idMap[kind] || "RequestsID";

    // جلب البيانات حسب إذا كانت إضافة جديدة أو تعديل
    const result =
      idEdit === null
        ? await SELECTTablecompanySubProjectfornotification(projectID, stringSql)
        : await SELECTTablecompanySubProjectfornotificationEdit(idEdit, stringSql, idColumn);

    if (!result) return;

    // إنشاء نسخة من البيانات بدون الحقول غير الضرورية
    const resultObject = Object.fromEntries(
      Object.entries(result).filter(
        ([key]) => !["Nameproject", "IDcompanySub"].includes(key)
      )
    );

    // جلب توكن المستخدم والمستخدمين المرتبطين
    const { token, arraynameuser, jobUser } = await BringtokenuserCustom(
      result.NumberCompany,
      result.projectID,
      userName,
      kind === "طلب" ? "chate" : "Finance",
      "sub"
    );

    // إعداد الإشعار
    const notification = {
      title: `${type} ${kind} ${type === "إضافة" ? "جديد" : ""}`,
      body: `لقد قام ${userName} ب${type} ${kind} ${
        type === "إضافة" ? "جديد" : ""
      } في مشروع "${result.Nameproject}" <<${result.Data}>>`,
    };

    const notification_type = stringSql === "Requests" ? "Requests" : "Finance";
    const navigationId = String(result.projectID);

    // بيانات الإشعار
    let data = {
      ProjectID: result.projectID,
      userName,
      kind,
      type,
      data: resultObject,
      IDcompanySub: result.IDcompanySub,
      jobUser,
    };

    // إدراج الإشعار في النظام
    const idmax = await InsertNotifcation(
      arraynameuser,
      notification,
      notification_type,
      navigationId,
      data,
      result.projectID
    );

    data = { ...data, id: idmax };

    // إرسال الإشعار للمستخدمين
    await massges(token, notification, notification_type, navigationId, data);

  } catch (error) {
    console.error("Error in Financeinsertnotification:", error);
  }
};


// اشعارات التعليقات والاعجابات
/**
 * إرسال إشعار عند إضافة أو تعديل منشور أو تعليق أو إعجاب
 * @param {number|string} PostID - معرف المنشور
 * @param {string} type - نوع الإجراء (Comment | Likes)
 * @param {string} userName - اسم المستخدم الذي قام بالفعل
 * @param {string} kind - نوع المحتوى (تعليق | اعجاب) - القيمة الافتراضية "تعليق"
 * @param {number|null} idEdit - معرف التعليق عند التعديل، القيمة الافتراضية null
 */
const Postsnotification = async (
  PostID,
  type,
  userName,
  kind = "تعليق",
  idEdit = null
) => {
  try {
    // جلب بيانات المنشور
    const result = await SELECTDataPrivatPost(PostID, type, idEdit);
    if (!result) return;

    // إنشاء نسخة من البيانات بدون الحقول غير الضرورية
    const resultObject = Object.fromEntries(
      Object.entries(result).filter(([key]) => !["ProjectID", "postBy"].includes(key))
    );

    // جلب توكن المستخدم والمستخدمين المرتبطين
    const { token, arraynameuser, jobUser } = await Bringtokenuser(
      result.CommpanyID,
      result.ProjectID,
      result.userName,
      "PublicationsBransh"
    );

    // تحديد النص الظاهر في الإشعار
    const actionText = type === "Comment" && kind === "تعليق"
      ? "جديد"
      : type === "Likes" && kind === "اعجاب"
      ? "منشور"
      : "الإعجاب بمنشور";

    const commentText = type === "Comment" ? `<<${result.commentText}>>` : "";

    // إعداد الإشعار
    const notification = {
      title: `${kind} ${actionText}`,
      body: `لقد قام ${result.userName} ب${kind} ${actionText} ${
        idEdit === null ? result.postBy : ""
      } ${commentText}`,
    };

    // جلب عدد التعليقات والإعجابات
    const Count = await SELECTCOUNTCOMMENTANDLIKPOST(PostID, type);

    const notification_type = "PublicationsBransh";
    const navigationId = `${PostID}/${result.CommpanyID}/navigation`;

    // بيانات الإشعار
    let data = {
      ProjectID: result.ProjectID,
      userName,
      kind,
      type,
      data: resultObject,
      PostID,
      count: Count["COUNT(userName)"],
      jobUser,
    };

    // إدراج الإشعار في النظام
    const idmax = await InsertNotifcation(
      arraynameuser,
      notification,
      notification_type,
      navigationId,
      data,
      result.ProjectID
    );

    data = { ...data, id: idmax };

    // إرسال الإشعار للمستخدمين
    await massges(token, notification, notification_type, navigationId, data);

  } catch (error) {
    console.error("Error in Postsnotification:", error);
  }
};

/**
 * إرسال إشعار عند إلغاء الإعجاب على منشور
 * @param {number|string} PostID - معرف المنشور
 * @param {string} type - نوع العملية (مثل "Likes")
 * @param {string} userName - اسم المستخدم الذي قام بالإلغاء
 * @param {string} kind - وصف العملية، القيمة الافتراضية "إلغاء الاعجاب"
 */
const PostsnotificationCansle = async (
  PostID,
  type,
  userName,
  kind = "إلغاء الاعجاب"
) => {
  try {
    // جلب بيانات المنشور وعدد الإعجابات الحالية
    const result = await SELECTDataPrivatPostonObject(PostID);
    const Count = await SELECTCOUNTCOMMENTANDLIKPOST(PostID, "Likes");

    // جلب توكن المستخدم والمستخدمين المرتبطين
    const { token, arraynameuser, jobUser } = await Bringtokenuser(
      result.CommpanyID,
      result.ProjectID,
      userName,
      "PublicationsBransh"
    );

    // إعداد الإشعار
    const notification = {
      title: `إلغاء الاعجاب بمنشور`,
      body: `لقد قام ${userName} بإلغاء الاعجاب على منشور ${result.postBy}`,
    };

    const notification_type = "PublicationsBransh";
    const navigationId = `${PostID}/${result.CommpanyID}/navigation`;

    // بيانات الإشعار
    let data = {
      ProjectID: result.ProjectID,
      userName,
      kind,
      type,
      data: [], // لا يوجد بيانات إضافية هنا
      PostID,
      count: Count["COUNT(userName)"],
      jobUser,
    };

    // إدراج الإشعار في النظام
    const idmax = await InsertNotifcation(
      arraynameuser,
      notification,
      notification_type,
      navigationId,
      data,
      result.ProjectID
    );

    data = { ...data, id: idmax };

    // إرسال الإشعار للمستخدمين
    await massges(token, notification, notification_type, navigationId, data);

  } catch (error) {
    console.error("Error in PostsnotificationCansle:", error);
  }
};


//  اشعارات الدردشة

/**
 * إرسال إشعار دردشة مشروع أو قسم محدد
 * @param {number|string} idProject - معرف المشروع
 * @param {number|string} StageID - معرف المرحلة أو اسم القسم
 * @param {string} massgs - نص الرسالة
 * @param {string} userName - اسم المستخدم الذي أرسل الرسالة
 * @param {object} Reply - بيانات الرد في حال كانت الرسالة ردًا
 * @param {object} File - بيانات الملف المرفق إن وجد
 */
const ChateNotfication = async (
  idProject,
  StageID,
  massgs,
  userName = "",
  Reply = {},
  File = {}
) => {
  try {
    let nameChate = StageID;
    let arrayuser, tokenuser, job;
    let bodymassge, insertnavigation = "pr.id", IDCompanySub = 0, Nameproject = "";

    const specialStages = ["قرارات", "استشارات", "اعتمادات"];

    if (!specialStages.includes(StageID)) {
      const Project = await SELECTProjectStartdate(idProject);
      IDCompanySub = Project?.IDCompanySub;
      Nameproject = Project?.Nameproject;

      if (Number(StageID) || StageID === "A1" || StageID === ":A1") {
        const Stage = await SELECTTablecompanySubProjectStageCUSTONe(idProject, StageID);
        nameChate = Stage.StageName;
      }

      const { token, arraynameuser, jobUser } = await BringtokenuserCustom(
        Project.NumberCompany,
        idProject,
        userName,
        "chate"
      );

      arrayuser = arraynameuser;
      tokenuser = token;
      job = jobUser;
      bodymassge = `دردشة مشروع ${Nameproject} قسم ${nameChate}`;
    } else {
      const company = await SelectVerifycompanyexistence(idProject);
      const { token, arraynameuser, jobUser } = await Bringtokenuser(
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

    const title =
      Object.keys(Reply).length === 0
        ? userName
        : `لقد قام ${userName} بالرد على رسالة ${Reply.Sender}`;

    const notification_type = "Chate";
    const navigationId = `${StageID}/${idProject}/${nameChate}/${Nameproject}/navigation`;

    // إعداد الصورة أو نوع الملف إن وجد
    let image = null;
    let typfile = null;
    if (Object.keys(File).length > 0) {
      image = String(File.type).includes("video")
        ? String(File.name).replace("mp4", "png")
        : File.name;
      image = `https://storage.googleapis.com/demo_backendmoshrif_bucket-1/${image}`;

      typfile = String(File.type).includes("video")
        ? "ارفق فديو"
        : String(File.type).includes("image")
        ? "ارفق صورة"
        : "ارفق ملف";
    }

    const notification = {
      title,
      body: bodymassge + `< ${String(massgs).length > 0 ? massgs : typfile} >`,
      image,
    };

    let data = {
      ProjectID: idProject,
      userName: userName,
      type: `chate`,
      kind: "new",
      nameRoom: nameChate,
      Nameproject: Nameproject,
      StageID: StageID,
      IDcompanySub:IDCompanySub,
      jobUser: job,
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
    data = { ...data, id: idmax };

    await massges(tokenuser, notification, notification_type, navigationId, data);

  } catch (error) {
    console.error("Error in ChateNotfication:", error);
  }
};


/**
 * إرسال إشعار عند حذف رسالة دردشة
 * @param {number|string} idProject - معرف المشروع
 * @param {number|string} StageID - معرف المرحلة أو اسم القسم
 * @param {string} massgs - نص الرسالة المحذوفة
 * @param {string} userName - اسم المستخدم الذي حذف الرسالة
 * @param {string|number} chatID - معرف الرسالة المحذوفة
 */
const ChateNotficationdelete = async (idProject, StageID, massgs, userName = "", chatID) => {
  try {
    let nameChate, arrayuser, tokenuser, bodymassge;
    let insertnavigation = "pr.id";

    const specialStages = ["قرارات", "استشارات", "اعتمادات"];

    if (!specialStages.includes(StageID)) {
      const Stage = await SELECTTablecompanySubProjectStageCUSTONe(idProject, StageID);
      nameChate = Number(StageID) || StageID === "A1" || StageID === ":A1" ? Stage.StageName : StageID;

      const Project = await SELECTProjectStartdate(idProject);
      const { token, arraynameuser } = await BringtokenuserCustom(Stage.NumberCompany, idProject, userName, "chate");

      arrayuser = arraynameuser;
      tokenuser = token;
      bodymassge = `دردشة مشروع ${Project?.Nameproject} قسم ${nameChate}`;
    } else {
      const company = await SelectVerifycompanyexistence(idProject);
      const { token, arraynameuser } = await Bringtokenuser(company.id, idProject, userName, StageID, "RE.CommercialRegistrationNumber=?");

      arrayuser = arraynameuser;
      tokenuser = token;
      nameChate = StageID;
      bodymassge = `دردشة ${nameChate}`;
      insertnavigation = true;
    }

    const notification = {
      title: `لقد قام ${userName} بحذف الرسالة`,
      body: bodymassge + `< ${String(massgs).length > 0 ? massgs : ""} >`,
    };

    const notification_type = "Chate";
    const navigationId = `${StageID}/${idProject}/${nameChate}/""/navigation`;

    let data = {
      ProjectID: idProject,
      userName,
      StageID,
      type: `chatedelete`,
      nameRoom: nameChate,
      chatID,
    };

    const idmax = await InsertNotifcation(arrayuser, notification, notification_type, navigationId, data, idProject, insertnavigation);
    data = { ...data, id: idmax };

    await massges(tokenuser, notification, notification_type, navigationId, data);
  } catch (error) {
    console.error("Error in ChateNotficationdelete:", error);
  }
};


// ChateNotfication(1,'طلبات','كيف الحال');

// اشعارات اضافة مستخدم او حذفة

/**
 * إضافة أو تحديث مستخدم وإرسال إشعار
 * @param {string} PhoneNumber - رقم هاتف المستخدم
 * @param {any} Validity - بيانات الصلاحية أو الحالة للمستخدم
 * @param {string} type - نوع العملية (مثل: "إضافة" أو "تحديث")
 * @param {string} userName - اسم المستخدم الذي قام بالفعل
 */
const AddOrUpdatuser = async (PhoneNumber, Validity, type, userName) => {
  try {
    // جلب بيانات المستخدم الحالي
    const result = await SELECTTableLoginActivatActivaty(PhoneNumber);

    // إعداد الإشعار
    const notification = {
      title: type,
      body: `لقد قام ${userName} ب${type}`,
    };

    // بيانات الإشعار للتنقل
    const data = {
      ProjectID: 0,
      userName: userName,
      type: `user`,
      data: Validity,
    };

    // تحضير البيانات لإدراجها في جدول التنقل
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

    // إدراج البيانات في جدول التنقل
    await insertTableNavigation(endData);

    // تحديث صلاحية المستخدم في قاعدة البيانات
    await UpdateTableLoginActivatyValidityORtoken(
      JSON.stringify(Validity),
      PhoneNumber,
      "Validity"
    );

    // إرسال الإشعار للمستخدم عبر التوكن
    await massges([String(result.token)], notification, "", "", data);
  } catch (error) {
    console.error("Error in AddOrUpdatuser:", error);
  }
};


// طلبات العهد
/**
 * إرسال إشعار لطلبات العهدة أو قبول/رفض العهدة
 * @param {number|string} IDCompanySub - رقم الشركة الفرعية
 * @param {string} PhoneNumber - رقم الهاتف أو اسم المستخدم المعني
 * @param {string} type - نوع العملية ("request" | "acceptance" | "reject") - القيمة الافتراضية "request"
 * @param {number} id - معرف الطلب عند التعامل مع القبول/الرفض
 */
const CovenantNotfication = async (IDCompanySub, PhoneNumber, type = "request", id = 0) => {
  try {
    let result;
    let tokens;
    let arraynameusers;
    let IDCompanySubs = IDCompanySub;
    let job = "";

    if (type === "request") {
      // جلب بيانات المستخدم الذي طلب العهدة
      result = await SELECTTableLoginActivatActivaty(PhoneNumber);
      const { token, arraynameuser, jobUser } = await BringtokenuserCustom(
        result.IDCompany,
        IDCompanySubs,
        result.userName,
        "all",
        "CovenantBrinsh"
      );
      tokens = token;
      arraynameusers = arraynameuser;
      job = jobUser;
    } else {
      // جلب بيانات الطلب عند القبول أو الرفض
      const datacovenent = await SELECTTableMaxFinancialCustody(id, "all");
      result = await SELECTTableLoginActivatActivaty(datacovenent.Requestby);
      tokens = [String(result.token)];
      arraynameusers = [result.userName];
      IDCompanySubs = datacovenent.IDCompanySub;
    }

    // إعداد عنوان الإشعار بناءً على نوع العملية
    let title =
      type === "request"
        ? `لقد قام ${result.userName} بطلب عهده`
        : type === "acceptance"
        ? `لقد قام ${PhoneNumber} بقبول عهدتك`
        : `لقد قام ${PhoneNumber} برفض عهدتك`;

    const notification_type = "CovenantBrinsh";
    const navigationId = `${IDCompanySubs}`;

    const notification = {
      title,
      body: title,
    };

    const data = {
      ProjectID: 0,
      userName: result.userName,
      IDCompanySub: IDCompanySubs,
      type:
        type === "request"
          ? "arrayOpen"
          : type === "acceptance"
          ? "arrayClosed"
          : "arrayReject",
      jobUser: job,
    };

    // تحضير البيانات لإدراجها في جدول التنقل
    const endData = [
      IDCompanySubs,
      0,
      JSON.stringify(notification),
      JSON.stringify(arraynameusers),
      JSON.stringify({
        notification_type,
        navigationId,
        data: JSON.stringify(data),
      }),
      new Date().toUTCString(),
    ];

    await insertTableNavigation(endData);

    // إرسال الإشعار للمستخدمين
    await massges(tokens, notification, notification_type, navigationId, data);
  } catch (error) {
    console.error("Error in CovenantNotfication:", error);
  }
};


// bring token all users
/**
 * جلب توكنات المستخدمين وأسماؤهم المرتبطين بمشروع أو شركة فرعية
 * @param {number|string} IDCompany - رقم الشركة
 * @param {number|string} ProjectID - رقم المشروع
 * @param {string} userName - اسم المستخدم الذي قام بالفعل (يُستثنى من الإشعار)
 * @param {string} [type="all"] - نوع التصفية ("all" | "PublicationsBransh" ...)
 * @param {string} [wheretype="PR.id =?"] - شرط البحث في قاعدة البيانات
 * @returns {Promise<{ token: string[], users: object[], arraynameuser: string[], jobUser: string }>}
 */
const Bringtokenuser = async (
  IDCompany,
  ProjectID,
  userName,
  type = "all",
  wheretype = "PR.id =?"
) => {
  let token = [];
  let arraynameuser = [];
  let jobUser;

  const users = await SELECTTableusersCompanySub(IDCompany, ProjectID, type, wheretype);

  await Promise.all(
    users.map(async (item) => {
      // استثناء المستخدم الحالي (الذي قام بالفعل)
      if (item.userName === userName) {
        jobUser = item.job;
        return;
      }

      // في حالة المنشورات أو التسجيل التجاري
      if (type === "PublicationsBransh" || wheretype === "RE.CommercialRegistrationNumber=?") {
        if (item.jobdiscrption === "موظف") {
          token.push(item.token);
          arraynameuser.push(item.userName);
        } else {
          // إذا لم يكن "موظف" → تحقق من صلاحياته
          const validity = item.Validity ? JSON.parse(item.Validity) : [];
          validity.forEach((element) => {
            const hasProject = element.project?.some(
              (p) => p.idProject === ProjectID
            );
            if (hasProject) {
              token.push(item.token);
              arraynameuser.push(item.userName);
            }
          });
        }
      }

      // الحالة الافتراضية: wheretype = "PR.id =?"
      else if (wheretype === "PR.id =?") {
        token.push(item.token);
        arraynameuser.push(item.userName);
      }

      // حالات أخرى
      else {
        if (item.jobdiscrption === "موظف") {
          token.push(item.token);
          arraynameuser.push(item.userName);
        }
      }
    })
  );

  return { token, users, arraynameuser, jobUser };
};


// bring token custom users
/**
 * جلب توكنات المستخدمين بناءً على الصلاحيات/العهود/المشاريع
 * @param {number|string} IDCompany - رقم الشركة
 * @param {number|string} ProjectID - رقم المشروع
 * @param {string} userName - اسم المستخدم الحالي (مستثنى)
 * @param {string} [type="all"] - نوع التصفية (all | Finance ...)
 * @param {string} [kind="sub"] - نوع التصفية (sub | CovenantBrinsh ...)
 * @returns {Promise<{ token: string[], users: object[], arraynameuser: string[], jobUser: string }>}
 */
const BringtokenuserCustom = async (
  IDCompany,
  ProjectID,
  userName,
  type = "all",
  kind = "sub"
) => {
  let token = [];
  let arraynameuser = [];
  let jobUser;

  const users = await SELECTTableusersCompanySub(IDCompany, ProjectID, type);

  await Promise.all(
    users.map(async (item) => {
      // استثناء المستخدم الحالي
      if (item.userName === userName) {
        jobUser = item.job;
        return;
      }

      // حالة Admin أو مالية عند العهد
      if (item.job === "Admin" || (item.job === "مالية" && kind === "CovenantBrinsh")) {
        token.push(item.token);
        arraynameuser.push(item.userName);
        return;
      }

      // تحقق من الصلاحيات
      const validity = item.Validity ? JSON.parse(item.Validity) : [];

      for (const element of validity) {
        // لازم نفس الفرع
        if (parseInt(element.idBrinsh) !== parseInt(item.IDcompanySub)) continue;

        // حالة العهد وقبول العهود
        if (kind === "CovenantBrinsh" && element.Acceptingcovenant === true) {
          token.push(item.token);
          arraynameuser.push(item.userName);
          continue;
        }

        // مدير الفرع أو غير sub
        if (element.job === "مدير الفرع" || kind !== "sub") {
          if (kind !== "sub") {
            if (element.jobdiscrption === "موظف") {
              token.push(item.token);
              arraynameuser.push(item.userName);
            }
          } else {
            token.push(item.token);
            arraynameuser.push(item.userName);
          }
          continue;
        }

        // تحقق من المشاريع
        for (const project of element.project || []) {
          if (project.idProject === ProjectID) {
            if (type === "Finance") {
              const hasFinanceNotif = project.ValidityProject?.includes("إشعارات المالية");
              if (hasFinanceNotif) {
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
    })
  );

  return { token, users, arraynameuser, jobUser };
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
