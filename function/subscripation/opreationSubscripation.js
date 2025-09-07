const moment = require("moment-timezone");

const {
  inserTableSubscripation,
  inserTableInvoice,
} = require("../../sql/INsertteble");
const {
  SELECTTABLESUBSCRIPATION,
  SELECTTablecompanyall,
  SELECTIDcompanyANDpreoject,
  selectprojectdatabycompany,
  SelectInvoicesubscripation,
} = require("../../sql/selected/selected");
const {
  calculateDaysDifference,
  subscripation,
  calculateAcountsubscripation,
  calculateendDate,
  convertTimeToMonth,
} = require("../../middleware/Aid");
const { UpdateStateComany, Updatesubscripation } = require("../../sql/update");
const { bucket } = require("../../bucketClooud");
const path = require("path");
const fs = require("fs");
const { HtmlStatmentSubscription } = require("../../pdf/writHtml");
const { convertHtmlToPdf } = require("../../pdf/convertotpdf");
const { implmentOpreationSingle } = require("../../middleware/Fsfile");

const insertDataprojectsubScripation = async (IDCompany, ProjectID) => {
  try {
    const newDate = moment.parseZone(new Date()).format("yy-MM-DD");
    const month = moment.parseZone(newDate).format("yy-MM");
    const endDate = `${month}-${calculateendDate(month)}`;
    await inserTableSubscripation([IDCompany, ProjectID, newDate, endDate]);
  } catch (error) {
    console.log(error);
  }
};

const insertallprojectinSubscripation = async () => {
  const data = await SELECTIDcompanyANDpreoject();
  for (const i of data) {
    await insertDataprojectsubScripation(i.IDCompany, i.ProjectID);
  console.log("done");
  }
};
// insertallprojectinSubscripation();
const operationInvoice = async () => {
  try {
    let accountsSubscriptionProject = [];
    let accountsSubscriptionCompany = [];

    let priceSubscription = subscripation.singular;
    const companies = await SELECTTablecompanyall("id,NameCompany");

    const today = new Date();
    for (const company of companies) {
      let totalCompany = 0;

      // جلب المشاريع التابعة للشركة
      const projects = await SELECTTABLESUBSCRIPATION(
        company.id,
        moment(today).format("YYYY-MM-DD")
      );
      priceSubscription =
        projects.length > 3 ? subscripation.company : subscripation.singular;
      for (const project of projects) {
        // حساب عدد الأيام بين البداية والنهاية
        const numberOfDays = await calculateDaysDifference(
          project.StartDate,
          project.EndDate
        );

        // حساب تكلفة الاشتراك باليوم
        const subscriptionPerDay = await calculateAcountsubscripation(
          priceSubscription
        );

        // التكلفة النهائية للمشروع
        const totalProject =
          parseFloat(numberOfDays) * parseFloat(subscriptionPerDay);

        accountsSubscriptionProject.push({
          id: project.id,
          projectId: project.ProjectID,
          price: totalProject,
          companyId: company.id,
        });
        totalCompany += totalProject;
      }

      // حساب نهاية الاشتراك (مثلاً بعد 5 أيام من اليوم الحالي)
      // const subscriptionEndDate = moment(today).format("YYYY-MM-DD");
      const subscriptionEndDate = moment(today)
        .add(5, "days")
        .format("YYYY-MM-DD");
      // حفظ اجمالي اشتراك الشركة
      accountsSubscriptionCompany.push({
        companyId: company.id,
        subscription: totalCompany,
        subscriptionEndDate,
      });
    }

    const newDate = moment.parseZone(new Date()).format("yy-MM-DD");
    const month = moment.parseZone(newDate).add(1, "month").format("yy-MM");
    const endDate = `${month}-${calculateendDate(month)}`;

    for (const projectinvoic of accountsSubscriptionProject) {
      await Updatesubscripation(projectinvoic.price, projectinvoic.id);
      await insertsubscripationnew(projectinvoic.companyId, newDate, endDate);
    }

    for (const companys of accountsSubscriptionCompany) {
      await UpdateStateComany(companys.subscriptionEndDate, companys.companyId);
      await inserTableInvoice([
        companys.companyId,
        companys.subscription,
        companys.subscriptionEndDate,
        "true",
      ]);
    }
  } catch (error) {
    console.error("Error in operationInvoice:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const insertsubscripationnew = async (id, newDate, endDate) => {
  const dataProjectnew = await selectprojectdatabycompany(id);
  for (const project of dataProjectnew) {
    await inserTableSubscripation([id, project.ProjectID, newDate, endDate]);
  }
};

// دالة التحقق من الشركات
async function checkCompanySubscriptions() {
  try {
    const today = moment().format("YYYY-MM-DD");

    // جلب جميع الشركات
    const companies = await SELECTTablecompanyall(
      "id, NameCompany, subscriptionEndDate, State"
    );

    for (const company of companies) {
      if (moment(today).isSameOrAfter(company.subscriptionEndDate)) {
        // إذا انتهى الاشتراك نخلي الشركة غير نشطة
        await UpdateStateComany("false", company.id, "State");

        console.log(
          `🔴 الشركة ${company.NameCompany} انتهى اشتراكها وتم تعطيلها`
        );
      }
    }
  } catch (error) {
    console.error("Error checking subscriptions:", error);
  }
}

// شهر غير معروف
// console.log(convertTimeToMonth(moment().format("YYYY-MM-DD")));
async function uploadFile(outputPrefix, filePath) {
  try {
    await bucket.upload(filePath, {
      destination: outputPrefix,
    });

    console.log("✅ File uploaded successfully");
  } catch (err) {
    console.error("❌ Upload failed:", err);
  }
}

const bringInvoicedetails = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        return res.status(401).send("Invalid session");
      }
      const prevMonth = moment().subtract(1, "month").format("YYYY-MM-DD");

      const data = await SelectInvoicesubscripation(
        userSession.IDCompany,
        prevMonth
      );

      if (!data || data.length === 0) {
        return res.status(404).send("No subscription data found");
      }

      const month = convertTimeToMonth(prevMonth);
      const namefile = `${data[0].CommercialRegistrationNumber}_${month}_.pdf`;
      const filePath = path.join(__dirname, "../../upload", namefile);

      const htmlContent = await HtmlStatmentSubscription(data);
      await convertHtmlToPdf(htmlContent, filePath);

      const outputPrefix = `${data[0].CommercialRegistrationNumber}/invoice/${namefile}`;

      if (fs.existsSync(filePath)) {
        await uploadFile(outputPrefix, filePath);
        implmentOpreationSingle("upload", namefile);
      }

      const fileUrl = `https://storage.googleapis.com/demo_backendmoshrif_bucket-1/${outputPrefix}`;

      return res.status(200).send({
        success: "Inactive",
        url: fileUrl,
      });
    } catch (err) {
      console.error("❌ Error in bringInvoicedetails:", err);
      return res
        .status(500)
        .send({ success: "Inactive" ,error: "Internal server error", details: err.message });
    }
  };
};

module.exports = {
  insertDataprojectsubScripation,
  operationInvoice,
  checkCompanySubscriptions,
  bringInvoicedetails,
};
