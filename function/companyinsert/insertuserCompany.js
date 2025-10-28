const { parsePositiveInt, convertArabicToEnglish, normalizePhone, isNonEmpty, lenBetween, esc } = require("../../middleware/Aid");
const {
  insertTableuserComppany,
  insertTableusersBransh,
} = require("../../sql/INsertteble");
const {
  SelectVerifycompanyexistencePhonenumber,
} = require("../../sql/selected/selected");
const {
  SELECTTableusersCompanyVerification} = require("../../sql/selected/selectuser");

const userCompany = () => {
  return async (req, res) => {
    try {
      // (اختياري) إن كان يجب التحقق من الجلسة:
      const userSession = req.session?.user;
      if (!userSession) {
        console.log("Invalid session");
        return res.status(401).json({ success: false, message: "Invalid session" });
      }

      // 1) التقاط وتطبيع المدخلات
      const {
        IDCompany,
        userName,
        IDNumber,
        PhoneNumber,
        jobdiscrption,
        job,
        Validity,
      } = req.body || {};

      const idCompanyNum   = parsePositiveInt(IDCompany);
      const nameStr        = String(userName ?? "").trim();
      const idNumberStr    = convertArabicToEnglish(IDNumber).replace(/\D/g, "");
      const phoneLocal     = normalizePhone(PhoneNumber);
      const jobStr         = String(job ?? "").trim();
      const jobDescStr     = String(jobdiscrption ?? "").trim();

      // 2) تحقق يدوي للمدخلات
      const errors = {};
      if (!Number.isFinite(idCompanyNum)) {
        errors.IDCompany = "رقم الشركة مطلوب ويجب أن يكون عدداً صحيحاً موجباً";
      }
      if (!isNonEmpty(nameStr) || !lenBetween(nameStr, 2, 100)) {
        errors.userName = "اسم المستخدم مطلوب (2 إلى 100 حرف)";
      }
      // الهوية الوطنية/الإقامة: 10–15 رقم (مرن)
      if (!isNonEmpty(idNumberStr) || !/^\d{10,15}$/.test(idNumberStr)) {
        errors.IDNumber = "رقم الهوية/الإقامة يجب أن يكون بين 10 و 15 رقماً";
      }
      // الجوال المحلي: 9 أرقام بعد التطبيع
      if (!/^\d{9}$/.test(phoneLocal)) {
        errors.PhoneNumber = "رقم الجوال غير صالح؛ يجب أن يكون 9 أرقام محلية بعد التطبيع";
      }
      if (isNonEmpty(jobStr) && !lenBetween(jobStr, 2, 100)) {
        errors.job = "المسمى الوظيفي (إن وُجد) يجب أن يكون بين 2 و 100 حرف";
      }
      if (isNonEmpty(jobDescStr) && !lenBetween(jobDescStr, 2, 500)) {
        errors.jobdiscrption = "وصف الوظيفة (إن وُجد) يجب أن يكون بين 2 و 500 حرف";
      }
      // Validity: نقبل object/array أو نص JSON صالح
      let validityPayload = null;
      if (Validity !== undefined) {
        try {
          validityPayload = typeof Validity === "string" ? JSON.parse(Validity) : Validity;
          // حماية حجم البيانات
          const s = JSON.stringify(validityPayload ?? {});
          if (s.length > 10_000) throw new Error("Validity too large");
        } catch {
          errors.Validity = "صيغة الصلاحيات غير صالحة (يجب أن تكون كائن/JSON)";
        }
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ success: false, message: "أخطاء في التحقق من المدخلات", errors });
      }

      // 3) تحقق من التكرار/الانتظار
      const verificationFinduser = await SELECTTableusersCompanyVerification(phoneLocal);
      const findRegistrioncompany = await SelectVerifycompanyexistencePhonenumber(phoneLocal);

      if ((Array.isArray(verificationFinduser) && verificationFinduser.length > 0) || findRegistrioncompany !== undefined) {
        return res.status(409).json({
          success: false,
          message: findRegistrioncompany !== undefined
            ? "الرقم موجود في قائمة انتظار تسجيل حساب شركات"
            : "المستخدم موجود بالفعل",
        });
      }

      // 4) الإدراج في قاعدة البيانات
      await insertTableuserComppany([
        convertArabicToEnglish(esc(idCompanyNum)),
        esc(nameStr),
        convertArabicToEnglish(esc(idNumberStr)),
        convertArabicToEnglish(esc(phoneLocal)),
        isNonEmpty(jobStr) ? esc(jobStr) : null,
        isNonEmpty(jobDescStr) ? esc(jobDescStr) : null,
        // لاحظ أن كودك الأصلي مرّر job مرتين؛ نُبقيه لتوافق التوقيع إن كان عمداً
        isNonEmpty(jobStr) ? esc(jobStr) : null,
        JSON.stringify(validityPayload ?? Validity ?? {}), // نضمن JSON صحيح
      ]);

      return res.status(201).json({
        success: true,
        message: "تمت العملية بنجاح",
        data: {
          IDCompany: idCompanyNum,
          userName: nameStr,
          PhoneNumber: phoneLocal,
        }
      });

    } catch (err) {
      console.error("userCompany error:", err);
      return res.status(500).json({ success: false, message: "فشل في تنفيذ العملية" });
    }
  };
};


// اخراج معلومات مدير الفرع
const CheckAdmin = async (check, resultSend) => {
  await insertTableusersBransh([resultSend, check, "مدير الفرع"]);
};

// اخراج بيانات الاعضاء
const CheckGlobal = async (checkGloble, resultSend) => {
  for (let index = 0; index < Object.values(checkGloble).length; index++) {
    const element = Object.values(checkGloble)[index];
    await insertTableusersBransh([resultSend, element?.id, "عضو"]);
  }
};

module.exports = { userCompany, CheckAdmin, CheckGlobal };
