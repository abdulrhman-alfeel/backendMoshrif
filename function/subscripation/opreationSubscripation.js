const moment = require("moment-timezone");
const cron = require("node-cron");

const {
  inserTableSubscripation,
  inserTableInvoice,
} = require("../../sql/INsertteble");
const {
  SELECTTABLESUBSCRIPATION,
  SELECTTablecompanyall,
} = require("../../sql/selected/selected");
const {
  calculateDaysDifference,
  subscripation,
  calculateAcountsubscripation,
} = require("../../middleware/Aid");
const { UpdateStateComany, Updatesubscripation } = require("../../sql/update");

const insertDataproject = async (IDCompany, ProjectID) => {
  try {
    const newDate = moment.parseZone(new Date()).format("yy-MM-DD");
    const endDate = `${moment.parseZone(newDate).format("yy-MM")}-30`;
    console.log(endDate, newDate);
    await inserTableSubscripation([IDCompany, ProjectID, newDate, endDate]);
  } catch (error) {
    console.log(error);
  }
};

const opreationInvoice = () => {
  return async (req, res) => {
    let totalComapny = 0;
    let acountscripationproject = [];
    let acountscripationCompany = [];
    let pricscripation = subscripation.company;
    const company = await SELECTTablecompanyall("id,NameCompany");
    const newDate = new Date();
    for (let index = 0; index < company.length; index++) {
      const element = company[index];

      // طلب بيانات المشاريع للشركة
      const result = await SELECTTABLESUBSCRIPATION(element.id, newDate);

      for (let index = 0; index < result.length; index++) {
        const elementProject = result[index];

        // حساب عدد ايام المشروع لاخر يوم بالشهر
        const numberday = await calculateDaysDifference(
          elementProject.StartDate,
          elementProject.EndDate
        );
        //  حساب الاشتراك الشهري
        const scripationday = await calculateAcountsubscripation(
          pricscripation
        );

        // حساب الفاتورة لكل مشروع
        const totalProject = parseInt(numberday) * parseInt(scripationday);

        acountscripationproject.push({
          price: totalProject,
          id: elementProject.id,
        });

        totalComapny += totalProject;
      }
      //  حساب اجمالي التكلفة لجميع المشاريع
      acountscripationCompany.push({
        subscripation: totalComapny,
        IDCompany: element.id,
        Subscripation_end_date:
          parseInt(moment.parseZone(new Date()).format("DD")) + 5,
      });
    }
  };
};

const operationInvoice = () => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }

      
      let accountsSubscriptionProject = [];
      let accountsSubscriptionCompany = [];

      const priceSubscription = subscripation.company;
      const companies = await SELECTTablecompanyall("id,NameCompany");

      const today = new Date();

      for (const company of companies) {
        let totalCompany = 0;

        // جلب المشاريع التابعة للشركة
        const projects = await SELECTTABLESUBSCRIPATION(company.id, today);

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
            parseInt(numberOfDays) * parseInt(subscriptionPerDay);

          accountsSubscriptionProject.push({
            projectId: project.id,
            price: totalProject,
          });

          totalCompany += totalProject;
        }

        // حساب نهاية الاشتراك (مثلاً بعد 5 أيام من اليوم الحالي)
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

      for (const projectinvoic of accountsSubscriptionProject) {
        await Updatesubscripation(projectinvoic.price, projectinvoic.projectId);
      }
      for (const companys of accountsSubscriptionCompany) {
        await UpdateStateComany(
          companys.subscriptionEndDate,
          companys.companyId
        );
        await inserTableInvoice([
          companys.companyId,
          companys.subscription,
          companys.subscriptionEndDate,
          "true",
        ]);
      }

      // إرسال النتيجة كـ response
      return res
        .json({
          success: true,
        })
        .status(200);
    } catch (error) {
      console.error("Error in operationInvoice:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  };
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
        await UpdateStateComany("false",company.id,'State');

        console.log(
          `🔴 الشركة ${company.NameCompany} انتهى اشتراكها وتم تعطيلها`
        );
      }
    }
  } catch (error) {
    console.error("Error checking subscriptions:", error);
  }
}

// جدولة المهمة لتعمل مرة باليوم (الساعة 12 صباحاً)
cron.schedule("0 0 * * *", () => {
  console.log("⏰ تشغيل التحقق اليومي من الاشتراكات...");
  checkCompanySubscriptions();
});
