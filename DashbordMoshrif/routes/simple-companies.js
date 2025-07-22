const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const db = require("../../sql/sqlite");

// دالة لتوليد API Key فريد
function generateApiKey() {
  const timestamp = Date.now().toString();
  const randomBytes = crypto.randomBytes(16).toString("hex");
  return `mk_${timestamp}_${randomBytes}`;
}

// دالة تحويل البيانات المبسطة
async function transformCompanyData(company) {
  if (!company) return null;

  // حساب عدد الفروع الحالية
  let branchesCount = 0;
  try {
    const branches = await db.getAllRows(
      "SELECT COUNT(*) as count FROM companySub WHERE NumberCompany = ?",
      [company.id]
    );
    branchesCount = branches[0]?.count || 0;
  } catch (error) {
    console.error("خطأ في حساب عدد الفروع:", error);
  }

  return {
    id: company.id,
    name: company.NameCompany,
    address: `${company.StreetName}, ${company.NeighborhoodName}, ${company.City}`,
    city: company.City,
    country: company.Country,
    isActive: true,
    registrationNumber: company.CommercialRegistrationNumber,
    branchesAllowed: company.NumberOFbranchesAllowed,
    branchesCount: branchesCount,
    currentBranches: company.NumberOFcurrentBranches,
    subscriptionStart: company.SubscriptionStartDate,
    subscriptionEnd: company.SubscriptionEndDate,
    apiKey: company.Api,
  };
}

// 1. GET /api/companies - جلب جميع الشركات
router.get("/", async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "", number = 0 } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE 1=1";
    let params = [];

    if (search) {
      whereClause += " AND NameCompany LIKE '%?%' ";
      params.push(`%${search}%`);
    }

    const companies = await db.getAllRows(
      `
      SELECT * FROM company 
      ${whereClause} AND id > ?
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `,
      [...params, number, parseInt(limit), offset]
    );

    const transformedCompanies = await Promise.all(
      companies.map(transformCompanyData)
    );

    let count = 0;
    count = await new Promise((resolve, reject) => {
      try {
        db.serialize(async () => {
          db.get(
            "SELECT COUNT(*) as count FROM company ",
            function (err, result) {
              if (err) {
              } else {
                count = result?.count;
                resolve(result?.count);
              }
            }
          );
        });
      } catch (error) {
        console.error("خطأ في حساب عدد الفروع:", error);
      }
    });

    res
      .json({
        success: true,
        data: transformedCompanies,
        countcompany: count,
      })
      .status(200);
  } catch (error) {
    next(error);
  }
});

// 2. POST /api/companies - إنشاء شركة جديدة
router.post("/", async (req, res, next) => {
  try {
    const {
      name,
      address,
      city,
      country,
      registrationNumber,
      buildingNumber,
      streetName,
      neighborhoodName,
      postalCode,
      taxNumber,
      branchesAllowed,
      subscriptionStartDate,
      subscriptionEndDate,
      cost,
    } = req.body;

    // التحقق من البيانات المطلوبة
    if (!name) {
      return res.status(400).json({
        success: false,
        error: "اسم الشركة مطلوب",
      });
    }

    // توليد API Key فريد للشركة
    const apiKey = generateApiKey();

    const companyData = {
      NameCompany: name,
      StreetName: streetName || address || "غير محدد",
      NeighborhoodName: neighborhoodName || "غير محدد",
      City: city || "غير محدد",
      Country: country || "السعودية",
      CommercialRegistrationNumber:
        registrationNumber || Math.floor(Math.random() * 1000000000),
      BuildingNumber: buildingNumber || Math.floor(Math.random() * 9999),
      PostalCode: postalCode || "12345",
      TaxNumber: taxNumber || Math.floor(Math.random() * 1000000000),
      NumberOFbranchesAllowed: branchesAllowed || 10,
      NumberOFcurrentBranches: 0,
      SubscriptionStartDate:
        subscriptionStartDate || new Date().toISOString().split("T")[0],
      SubscriptionEndDate:
        subscriptionEndDate ||
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      Api: apiKey,
      Cost: cost || 0,
    };

    const result = await db.query(
      `INSERT INTO company (CommercialRegistrationNumber, NameCompany, BuildingNumber, StreetName, 
       NeighborhoodName, PostalCode, City, Country, TaxNumber, NumberOFbranchesAllowed, 
       NumberOFcurrentBranches, SubscriptionStartDate, SubscriptionEndDate, Api, Cost) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        companyData.CommercialRegistrationNumber,
        companyData.NameCompany,
        companyData.BuildingNumber,
        companyData.StreetName,
        companyData.NeighborhoodName,
        companyData.PostalCode,
        companyData.City,
        companyData.Country,
        companyData.TaxNumber,
        companyData.NumberOFbranchesAllowed,
        companyData.NumberOFcurrentBranches,
        companyData.SubscriptionStartDate,
        companyData.SubscriptionEndDate,
        companyData.Api,
        companyData.Cost,
      ]
    );

    const newCompany = { id: result.id, ...companyData };

    res.status(201).json({
      success: true,
      message: "تم إنشاء الشركة بنجاح",
      data: await transformCompanyData(newCompany),
    });
  } catch (error) {
    console.error("خطأ في إنشاء الشركة:", error);
    next(error);
  }
});

// 3. GET /api/companies/:id - جلب شركة محددة
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

    res.json({
      success: true,
      data: await transformCompanyData(company),
    });
  } catch (error) {
    next(error);
  }
});

// 4. PUT /api/companies/:id - تحديث شركة
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      address,
      city,
      country,
      registrationNumber,
      buildingNumber,
      streetName,
      neighborhoodName,
      postalCode,
      taxNumber,
      branchesAllowed,
      subscriptionStartDate,
      subscriptionEndDate,
      cost,
    } = req.body;

    const company = await db.getRow("SELECT * FROM company WHERE id = ?", [id]);
    if (!company) {
      return res.status(404).json({
        success: false,
        error: "الشركة غير موجودة",
      });
    }

    const updates = [];
    const params = [];

    if (name) {
      updates.push("NameCompany = ?");
      params.push(name);
    }
    if (streetName || address) {
      updates.push("StreetName = ?");
      params.push(streetName || address);
    }
    if (neighborhoodName) {
      updates.push("NeighborhoodName = ?");
      params.push(neighborhoodName);
    }
    if (city) {
      updates.push("City = ?");
      params.push(city);
    }
    if (country) {
      updates.push("Country = ?");
      params.push(country);
    }
    if (registrationNumber) {
      updates.push("CommercialRegistrationNumber = ?");
      params.push(registrationNumber);
    }
    if (buildingNumber) {
      updates.push("BuildingNumber = ?");
      params.push(buildingNumber);
    }
    if (postalCode) {
      updates.push("PostalCode = ?");
      params.push(postalCode);
    }
    if (taxNumber) {
      updates.push("TaxNumber = ?");
      params.push(taxNumber);
    }
    if (branchesAllowed) {
      updates.push("NumberOFbranchesAllowed = ?");
      params.push(branchesAllowed);
    }
    if (subscriptionStartDate) {
      updates.push("SubscriptionStartDate = ?");
      params.push(subscriptionStartDate);
    }
    if (subscriptionEndDate) {
      updates.push("SubscriptionEndDate = ?");
      params.push(subscriptionEndDate);
    }
    if (cost !== undefined) {
      updates.push("Cost = ?");
      params.push(cost);
    }

    if (updates.length > 0) {
      params.push(id);
      await db.query(
        `UPDATE company SET ${updates.join(", ")} WHERE id = ?`,
        params
      );
    }

    const updatedCompany = await db.getRow(
      "SELECT * FROM company WHERE id = ?",
      [id]
    );

    res.json({
      success: true,
      message: "تم تحديث الشركة بنجاح",
      data: await transformCompanyData(updatedCompany),
    });
  } catch (error) {
    next(error);
  }
});

// 5. DELETE /api/companies/:id - حذف شركة
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const company = await db.getRow("SELECT * FROM company WHERE id = ?", [id]);
    if (!company) {
      return res.status(404).json({
        success: false,
        error: "الشركة غير موجودة",
      });
    }

    // حذف البيانات المرتبطة بالشركة أولاً
    try {
      // جلب جميع فروع الشركة
      const branches = await db.getAllRows(
        "SELECT id FROM companySub WHERE NumberCompany = ?",
        [id]
      );

      // حذف مشاريع الفروع
      for (const branch of branches) {
        await db.query(
          "DELETE FROM companySubprojects WHERE IDcompanySub = ?",
          [branch.id]
        );
      }

      // حذف الفروع
      await db.query("DELETE FROM companySub WHERE NumberCompany = ?", [id]);

      // حذف موظفي الشركة
      await db.query("DELETE FROM usersCompany WHERE IDCompany = ?", [id]);

      // حذف الشركة نفسها
      await db.query("DELETE FROM company WHERE id = ?", [id]);

      res.json({
        success: true,
        message: "تم حذف الشركة وجميع بياناتها المرتبطة بنجاح",
      });
    } catch (deleteError) {
      console.error("خطأ في حذف البيانات المرتبطة:", deleteError);
      throw deleteError;
    }
  } catch (error) {
    console.error("خطأ في حذف الشركة:", error);
    next(error);
  }
});

// 6. GET /api/companies/:id/subs - جلب فروع شركة محددة
router.get("/:id/subs", async (req, res, next) => {
  try {
    const { id, number = 0 } = req.params;

    // التحقق من وجود الشركة
    const company = await db.getRow("SELECT * FROM company WHERE id = ?", [id]);
    if (!company) {
      return res.status(404).json({
        success: false,
        error: "الشركة غير موجودة",
      });
    }

    // جلب جميع فروع الشركة مع الأسماء الصحيحة للأعمدة
    const subs = await db.getAllRows(
      `
      SELECT 
        id,
        NumberCompany as companyId,
        NameSub as name,
        BranchAddress as address,
        Email as email,
        PhoneNumber as phone,
        '' as manager,
        0 as employeesCount,
        1 as isActive,
        datetime('now') as createdAt,
        datetime('now') as updatedAt
      FROM companySub 
      WHERE NumberCompany = ? AND id > ?
      ORDER BY id DESC LIMIT 10
    `,
      [id, number]
    );

    // إضافة بيانات مدير الفرع وعدد الموظفين لكل فرع
    const subsWithDetails = await Promise.all(
      subs.map(async (sub) => {
        // جلب موظفي الفرع
        const employees = await db.getAllRows(
          `
          SELECT 
            id,
            userName as name,
            job as position,
            jobHOM as department,
            Activation as isActive,
            Validity
          FROM usersCompany 
          WHERE IDCompany = ?
        `,
          [id]
        );

        // فلترة الموظفين حسب الفرع
        const branchEmployees = employees.filter((emp) => {
          const isSpecialAdmin = emp.job === "Admin";

          if (isSpecialAdmin) {
            return true;
          }

          // باقي الموظفين حسب Validity
          try {
            if (emp.Validity) {
              const validity = JSON.parse(emp.Validity);
              if (Array.isArray(validity)) {
                return validity.some(
                  (item) =>
                    item.idBrinsh &&
                    item.idBrinsh.toString() === sub.id.toString()
                );
              } else {
                return (
                  validity.idBrinsh &&
                  validity.idBrinsh.toString() === sub.id.toString()
                );
              }
            }
            return false;
          } catch (e) {
            return false;
          }
        });

        // البحث عن مدير الفرع (استبعاد المهندسين الخاصين)
        let branchManager = "غير محدد";

        // فلترة المهندسين الخاصين أولاً
        const nonSpecialEmployees = branchEmployees.filter((emp) => {
          const nameLower = (emp.name || "").toLowerCase();
          return !(
            nameLower.includes("software engineer") ||
            nameLower.includes("م.احمد العرامي") ||
            nameLower.includes("م.احمد سعيد") ||
            nameLower.includes("احمد العرامي") ||
            nameLower.includes("احمد سعيد")
          );
        });

        // البحث عن مدير من الموظفين العاديين فقط
        const manager = nonSpecialEmployees.find((emp) => {
          const jobLower = (emp.position || "").toLowerCase();
          const deptLower = (emp.department || "").toLowerCase();

          return (
            jobLower.includes("مدير") ||
            deptLower.includes("مدير") ||
            (jobLower === "admin" && deptLower === "admin") ||
            jobLower.includes("رئيس") ||
            jobLower.includes("مشرف")
          );
        });

        if (manager) {
          branchManager = manager.name || "غير محدد";
        }

        return {
          ...sub,
          manager: branchManager,
          employeesCount: branchEmployees.length,
        };
      })
    );

    res.json({
      success: true,
      data: subsWithDetails || [],
    });
  } catch (error) {
    console.error("خطأ في جلب فروع الشركة:", error);
    next(error);
  }
});

// 7. POST /api/companies/:id/subs - إنشاء فرع جديد
router.post("/:id/subs", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, manager, address, email, phone } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: "اسم الفرع مطلوب",
      });
    }

    // التحقق من وجود الشركة
    const company = await db.getRow("SELECT * FROM company WHERE id = ?", [id]);
    if (!company) {
      return res.status(404).json({
        success: false,
        error: "الشركة غير موجودة",
      });
    }

    // استخدام أسماء الأعمدة الصحيحة من قاعدة البيانات
    const result = await db.query(
      `INSERT INTO companySub (NumberCompany, NameSub, BranchAddress, Email, PhoneNumber) 
       VALUES (?, ?, ?, ?, ?)`,
      [id, name, address || "", email || "", phone || ""]
    );

    res.status(201).json({
      success: true,
      message: "تم إنشاء الفرع بنجاح",
      data: {
        id: result.id,
        NumberCompany: id,
        NameSub: name,
        BranchAddress: address || "",
        Email: email || "",
        PhoneNumber: phone || "",
      },
    });
  } catch (error) {
    console.error("خطأ في إنشاء الفرع:", error);
    next(error);
  }
});

// 8. PUT /api/companies/subs/:subId - تحديث فرع
router.put("/subs/:subId", async (req, res, next) => {
  try {
    const { subId } = req.params;
    const { name, manager, address, email, phone } = req.body;

    // التحقق من وجود الفرع
    const sub = await db.getRow("SELECT * FROM companySub WHERE id = ?", [
      subId,
    ]);
    if (!sub) {
      return res.status(404).json({
        success: false,
        error: "الفرع غير موجود",
      });
    }

    const updates = [];
    const params = [];

    if (name) {
      updates.push("NameSub = ?");
      params.push(name);
    }
    if (address !== undefined) {
      updates.push("BranchAddress = ?");
      params.push(address);
    }
    if (email !== undefined) {
      updates.push("Email = ?");
      params.push(email);
    }
    if (phone !== undefined) {
      updates.push("PhoneNumber = ?");
      params.push(phone);
    }

    if (updates.length > 0) {
      params.push(subId);
      await db.query(
        `UPDATE companySub SET ${updates.join(", ")} WHERE id = ?`,
        params
      );
    }

    const updatedSub = await db.getRow(
      "SELECT * FROM companySub WHERE id = ?",
      [subId]
    );

    res.json({
      success: true,
      message: "تم تحديث الفرع بنجاح",
      data: {
        id: updatedSub.id,
        NumberCompany: updatedSub.NumberCompany,
        NameSub: updatedSub.NameSub,
        BranchAddress: updatedSub.BranchAddress,
        Email: updatedSub.Email,
        PhoneNumber: updatedSub.PhoneNumber,
      },
    });
  } catch (error) {
    console.error("خطأ في تحديث الفرع:", error);
    next(error);
  }
});

// 9. DELETE /api/companies/subs/:subId - حذف فرع
router.delete("/subs/:subId", async (req, res, next) => {
  try {
    const { subId } = req.params;

    // التحقق من وجود الفرع
    const sub = await db.getRow("SELECT * FROM companySub WHERE id = ?", [
      subId,
    ]);
    if (!sub) {
      return res.status(404).json({
        success: false,
        error: "الفرع غير موجود",
      });
    }

    // حذف البيانات المرتبطة بالفرع أولاً
    try {
      // حذف مشاريع الفرع
      await db.query("DELETE FROM companySubprojects WHERE IDcompanySub = ?", [
        subId,
      ]);

      // حذف الفرع نفسه
      await db.query("DELETE FROM companySub WHERE id = ?", [subId]);

      res.json({
        success: true,
        message: "تم حذف الفرع وجميع بياناته المرتبطة بنجاح",
      });
    } catch (deleteError) {
      console.error("خطأ في حذف البيانات المرتبطة:", deleteError);
      throw deleteError;
    }
  } catch (error) {
    console.error("خطأ في حذف الفرع:", error);
    next(error);
  }
});

router.get("/branches/:branchId/employees/stats", async (req, res, next) => {
  try {
    const { branchId } = req.params;

    console.log(`📊 جلب إحصائيات موظفي الفرع ${branchId}...`);

    // التحقق من وجود الفرع
    const branch = await db.getRow("SELECT * FROM companySub WHERE id = ?", [
      branchId,
    ]);
    if (!branch) {
      return res.status(404).json({
        success: false,
        error: "الفرع غير موجود",
      });
    }

    // جلب موظفي الفرع
    const employees = await db.getAllRows(
      `
      SELECT 
        job as position,
        jobHOM as department,
        jobdiscrption as jobDescription,
        Activation as isActive,
        Validity
      FROM usersCompany 
      WHERE IDCompany = ?
    `,
      [branch.NumberCompany]
    );

    // فلترة الموظفين حسب الفرع من حقل Validity أو المهندسين الخاصين
    const branchEmployees = employees.filter((emp) => {
      // أولاً، تحقق من المهندسين الثلاثة المحددين
      const nameLower = (emp.name || "").toLowerCase();
      const isSpecialAdmin =
        nameLower.includes("software engineer") ||
        nameLower.includes("م.احمد العرامي") ||
        nameLower.includes("م.احمد سعيد") ||
        nameLower.includes("احمد العرامي") ||
        nameLower.includes("احمد سعيد") ||
        (emp.position &&
          emp.position.toLowerCase() === "admin" &&
          emp.department &&
          emp.department.toLowerCase() === "admin");

      if (isSpecialAdmin) {
        return true; // إضافة هؤلاء لجميع الفروع
      }

      // باقي الموظفين حسب Validity
      try {
        if (emp.Validity) {
          const validity = JSON.parse(emp.Validity);
          // التحقق من أن validity هو array
          if (Array.isArray(validity)) {
            return validity.some(
              (item) =>
                item.idBrinsh &&
                item.idBrinsh.toString() === branchId.toString()
            );
          } else {
            // في حالة أن validity هو object مباشر
            return (
              validity.idBrinsh &&
              validity.idBrinsh.toString() === branchId.toString()
            );
          }
        }
        return false;
      } catch (e) {
        console.warn("خطأ في تحليل JSON للموظف:", emp.id, e.message);
        return false;
      }
    });

    // دالة لتحديد نوع المستخدم (نسخة مبسطة)
    const getUserType = (job, department) => {
      const jobLower = (job || "").toLowerCase();
      const deptLower = (department || "").toLowerCase();

      if (jobLower.includes("مالك") || deptLower.includes("مالك"))
        return "owner";
      if (
        jobLower.includes("admin") ||
        jobLower.includes("مدير") ||
        deptLower.includes("admin")
      )
        return "manager";
      if (
        jobLower.includes("مهندس") ||
        jobLower.includes("استشاري") ||
        jobLower.includes("مستشار")
      )
        return "engineer";
      if (
        jobLower.includes("مدخل بيانات") ||
        jobLower.includes("مسئول طلبيات") ||
        jobLower.includes("مالية")
      )
        return "admin_staff";
      if (jobLower.includes("زائر") || deptLower.includes("زائر"))
        return "visitor";
      return "employee";
    };

    // حساب الإحصائيات
    const stats = {
      total: branchEmployees.length,
      active: branchEmployees.filter(
        (e) => e.isActive === "true" || e.isActive === true
      ).length,
      inactive: branchEmployees.filter(
        (e) => e.isActive === "false" || e.isActive === false
      ).length,
      byType: {
        owners: 0,
        managers: 0,
        engineers: 0,
        adminStaff: 0,
        employees: 0,
        visitors: 0,
      },
      details: [],
    };

    // تجميع البيانات حسب النوع
    const typeGroups = {};
    branchEmployees.forEach((emp) => {
      const userType = getUserType(emp.position, emp.department);

      stats.byType[userType + "s"] = (stats.byType[userType + "s"] || 0) + 1;

      if (!typeGroups[userType]) {
        typeGroups[userType] = {
          type: userType,
          count: 0,
          active: 0,
          positions: new Set(),
        };
      }

      typeGroups[userType].count++;
      if (emp.isActive === "true" || emp.isActive === true) {
        typeGroups[userType].active++;
      }
      typeGroups[userType].positions.add(emp.position || "غير محدد");
    });

    // تحويل النتائج إلى مصفوفة مع الأوصاف
    const typeLabels = {
      owner: "مالك",
      manager: "مدير/إداري",
      engineer: "مهندس/استشاري",
      admin_staff: "موظف إداري",
      visitor: "زائر",
      employee: "موظف",
    };

    stats.details = Object.keys(typeGroups)
      .map((type) => ({
        type: type,
        label: typeLabels[type] || "غير محدد",
        count: typeGroups[type].count,
        active: typeGroups[type].active,
        inactive: typeGroups[type].count - typeGroups[type].active,
        percentage: ((typeGroups[type].count / stats.total) * 100).toFixed(1),
        positions: Array.from(typeGroups[type].positions),
      }))
      .sort((a, b) => b.count - a.count);

    console.log(`✅ تم حساب إحصائيات ${stats.total} موظف`);

    res.json({
      success: true,
      branchId: parseInt(branchId),
      stats: stats,
      message: `تم حساب إحصائيات ${stats.total} موظف بنجاح`,
    });
  } catch (error) {
    console.error("خطأ في حساب إحصائيات الموظفين:", error);
    next(error);
  }
});

// 12. GET /api/companies/:id/details - جلب تفاصيل شركة محددة (مطلوب من Frontend)
router.get("/:id/details", async (req, res, next) => {
  try {
    const { id } = req.params;

    // جلب بيانات الشركة
    const company = await db.getRow("SELECT * FROM company WHERE id = ?", [id]);

    if (!company) {
      return res.status(404).json({
        success: false,
        error: "الشركة غير موجودة",
      });
    }

    // جلب عدد الفروع الفعلية
    const subsCount = await db.getRow(
      "SELECT COUNT(*) as count FROM companySub WHERE NumberCompany = ?",
      [id]
    );

    // جلب عدد المشاريع
    const projectsCount = await db.getRow(
      `
      SELECT COUNT(*) as count 
      FROM companySubprojects 
      WHERE IDcompanySub IN (SELECT id FROM companySub WHERE NumberCompany = ?)
    `,
      [id]
    );

    // جلب عدد الموظفين
    const employeesCount = await db.getRow(
      "SELECT COUNT(*) as count FROM usersCompany WHERE IDCompany = ?",
      [id]
    );

    // تحويل البيانات
    const transformedCompany = {
      ...transformCompanyData(company),
      subsCount: subsCount?.count || 0,
      projectsCount: projectsCount?.count || 0,
      employeesCount: employeesCount?.count || 0,
      subscriptionStatus:
        new Date(company.SubscriptionEndDate) > new Date()
          ? "active"
          : "expired",
      remainingBranches:
        company.NumberOFbranchesAllowed - (subsCount?.count || 0),
    };

    res.json({
      success: true,
      data: transformedCompany,
    });
  } catch (error) {
    console.error("خطأ في جلب تفاصيل الشركة:", error);
    next(error);
  }
});



// 1. GET /api/companies - جلب جميع الشركات
// اضفناه  لجلب البيانات على عشره كائنات يقوم عبره بارسال الرقم الاخير للكائن  لجلب مابعده number

// 6. GET /api/companies/:id/subs - جلب فروع شركة محددة
// اضفناه  لجلب البيانات على عشره كائنات يقوم عبره بارسال الرقم الاخير للكائن  لجلب مابعده number

// جلب جميع بيانات تسجيل الدخول
// اضفناه  لجلب البيانات على عشره كائنات يقوم عبره بارسال الرقم الاخير للكائن  لجلب مابعده number


// جلب بيانات تسجيل الدخول حسب الشركة
// اضفناه  لجلب البيانات على عشره كائنات يقوم عبره بارسال الرقم الاخير للكائن  لجلب مابعده number

// GET /api/subscriptions - جلب جميع اشتراكات الشركات

// اضفناه  لجلب البيانات على عشره كائنات يقوم عبره بارسال الرقم الاخير للكائن  لجلب مابعده number



// 10. GET /api/companies/branches/:branchId/employees - جلب موظفي فرع محدد مع الفرز
// http://192.168.8.220:8080/api/user/BringUserCompanyinv2?IDCompany=1&idBrinsh=1&type=12
// تستخدم data

// جلب بيانات المشاريع
// 8. GET /api/companies/subs/:subId/projects - جلب مشاريع فرع محدد
// http://192.168.8.220:8080/api/brinshCompany/BringProject?IDcompanySub=1&IDfinlty=0
// http://192.168.8.220:8080/api/brinshCompany/FilterProject?IDcompanySub=1&search="اسم المشروع"


// جلب بيانات المالية 


// BringExpense
// http://192.168.8.220:8080/api/brinshCompany/BringExpense?idproject=1&lastID=0

// /BringRevenue
// http://192.168.8.220:8080/api/brinshCompany/BringRevenue?idproject=1&lastID=0
// /BringReturned

// http://192.168.8.220:8080/api/brinshCompany/BringReturned?idproject=1&lastID=0
// اجمالي المالية
// http://192.168.8.220:8080/api/brinshCompany/BringTotalAmountproject?ProjectID=1





//  جلب بيانات المراحل رئيسية


// http://192.168.8.220:8080/api/brinshCompany/BringStage?ProjectID=1&type="cache"&number=0
// المراحل الفرعية

// http://192.168.8.220:8080/api/brinshCompany/BringStagesub?ProjectID=1&StageID=2&type="cache"&number=0

// جلب الملاحظات
// http://192.168.8.220:8080/api/brinshCompany/BringStageNotes?ProjectID=1&StageID=1


// جلب الطلبيات
// http://192.168.8.220:8080/api/brinshCompany/v2/BringDataRequests?ProjectID=1&Type="مواد ثقيفة"&Done="true"&lastID=0

// حساب اجمالي الطلبات
// http://192.168.8.220:8080/api/brinshCompany/v2/BringCountRequsts?ProjectID=1


// اخذ بيانات المستخدمين داخل المشروع
// http://192.168.8.220:8080/api/user/BringUserCompanyinv2?IDCompany=1&idBrinsh=1&type=1
// تستخدم arrayfind

// http://192.168.8.220:8080/api/user/BringUserCompanyinv2?IDCompany=1&idBrinsh=1&type=1

// جلب بيانات مستخدمين الشركة
// http://192.168.8.220:8080/api/user/BringUserCompany?IDCompany=1&number=0


// بحث على موظف
// http://192.168.8.220:8080/api/user/BringUserCompany?IDCompany=1&number=0&kind_request="userName"


// اضافة مستخدم جديد للشركة 
// http://192.168.8.220:8080/api/user
// المتطلبات
// {IDCompany,userName,IDNumber,PhoneNumber,jobdiscrption,job,Validity}
// 
// تحديث بيانات المستخدم
// http://192.168.8.220:8080/api/user/updat
// المتطلبات
// { userName, IDNumber, PhoneNumber, jobdiscrption, job, id }






// إضافة endpoint للبحث الشامل
router.get("/search/global", async (req, res, next) => {
  try {
    const { query = "", limit = 10 } = req.query;

    if (!query.trim()) {
      return res.json({
        success: true,
        data: {
          companies: [],
          branches: [],
          projects: [],
          employees: [],
        },
      });
    }

    const searchTerm = `%${query}%`;

    // البحث في الشركات
    const companies = await db.getAllRows(
      `
      SELECT 
        id, 
        NameCompany as name,
        City as city,
        Country as country,
        'company' as type
      FROM company 
      WHERE NameCompany LIKE ? OR City LIKE ? OR Country LIKE ?
      LIMIT ?
    `,
      [searchTerm, searchTerm, searchTerm, parseInt(limit)]
    );

    // البحث في الفروع
    const branches = await db.getAllRows(
      `
      SELECT 
        cs.id, 
        cs.NameSub as name,
        cs.BranchAddress as address,
        c.NameCompany as companyName,
        c.id as companyId,
        'branch' as type
      FROM companySub cs
      LEFT JOIN company c ON c.id = cs.NumberCompany
      WHERE cs.NameSub LIKE ? OR cs.BranchAddress LIKE ? OR c.NameCompany LIKE ?
      LIMIT ?
    `,
      [searchTerm, searchTerm, searchTerm, parseInt(limit)]
    );

    // البحث في المشاريع
    const projects = await db.getAllRows(
      `
      SELECT 
        p.id,
        p.Nameproject as name,
        p.LocationProject as location,
        p.TypeOFContract as contractType,
        cs.NameSub as branchName,
        cs.id as branchId,
        c.NameCompany as companyName,
        c.id as companyId,
        'project' as type
      FROM companySubprojects p
      LEFT JOIN companySub cs ON cs.id = p.IDcompanySub
      LEFT JOIN company c ON c.id = cs.NumberCompany
      WHERE p.Nameproject LIKE ? OR p.LocationProject LIKE ? OR p.TypeOFContract LIKE ?
      LIMIT ?
    `,
      [searchTerm, searchTerm, searchTerm, parseInt(limit)]
    );

    // البحث في الموظفين
    const employees = await db.getAllRows(
      `
      SELECT 
        u.id,
        u.userName as name,
        u.job as position,
        u.jobHOM as department,
        c.NameCompany as companyName,
        c.id as companyId,
        'employee' as type
      FROM usersCompany u
      LEFT JOIN company c ON c.id = u.IDCompany
      WHERE u.userName LIKE ? OR u.job LIKE ? OR u.jobHOM LIKE ?
      LIMIT ?
    `,
      [searchTerm, searchTerm, searchTerm, parseInt(limit)]
    );

    res.json({
      success: true,
      data: {
        companies: companies.map((item) => ({
          ...item,
          url: `/companies-with-db`,
        })),
        branches: branches.map((item) => ({
          ...item,
          url: `/companies-with-db`,
        })),
        projects: projects.map((item) => ({
          ...item,
          url: `/project-details/${item.id}`,
        })),
        employees: employees.map((item) => ({
          ...item,
          url: `/companies-with-db`,
        })),
        total:
          companies.length +
          branches.length +
          projects.length +
          employees.length,
      },
    });
  } catch (error) {
    console.error("خطأ في البحث الشامل:", error);
    next(error);
  }
});

module.exports = router;
