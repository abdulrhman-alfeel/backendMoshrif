const express = require("express");
const db = require("../sql/sqlite");
const { verifyJWT } = require("../middleware/jwt");
const { Addusertraffic } = require("../middleware/Aid");
const router = express.Router();
router.use(verifyJWT);

// Helper function to transform company data for subscriptions
function transformCompanyDataForSubscriptions(company) {
  // حساب الحالة بناءً على تاريخ الانتهاء
  const endDate = new Date(company.SubscriptionEndDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

  let status;
  if (daysUntilExpiry < 0) {
    status = "expired";
  } else if (daysUntilExpiry <= 30) {
    status = "expiring";
  } else {
    status = "active";
  }

  // تحويل التواريخ إلى التنسيق الميلادي
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return {
    id: company.id,
    companyId: company.id,
    companyName: company.NameCompany,
    planName: getSubscriptionPlan(company.Cost), // تحديد الباقة بناءً على التكلفة
    startDate: formatDate(company.SubscriptionStartDate),
    endDate: formatDate(company.SubscriptionEndDate),
    amount: company.Cost || 0,
    status: status,
    autoRenew: false, // يمكن إضافة هذا العمود لاحقاً
    paymentMethod: "تحويل بنكي", // يمكن إضافة هذا العمود لاحقاً
    branchesAllowed: company.NumberOFbranchesAllowed || 0,
    currentBranches:
      company.actualBranchesCount || company.NumberOFcurrentBranches || 0,
    remainingBranches:
      (company.NumberOFbranchesAllowed || 0) -
      (company.actualBranchesCount || company.NumberOFcurrentBranches || 0),
    registrationNumber: company.CommercialRegistrationNumber || "",
    city: company.City || "",
    country: company.Country || "",
    createdAt: formatDate(company.SubscriptionStartDate),
  };
}

// Helper function to determine subscription plan based on cost
function getSubscriptionPlan(cost) {
  if (!cost || cost === 0) return "تجريبية";
  if (cost <= 1000) return "الباقة الأساسية";
  if (cost <= 5000) return "الباقة المتقدمة";
  return "الباقة الشاملة";
}

// GET /api/subscriptions - جلب جميع اشتراكات الشركات
router.get("/", async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      sortBy = "SubscriptionEndDate",
      sortOrder = "ASC",
      number = 0,
    } = req.query;

    const offset = (page - 1) * limit;
    let whereClause = "WHERE 1=1";
    let params = [];

    // البحث في اسم الشركة
    if (search) {
      whereClause += " AND NameCompany LIKE ?";
      params.push(`%${search}%`);
    }

    // فلترة حسب الحالة
    if (status === "active") {
      whereClause += ' AND SubscriptionEndDate > date("now", "+30 days")';
    } else if (status === "expired") {
      whereClause += ' AND SubscriptionEndDate < date("now")';
    } else if (status === "expiring") {
      whereClause +=
        ' AND SubscriptionEndDate > date("now") AND SubscriptionEndDate <= date("now", "+30 days")';
    }

    // جلب العدد الكلي
    const countQuery = `SELECT COUNT(*) as total FROM company ${whereClause}`;
    const countResult = await db.getRow(countQuery, params);
    const total = countResult.total;

    // جلب الاشتراكات مع التصفح
    const validSortFields = [
      "NameCompany",
      "SubscriptionStartDate",
      "SubscriptionEndDate",
      "Cost",
    ];
    const sortField = validSortFields.includes(sortBy)
      ? sortBy
      : "SubscriptionEndDate";
    const order = sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const query = `
      SELECT * FROM company 
      ${whereClause} AND id > ${number}
      ORDER BY ${sortField} ${order}
      LIMIT ? OFFSET ?
    `;

    const companies = await db.getAllRows(query, [
      ...params,
      parseInt(limit),
      offset,
    ]);

    // تحويل البيانات لتنسيق الاشتراكات مع حساب عدد الفروع الفعلية
    const subscriptions = await Promise.all(
      companies.map(async (company) => {
        // حساب عدد الفروع الفعلية من جدول companySub
        const actualBranchesCount = await db.getRow(
          "SELECT COUNT(*) as count FROM companySub WHERE NumberCompany = ?",
          [company.id]
        );

        // تحديث عدد الفروع الحالية
        company.actualBranchesCount = actualBranchesCount?.count || 0;

        // إصلاح المشكلة إذا كان عدد الفروع المسموحة = 0
        if (company.NumberOFbranchesAllowed === 0) {
          // تحديث عدد الفروع المسموحة إلى رقم مناسب
          const suggestedLimit =
            company.actualBranchesCount > 0
              ? Math.max(company.actualBranchesCount + 5, 10)
              : 10;
          await db.query(
            "UPDATE company SET NumberOFbranchesAllowed = ?, NumberOFcurrentBranches = ? WHERE id = ?",
            [suggestedLimit, company.actualBranchesCount, company.id]
          );
          company.NumberOFbranchesAllowed = suggestedLimit;
          company.NumberOFcurrentBranches = company.actualBranchesCount;
        }
        // إصلاح NumberOFcurrentBranches إذا كان مختلفاً عن الفروع الفعلية
        else if (
          company.NumberOFcurrentBranches !== company.actualBranchesCount
        ) {
          await db.query(
            "UPDATE company SET NumberOFcurrentBranches = ? WHERE id = ?",
            [company.actualBranchesCount, company.id]
          );
          company.NumberOFcurrentBranches = company.actualBranchesCount;
        }

        return transformCompanyDataForSubscriptions(company);
      })
    );

    res.json({
      success: true,
      data: subscriptions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/subscriptions/stats - إحصائيات الاشتراكات
router.get("/stats", async (req, res, next) => {
  try {
    // إجمالي الشركات
    const totalCompanies = await db.getRow(
      "SELECT COUNT(*) as count FROM company"
    );

    // الاشتراكات النشطة (جميع الاشتراكات التي لم تنته بعد)
    const activeSubscriptions = await db.getRow(
      'SELECT COUNT(*) as count FROM company WHERE SubscriptionEndDate > date("now")'
    );

    // الاشتراكات المنتهية
    const expiredSubscriptions = await db.getRow(
      'SELECT COUNT(*) as count FROM company WHERE SubscriptionEndDate < date("now")'
    );

    // الاشتراكات المنتهية خلال 30 يوم
    const expiringSoon = await db.getRow(
      'SELECT COUNT(*) as count FROM company WHERE SubscriptionEndDate > date("now") AND SubscriptionEndDate <= date("now", "+30 days")'
    );

    // إجمالي العهد
    const totalRevenue = await db.getRow(
      "SELECT SUM(Cost) as total FROM company WHERE Cost > 0"
    );

    // متوسط التكلفة
    const averageCost = await db.getRow(
      "SELECT AVG(Cost) as average FROM company WHERE Cost > 0"
    );

    res.json({
      success: true,
      data: {
        totalCompanies: totalCompanies.count,
        activeSubscriptions: activeSubscriptions.count,
        expiredSubscriptions: expiredSubscriptions.count,
        expiringSoon: expiringSoon.count,
        totalRevenue: totalRevenue.total || 0,
        averageCost: Math.round(averageCost.average || 0),
        statusDistribution: {
          active: activeSubscriptions.count,
          expiring: expiringSoon.count,
          expired: expiredSubscriptions.count,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/subscriptions/pending-requests - جلب الطلبات المعلقة
router.get("/pending-requests", async (req, res, next) => {
  try {
    console.log("🔍 تم استلام طلب جلب الطلبات المعلقة");

    // جلب الطلبات المعلقة من قاعدة البيانات
    const pendingRequests = await db.getAllRows(
      'SELECT * FROM subscription_requests WHERE status = "pending" ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      data: pendingRequests || [],
    });
  } catch (error) {
    console.error("❌ خطأ في جلب الطلبات المعلقة:", error);
    next(error);
  }
});

// GET /api/subscriptions/:id - جلب اشتراك محدد
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const company = await db.getRow("SELECT * FROM company WHERE id = ?", [id]);

    if (!company) {
      return res.status(404).json({
        success: false,
        error: "الشركة غير موجودة",
      });
    }

    // جلب معلومات إضافية عن الفروع
    const branches = await db.getAllRows(
      "SELECT * FROM companySub WHERE NumberCompany = ? ORDER BY NameSub",
      [id]
    );

    // حساب عدد الفروع الفعلية
    company.actualBranchesCount = branches.length;

    // إصلاح المشكلة إذا كان عدد الفروع المسموحة = 0
    if (company.NumberOFbranchesAllowed === 0) {
      // تحديث عدد الفروع المسموحة إلى رقم مناسب
      const suggestedLimit =
        company.actualBranchesCount > 0
          ? Math.max(company.actualBranchesCount + 5, 10)
          : 10;
      await db.query(
        "UPDATE company SET NumberOFbranchesAllowed = ?, NumberOFcurrentBranches = ? WHERE id = ?",
        [suggestedLimit, company.actualBranchesCount, company.id]
      );
      company.NumberOFbranchesAllowed = suggestedLimit;
      company.NumberOFcurrentBranches = company.actualBranchesCount;
    }
    // إصلاح NumberOFcurrentBranches إذا كان مختلفاً عن الفروع الفعلية
    else if (company.NumberOFcurrentBranches !== company.actualBranchesCount) {
      await db.query(
        "UPDATE company SET NumberOFcurrentBranches = ? WHERE id = ?",
        [company.actualBranchesCount, company.id]
      );
      company.NumberOFcurrentBranches = company.actualBranchesCount;
    }

    const subscription = transformCompanyDataForSubscriptions(company);
    subscription.branches = branches;

    res.json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/subscriptions/:id/renew - تجديد اشتراك
router.put("/:id/renew", async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      planType = "الباقة الأساسية",
      duration = 12, // عدد الأشهر
      cost,
      startDate,
      paymentMethod = "تحويل بنكي",
    } = req.body;

    // التحقق من وجود الشركة
    const company = await db.getRow("SELECT * FROM company WHERE id = ?", [id]);
    if (!company) {
      return res.status(404).json({
        success: false,
        error: "الشركة غير موجودة",
      });
    }

    // حساب تاريخ البداية والنهاية
    const subscriptionStart =
      startDate || new Date().toISOString().split("T")[0];
    const endDate = new Date(subscriptionStart);
    endDate.setMonth(endDate.getMonth() + duration);
    const subscriptionEnd = endDate.toISOString().split("T")[0];

    // تحديث الاشتراك
    await db.query(
      `UPDATE company 
       SET SubscriptionStartDate = ?, 
           SubscriptionEndDate = ?, 
           Cost = ?
       WHERE id = ?`,
      [subscriptionStart, subscriptionEnd, cost, id]
    );

    // جلب البيانات المحدثة
    const updatedCompany = await db.getRow(
      "SELECT * FROM company WHERE id = ?",
      [id]
    );
    const updatedSubscription =
      transformCompanyDataForSubscriptions(updatedCompany);

    res.json({
      success: true,
      data: updatedSubscription,
      message: "تم تجديد الاشتراك بنجاح",
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/subscriptions/:id/suspend - إيقاف اشتراك
router.put("/:id/suspend", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason = "إيقاف إداري" } = req.body;
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
    }
    Addusertraffic(
      userSession.userName,
      userSession?.PhoneNumber,
      "Stopsubscriptionsdaschbord"
    );
    // التحقق من وجود الشركة
    const company = await db.getRow("SELECT * FROM company WHERE id = ?", [id]);
    if (!company) {
      return res.status(404).json({
        success: false,
        error: "الشركة غير موجودة",
      });
    }

    // تحديث تاريخ انتهاء الاشتراك لليوم الحالي
    const today = new Date().toISOString().split("T")[0];
    await db.query("UPDATE company SET SubscriptionEndDate = ? WHERE id = ?", [
      today,
      id,
    ]);

    // جلب البيانات المحدثة
    const updatedCompany = await db.getRow(
      "SELECT * FROM company WHERE id = ?",
      [id]
    );
    const updatedSubscription =
      transformCompanyDataForSubscriptions(updatedCompany);

    res.json({
      success: true,
      data: updatedSubscription,
      message: "تم إيقاف الاشتراك بنجاح",
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/subscriptions/requests - طلبات الاشتراك الجديدة
router.post("/requests", async (req, res, next) => {
  try {
    const {
      companyName,
      contactEmail,
      contactPhone,
      planType,
      duration,
      amount,
      registrationNumber,
      notes,
    } = req.body;
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
    }
    Addusertraffic(
      userSession.userName,
      userSession?.PhoneNumber,
      "insertrequestsscriptionsdaschbord"
    );
    //
    // إدخال الطلب في قاعدة البيانات
    const result = await db.query(
      `
      INSERT INTO subscription_requests 
      (companyName, contactEmail, contactPhone, planType, duration, amount, registrationNumber, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        companyName,
        contactEmail,
        contactPhone,
        planType || "أساسي",
        duration || 12,
        amount || 0,
        registrationNumber,
        notes,
      ]
    );

    res.json({
      success: true,
      message: "تم استلام طلب الاشتراك بنجاح",
      data: {
        requestId: result.lastID,
        companyName,
        planType: planType || "أساسي",
        status: "pending",
        submittedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
});





module.exports = router;
