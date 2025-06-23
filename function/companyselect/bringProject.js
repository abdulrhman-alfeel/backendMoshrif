const {
  SELECTTablecompanySubProject,
  SELECTTablecompanySubProjectindividual,
  SELECTFROMTablecompanysubprojectStagesubTeplet,
  SELECTTablecompanySubProjectStageCUST,
  SELECTTablecompanySubProjectStagesSub,
  SELECTTablecompanySubProjectStageNotes,
  SELECTTablecompanySubProjectexpense,
  SELECTTablecompanySubProjectREVENUE,
  SELECTTablecompanySubProjectReturned,
  SELECTFROMTablecompanysubprojectStageTemplet,
  SELECTTablecompanySubProjectarchivesotherroad,
  SELECTTablecompanySubProjectarchives,
  SELECTSUMAmountandBring,
  SELECTTablecompanySubProjectStageCUSTSubCount,
  SELECTTablecompanybrinshStagesSubAll,
  SELECTTablecompanySubProjectStageCUSTONe,
  SELECTLastTableChateStage,
  SELECTTableSavepdf,
  SELECTTablecompanySubProjectexpenseObjectOneforArchif,
  SELECTSEARCHINFINANCE,
  SELECTTablecompanySubProjectREVENUEObjectOne,
  SELECTTablecompanySubProjectReturnedObjectOne,
  SELECTallDatafromTableRequests,
  SELECTDataAndTaketDonefromTableRequests,
  SELECTProjectStartdate,
  SELECTTablecompanySubProjectLast_id,
  SELECTTablecompany,
  SELECTTablecompanySubProjectFilter,
  SELECTallDatafromTableRequestsV2,
  SELECTDataAndTaketDonefromTableRequests2,
  SELECTTableStageNotesAllproject,
} = require("../../sql/selected/selected");
const fs = require("fs");
const path = require("path");
const {
  StatmentAllpdf,
  StatmentExpensePdf,
} = require("../../pdf/convertotpdf");
const { bucket } = require("../../bucketClooud");
const { insertTableSabepdf } = require("../../sql/INsertteble");
const { UPDATETableSavepdf } = require("../../sql/update");
const {
  SELECTTableusersCompanyonObject,
  SELECTTableusersCompany,
  SELECTTableusersCompanyVerification,
  SELECTTableusersCompanyboss,
} = require("../../sql/selected/selectuser");
const { deleteFileSingle } = require("../../middleware/Fsfile");
const redis = require("../../middleware/cache");

// استيراد بيانات المشروع حسب الفرع

const BringProject = () => {
  return async (req, res) => {
    try {
      let arrayBrinsh = [];
      const userSession = req.session.user;

      if (!userSession) {
        return res.status(401).send("Invalid session");
      }
      const {IDcompanySub,IDfinlty,type} = req.query;
      const PhoneNumber = userSession.PhoneNumber;
      const key = `projects:${PhoneNumber}:${IDcompanySub}:${parseInt(
        IDfinlty
      )}`;

      const cached = await redis.get(key);
      if (cached && type === "cache") {
        const cachedData = JSON.parse(cached);
        console.log("Data fetched from cache");
        return res
          .send({
            success: true,
            data: cachedData?.data,
            boss: cachedData?.boss,
          })
          .status(200);
      }

      const projects = await getProjectsForUser(
        PhoneNumber,
        IDcompanySub,
        IDfinlty
      );

      const arrayReturnProject = await BringTotalbalance(
        IDcompanySub,
        userSession.IDCompany,
        projects
      );
      
      arrayBrinsh = arrayReturnProject;
      const userdata = await SELECTTableusersCompanyVerification(userSession.PhoneNumber);
      const boss = await BringUserinProject(JSON.parse(userdata[0].Validity),IDcompanySub,0,'validityJob');
      const data = { success: true, data: arrayBrinsh, boss: boss };

      res.status(200).send(data);
      await redis.set(key, JSON.stringify(data), "EX",  60 * 1000); // Cache for 1 minute
    } catch (err) {
      console.error(err);
      res.status(400).send({ success: false, error: err.message });
    }
  };
};

async function getProjectsForUser(PhoneNumber, IDcompanySub, IDfinlty) {
  const Datausere = await SELECTTableusersCompanyonObject(PhoneNumber);
  let result;

  if (Datausere.job !== "Admin") {
    let validity =
      Datausere.Validity !== null ? JSON.parse(Datausere.Validity) : [];

    if (validity.length > 0) {
      await Promise.all(
        validity.map(async (element) => {
          if (
            element.job === "مدير الفرع" &&
            parseInt(element.idBrinsh) === parseInt(IDcompanySub)
          ) {
            result = await SELECTTablecompanySubProject(IDcompanySub, IDfinlty);
          } else {
            if (parseInt(element.idBrinsh) === parseInt(IDcompanySub)) {
              const where = element.project
                .map((items) => items.idProject)
                .reduce((item, r) => `${String(item) + " , " + r}`);
              const typeproject = `AND ca.id IN (${where})`;
              result = await SELECTTablecompanySubProject(
                IDcompanySub,
                IDfinlty,
                "all",
                "true",
                typeproject
              );
            }
          }
        })
      );
    }
  } else {
    result = await SELECTTablecompanySubProject(IDcompanySub, IDfinlty);
  }

  return result;
}
//  فلتر المشاريع
//  SELECT * FROM posts WHERE Saction LIKE '%"+search+"%'

const FilterProject = () => {
  return async (req, res) => {
    try {
      const { search, IDCompanySub } = req.query;
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        // console.log("Invalid session");
      }
      const Datausere = await SELECTTableusersCompanyonObject(
        userSession.PhoneNumber
      );
      const result = await SELECTTablecompanySubProjectFilter(
        search,
        IDCompanySub
      );
      const  arrayReturnProject  = await BringTotalbalance(
        IDCompanySub,
        userSession.IDCompany,
        result
      );
      let findproject = false;
      if (Datausere.job !== "Admin") {
        let validity =
          Datausere.Validity !== null ? JSON.parse(Datausere.Validity) : [];
        if (validity.length > 0) {
          for (let index = 0; index < validity?.length; index++) {
            const element = validity[index];
            findproject = true;
            if (
              element.job === "مدير الفرع" &&
              parseInt(element.idBrinsh) === parseInt(IDCompanySub)
            ) {
              findproject = true;
            } else {
              for (let index = 0; index < element.project.length; index++) {
                const elementProject = element.project[index];
                const find =
                  result.length > 0
                    ? result.find((pic) => pic.id === elementProject.idProject)
                    : false;
                if (find) {
                  findproject = true;
                }
              }
            }
          }
        }
      } else {
        findproject = true;
      }
      const massage = !findproject
        ? "لاتوجد بيانات في اطار صلاحياتك بهذا الاسم "
        : "تمت العملية بنجاح";
      if (findproject) {
        res.send({ success: massage, data: arrayReturnProject }).status(200);
      } else {
        res.send({ success: massage, data: [] }).status(200);
      }
    } catch (error) {
      res.send({ success: "فشل تنفيذ العملية", data: [] }).status(501);
      console.log(error);
    }
  };
};

const BringDataprojectClosed = () => {
  return async (req, res) => {
    try {
      const IDCompanySub = req.query.IDCompanySub;
      const IDfinlty = req.query.IDfinlty;
      const result = await SELECTTablecompanySubProject(
        IDCompanySub,
        IDfinlty,
        "all",
        "false"
      );
      res.send({ success: "تمت العملية بنجاح", data: result }).status(200);
    } catch (error) {
      res.send({ success: "فشل تنفيذ العملية" }).status(401);

      console.log(error);
    }
  };
};

//  عملية رئيسية لجلب مشروع واحد
const BringProjectObjectone = () => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      const idProject = req.query.idProject;
      const result = await SELECTTablecompanySubProjectLast_id(
        idProject,
        "party"
      );

      const data = await OpreationExtrinProject(
        result,
        userSession.IDCompany,
        result?.IDcompanySub
      );

      res.send({ success: "تم نجاح العملية", data: data }).status(200);
    } catch (error) {
      console.log(error);
      res.status(500).send({ success: "فشل تنفيذ العملية" });
    }
  };
};

// استيراد بيانات المشروع حسب صلاحية المستخدم
const BringProjectindividual = () => {
  return async (req, res) => {
    try {
      const { IDcompanySub, idproject } = req.query;
      const result = await SELECTTablecompanySubProjectindividual(
        idproject,
        IDcompanySub
      );
      res.send({ success: true, data: result }).status(200);
    } catch (err) {
      console.log(err);
      res.send({ success: false }).status(400);
    }
  };
};

// استيراد بيانات سنيبل المراحل
const BringStageTemplet = () => {
  return async (req, res) => {
    try {
      const Type = req.query.Type;
      // console.log(Type);
      const result = await SELECTFROMTablecompanysubprojectStageTemplet(Type);

      res.send({ success: true, data: result }).status(200);
    } catch (err) {
      console.log(err);
      res.send({ success: false }).status(400);
    }
  };
};

// استيراد بيانات سنبل المراحل الفرعية
const BringStageSubTemplet = () => {
  return async (req, res) => {
    try {
      const StageID = req.query.StageID;
      const result = await SELECTFROMTablecompanysubprojectStagesubTeplet(
        StageID
      );

      res.send({ success: true, data: result }).status(200);
    } catch (err) {
      console.log(err);
      res.send({ success: false }).status(400);
    }
  };
};

//  استيراد بيانات المراحل الاساسية
const BringStage = () => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;

      if (!userSession) {
        return res.status(401).send("Invalid session");
      }
      const {ProjectID,type} = req.query;
      const key = `Stage:${userSession?.PhoneNumber}:${ProjectID}`;

      const cached = await redis.get(key);
      if (cached && type === "cache") {
        const cachedData = JSON.parse(cached);
        return res
          .send({
            success: true,
            data: cachedData?.data,
            Validity: cachedData?.Validity,
          })
          .status(200);
      }

      const result = await SELECTTablecompanySubProjectStageCUST(ProjectID);
      let arrayresult = [];
      // console.log(result.length, ProjectID);
      for (let index = 0; index < result.length; index++) {
        const element = result[index];
        const rate = await PercentagecalculationforSTage(
          element.StageID,
          ProjectID
        );
        arrayresult.push({
          ...element,
          rate: rate,
        });
      }
      // استيراد صلاحية المستخدم للمشروع

      const userdata = await SELECTTableusersCompanyVerification(
        userSession.PhoneNumber
      );

      const  arrayUser = await BringUserinProject(
        JSON.parse(userdata[0].Validity),
        0,
        ProjectID,
        "validityProject"
      );

      let data = {
        data: arrayresult,
        Validity: isNaN(arrayUser?.ValidityProject)
          ? arrayUser?.ValidityProject
          : arrayUser,
      };

      res
        .send({
          success: true,
          data: arrayresult,
          Validity: isNaN(arrayUser?.ValidityProject)
            ? arrayUser?.ValidityProject
            : arrayUser,
        })
        .status(200);
      await redis.set(key, JSON.stringify(data), "EX", 60 * 1000);
    } catch (err) {
      console.log(err);
      res.send({ success: false }).status(400);
    }
  };
};

// استيراد كائن واحد من  المراحل ارئيسية
const BringStageOneObject = () => {
  return async (req, res) => {
    try {
      const ProjectID = req.query.ProjectID;
      const StageID = req.query.StageID;

      let result = await SELECTTablecompanySubProjectStageCUSTONe(
        ProjectID,
        StageID
      );
      const rate = await PercentagecalculationforSTage(StageID, ProjectID);

      // result?.push(rate);
      result = {
        ...result,
        rate: rate,
      };

      res.send({ success: true, data: result }).status(200);
    } catch (err) {
      console.log(err);
      res.send({ success: false }).status(400);
    }
  };
};

// استيراد بيانات المراحل الفرعية
const BringStagesub = () => {
  return async (req, res) => {
    try {
      const { ProjectID, StageID ,type} = req.query;
    const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      const key = `StageSub:${userSession?.PhoneNumber}:${ProjectID}:${StageID}`;

      const cached = await redis.get(key);
      let typeCache = type || "update";
      if (cached && typeCache === "cache") {
        const cachedData = JSON.parse(cached);
        return res
          .send({
            success: true,
            data: cachedData?.data, resultProject: cachedData?.resultProject
          })
          .status(200);
      }


      const result = await SELECTTablecompanySubProjectStagesSub(
        ProjectID,
        StageID
      );
      let resultProject = await SELECTTablecompanySubProjectStageCUSTONe(
        ProjectID,
        StageID
      );
      const rate = await PercentagecalculationforSTage(StageID, ProjectID);

      // result?.push(rate);
      resultProject = {
        ...resultProject,
        rate: rate,
      };
      
      res
        .send({ success: true, data: result, resultProject: resultProject })
        .status(200);
      let data = {data: result, resultProject: resultProject}
      await redis.set(key, JSON.stringify(data), "EX", 60 * 1000);
    } catch (err) {
      console.log(err);
      res.send({ success: false }).status(400);
    }
  };
};
// const BringStagesub = () => {
//   return async (req, res) => {
//     try {
//       const { ProjectID, StageID ,type} = req.query;
//     const userSession = req.session.user;
//       if (!userSession) {
//         res.status(401).send("Invalid session");
//         console.log("Invalid session");
//       }
//       const key = `StageSub:${userSession?.PhoneNumber}:${ProjectID}:${StageID}`;

//       const cached = await redis.get(key);
//       let typeCache = type || "cache";
//       if (cached && typeCache === "cache") {
//         const cachedData = JSON.parse(cached);
//         return res
//           .send({
//             success: true,
//             data: cachedData?.data, resultProject: cachedData?.resultProject
//           })
//           .status(200);
//       }


//       const result = await SELECTTablecompanySubProjectStagesSub(
//         ProjectID,
//         StageID
//       );
//       let resultProject = await SELECTTablecompanySubProjectStageCUSTONe(
//         ProjectID,
//         StageID
//       );
//       const rate = await PercentagecalculationforSTage(StageID, ProjectID);

//       // result?.push(rate);
//       resultProject = {
//         ...resultProject,
//         rate: rate,
//       };
      
//       res
//         .send({ success: true, data: result, resultProject: resultProject })
//         .status(200);
//       let data = {data: result, resultProject: resultProject}
//       await redis.set(key, JSON.stringify(data), "EX", 60 * 1000);
//     } catch (err) {
//       console.log(err);
//       res.send({ success: false }).status(400);
//     }
//   };
// };

// استيراد ملاحظات المراحل الرئيسية للمشروع
const BringStageNotes = () => {
  return async (req, res) => {
    try {
      const { ProjectID, StageID } = req.query;
      const result = await SELECTTablecompanySubProjectStageNotes(
        parseInt(ProjectID),
        parseInt(StageID)
      );
      res.send({ success: true, data: result }).status(200);
    } catch (err) {
      console.log(err);
      res.send({ success: false }).status(400);
    }
  };
};

// استيراد بيانات المصروفات
const BringExpense = () => {
  return async (req, res) => {
    try {
      const { idproject, lastID } = req.query;
      const result = await SELECTTablecompanySubProjectexpense(
        idproject,
        "all",
        lastID
      );
      let array = [];
      result.forEach((pic) => {
        array.push({
          ...pic,
          Image: pic.Image !== null ? JSON.parse(pic.Image) : [],
        });
      });
      res.send({ success: true, data: array }).status(200);
    } catch (err) {
      console.log(err);
      res.send({ success: false }).status(400);
    }
  };
};

//  استيراد بيانات العهد
const BringRevenue = () => {
  return async (req, res) => {
    try {
      const { idproject, lastID } = req.query;
      const result = await SELECTTablecompanySubProjectREVENUE(
        idproject,
        lastID
      );
      let array = [];
      result.forEach((pic) => {
        array.push({
          ...pic,
          Image: pic.Image !== null ? JSON.parse(pic.Image) : [],
        });
      });
      res.send({ success: true, data: array }).status(200);
    } catch (err) {
      console.log(err);
      res.send({ success: false }).status(400);
    }
  };
};

//  استيراد بيانات المرتجعات
const BringReturned = () => {
  return async (req, res) => {
    try {
      const { idproject, lastID } = req.query;
      const result = await SELECTTablecompanySubProjectReturned(
        idproject,
        lastID
      );
      let array = [];
      result.forEach((pic) => {
        array.push({
          ...pic,
          Image: pic.Image !== null ? JSON.parse(pic.Image) : [],
        });
      });
      res.send({ success: true, data: array }).status(200);
    } catch (err) {
      console.log(err);
      res.send({ success: false }).status(400);
    }
  };
};
// استيراد المجموع لبيانات المالية

const BringTotalAmountproject = () => {
  return async (req, res) => {
    try {
      const ProjectID = req.query.ProjectID;
      const result = await SELECTSUMAmountandBring(ProjectID);
      res.send(result).status(200);
    } catch (error) {
      console.log(error);
      res.status(404);
    }
  };
};

// استيراد كشف حساب المالية للمشروع

const BringStatmentFinancialforproject = () => {
  return async (req, res) => {
    try {
      const { ProjectID, type } = req.query;
      // await DeleteTableSavepdf(ProjectID);
      let namefile;
      let verify = false;
      let chackprojct = false;

      const sevepdf = await SELECTTableSavepdf(ProjectID);
      const Totalproject = await SELECTSUMAmountandBring(ProjectID);

      if (sevepdf !== 0 && sevepdf?.Total !== undefined) {
        if (
          (parseInt(sevepdf.Total) ===
            parseInt(Totalproject.RemainingBalance) &&
            type === "all") ||
          (type !== "all" &&
            parseInt(sevepdf.TotalExpense) ===
              parseInt(Totalproject.TotalExpense))
        ) {
          namefile =
            type === "all" ? sevepdf.namefileall : sevepdf.namefileparty;
          if (namefile !== null) {
            return res
              .status(200)
              .send({ success: "تمت العملية بنجاح", url: namefile });
          } else {
            verify = true;
            chackprojct = true;
          }
        } else {
          verify = true;
          chackprojct = true;
        }
      } else {
        verify = true;
      }
      let kindTable;
      let kindTotal;
      const output = Math.floor(1000 + Math.random() * 9000);
      if (verify) {
        try {
          namefile =
            type === "all" ? sevepdf?.namefileall : sevepdf?.namefileparty;
          if (namefile) {
            const file = bucket.file(namefile);
            await file.delete();
            // console.log(`File ${namefile} deleted successfully.`);
          }
        } catch (error) {
          console.log(error);
        }

        if (type === "all") {
          namefile = `${output}all.pdf`;
        } else {
          namefile = `${output}party.pdf`;
        }

        const filePath = path.join(__dirname, "../../upload", namefile);
        if (type === "all") {
          await StatmentAllpdf(ProjectID, filePath);
          kindTable = "Total";
          kindTotal = Totalproject.RemainingBalance;
        } else {
          await StatmentExpensePdf(ProjectID, filePath);
          kindTable = "TotalExpense";
          kindTotal = Totalproject.TotalExpense;
        }

        if (fs.existsSync(filePath)) {
          await bucket.upload(filePath);
          deleteFileSingle(namefile, "upload");
        } else {
          console.error(`File ${filePath} does not exist for upload.`);
          return res
            .status(400)
            .send({ success: "فشل في تنفيذ العملية - الملف غير موجود" });
        }

        let nametable = type !== "all" ? "namefileparty" : "namefileall";
        if (chackprojct) {
          await UPDATETableSavepdf(
            [namefile, kindTotal, ProjectID],
            nametable,
            kindTable
          );
        } else {
          await insertTableSabepdf(
            [ProjectID, namefile, kindTotal],
            nametable,
            kindTable
          );
        }

        res.status(200).send({ success: "تمت العملية بنجاح", url: namefile });
      }
    } catch (error) {
      console.error("Error in processing:", error);
      res.status(400).send({ success: "فشل في تنفيذ العملية" });
    }
  };
};

// عمليات البحث في قسم المالية
const SearchinFinance = () => {
  return async (req, res) => {
    try {
      const { projectID, type, from, to, fromtime, totime } = req.query;
      let array = [];

      let kind =
        type === "مصروفات" ? "Expense" : type === "عهد" ? "Revenue" : "Returns";
      const result = await SELECTSEARCHINFINANCE(
        kind,
        projectID,
        parseInt(from),
        parseInt(to),
        fromtime,
        totime
      );
      // console.log(result);
      if (result.length > 0) {
        result.forEach((pic) => {
          array.push({
            ...pic,
            Image: pic.Image !== null ? JSON.parse(pic.Image) : [],
          });
        });
      }
      res.send({ success: "تمت العملية بنجاح", data: array }).status(200);
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل تنفيذ العملية" }).status(400);
    }
  };
};

// *******************************************************************************************
//******************************** استيراد بيانات الارشيف************************************
const BringArchives = () => {
  return async (req, res) => {
    try {
      const idproject = req.query.idproject;
      const result = await SELECTTablecompanySubProjectarchives(idproject);
      res.send({ success: true, data: result }).status(200);
    } catch (err) {
      console.log(err);
      res.send({ success: false }).status(400);
    }
  };
};
// استيراد ملفات فرع مجلد الارشيف
const BringArchivesFolderdata = () => {
  return async (req, res) => {
    try {
      const { ArchivesID, idSub, type, idproject } = req.query;

      let result;
      result = await SELECTTablecompanySubProjectarchivesotherroad(
        parseInt(ArchivesID)
      );

      const children = JSON.parse(result.children);

      if (verifyfromfiletname(result.FolderName)) {
        if (parseInt(ArchivesID) !== parseInt(idSub)) {
          const resultall = await BringchildeArchives(
            children,
            parseInt(idSub)
          );
          result = await ExtractDatafromFolderchilde(resultall);
        } else {
          // console.log(type, "type no archivesid !== idsub");
          result = await ExtractDatafromFolderchilde(children);
        }
      } else {
        result = await ExtractDatafromFolderHome(
          idproject,
          result.FolderName,
          type,
          idSub
        );
      }

      res.send({ success: true, data: result || [] }).status(200);
    } catch (err) {
      console.log(err);
      res.send({ success: false }).status(400);
    }
  };
};

// ************** استيرات بيانات الطلبيات ***************************************
const BringDataRequests = () => {
  return async (req, res) => {
    try {
      const { ProjectID, Type } = req.query;
      const typeselect = String(Type).split(" ")[1];
      let querytype =
        typeselect === "خفيفة" || typeselect === "ثقيلة" ? typeselect : Type;
      const result = await SELECTallDatafromTableRequests(querytype, ProjectID);
      let arraynew = [];
      await Promise.all(
        result.map(async (pic) => {
          let InsertBy = null;
          let Implementedby = null;
          if (pic.InsertBy !== null) {
            const user = await SELECTTableusersCompanyonObject(pic.InsertBy);
            InsertBy = user.userName;
          }
          if (pic.Implementedby !== null) {
            const user = await SELECTTableusersCompanyonObject(
              pic.Implementedby
            );
            Implementedby = user.userName;
          }
          arraynew.push({
            ...pic,
            Image: pic.Image !== null ? JSON.parse(pic.Image) : [],
            InsertBy: InsertBy,
            Implementedby: Implementedby,
          });
        })
      );
      // console.log(arraynew);
      res.send({ success: "تمت العملية بنجاح", data: arraynew }).status(200);
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل تنفيذ العملية" }).status(200);
    }
  };
};

const BringCountRequsts = () => {
  return async (req, res) => {
    try {
      const ProjectID = req.query.ProjectID;

      const countCLOSE = await SELECTDataAndTaketDonefromTableRequests(
        ProjectID,
        "false"
      );
      const countOPEN = await SELECTDataAndTaketDonefromTableRequests(
        ProjectID,
        "true"
      );
      res.send({
        success: "تمت العملية النجاح",
        data: {
          Close: countCLOSE["COUNT(Done)"],
          Open: countOPEN["COUNT(Done)"],
        },
      });
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل تنفيذ العملية" }).status(200);
    }
  };
};
const BringDataRequestsV2 = () => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      const { ProjectID, Type, kind, Done, lastID } = req.query;
      const userdata = await SELECTTableusersCompanyVerification(
        userSession.PhoneNumber
      );

      const  boss  = await BringUserinProject(
        JSON.parse(userdata[0].Validity),
        ProjectID,
        0,
        "validityJob"
      );
      let verifyUser =
        String(userSession.job).split(" ")[1] === "طلبيات" ||
        boss === "مدير الفرع" ||
        userSession.job === "Admin";

      const typeselect = String(Type).split(" ")[1];
      let querytype =
        typeselect === "خفيفة" || typeselect === "ثقيلة" ? typeselect : Type;
      const result = await SELECTallDatafromTableRequestsV2(
        querytype,
        ProjectID,
        kind,
        Done,
        lastID,
        !verifyUser ? "AND InsertBy='" + userSession.PhoneNumber + "'" : ""
      );
      let arraynew = [];
      await Promise.all(
        result.map(async (pic) => {
          let InsertBy = null;
          let Implementedby = null;
          if (pic.InsertBy !== null) {
            const user = await SELECTTableusersCompanyonObject(pic.InsertBy);
            InsertBy = user.userName;
          }
          if (pic.Implementedby !== null) {
            const user = await SELECTTableusersCompanyonObject(
              pic.Implementedby
            );
            Implementedby = user.userName;
          }
          arraynew.push({
            ...pic,
            Image: pic.Image !== null ? JSON.parse(pic.Image) : [],
            InsertBy: InsertBy,
            Implementedby: Implementedby,
          });
        })
      );
      const sortedData = arraynew
        .sort((a, b) => a.RequestsID - b.RequestsID)
        .reverse();

      res.send({ success: "تمت العملية بنجاح", data: sortedData }).status(200);
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل تنفيذ العملية" }).status(200);
    }
  };
};

const BringCountRequstsV2 = () => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      const { ProjectID, type } = req.query;

      const userdata = await SELECTTableusersCompanyVerification(
        userSession.PhoneNumber
      );

      const  boss  = await BringUserinProject(
        JSON.parse(userdata[0].Validity),
        ProjectID,
        0,
        "validityJob"
      );
      let verifyUser =
        String(userSession.job).split(" ")[1] === "طلبيات" ||
        boss === "مدير الفرع" ||
        userSession.job === "Admin";

      const countCLOSE = await SELECTDataAndTaketDonefromTableRequests2(
        ProjectID,
        type,
        "false",
        !verifyUser ? " InsertBy='" + userSession.PhoneNumber + "' AND" : ""
      );
      const countOPEN = await SELECTDataAndTaketDonefromTableRequests2(
        ProjectID,
        type,
        "true",
        !verifyUser ? " InsertBy='" + userSession.PhoneNumber + "' AND" : ""
      );
      res.send({
        success: "تمت العملية النجاح",
        data: {
          Close: countCLOSE["COUNT(Done)"],
          Open: countOPEN["COUNT(Done)"],
        },
      });
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل تنفيذ العملية" }).status(200);
    }
  };
};

// *******************************************************************************
// *************************** انشاء تقرير للمشروع *****************************

const BringReportforProject = () => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
        console.log("Invalid session");
      }
      const ProjectID = req.query.ProjectID;

      const result = await SELECTTablecompanySubProjectStageCUST(ProjectID);
      let arrayresult = [];
      let arrayDelay = [];
      let arrayTrue = [];
      // console.log(result.length, ProjectID);
      for (let index = 0; index < result.length; index++) {
        const element = result[index];
        if (
          element.Done === "true" &&
          String(element.Difference).startsWith("-")
        ) {
          arrayDelay.push(index);
        }
        const rate = await PercentagecalculationforSTage(
          element.StageID,
          ProjectID
        );
        if (rate === 0) {
          arrayresult.push(rate);
        }
        if (rate === 100) {
          arrayTrue.push(rate);
        }
      }
      // اجمالي الهام
      const accountallStageProject = await SELECTTablecompanybrinshStagesSubAll(
        ProjectID
      );
      const countall = accountallStageProject["COUNT(StageSubName)"];

      // اجمالي المهام المنفذة
      const accountTrueStage = await SELECTTablecompanybrinshStagesSubAll(
        ProjectID,
        "true"
      );
      // اجمالي قيد الانتظار
      const accountFalseStage = await SELECTTablecompanybrinshStagesSubAll(
        ProjectID,
        "false"
      );

      // عدد المراحل المنجزة
      const countTrue = accountTrueStage["COUNT(StageSubName)"];

      // النسبة المئوية للمشروع
      const rateProject = await PercentagecalculationforProject(ProjectID);

      // قيد الانتظار
      //  عدد المهام قيد التنفيذ
      const StagesPending = accountFalseStage["COUNT(StageSubName)"];
      // المتأخرة
      //  عدد المراحل المتأخرة
      const LateStages = arrayDelay.length;

      const DelayProject = await SELECTTableStageNotesAllproject(ProjectID);

      // حساب الايام المتبقية
      const { TotalDay, ratematchtime } =
        await Numberofdaysremainingfortheproject(ProjectID);

      // استخراج تاخري نهاية اخر مرحلة رئيسية في المشروع
      const dataStage = await SELECTTablecompanySubProjectStageCUSTONe(
        ProjectID,
        0,
        "notifcation",
        "cu.ProjectID=?"
      );
      const EndDateProject = dataStage?.EndDate;

      // استخراج تاريخ بداية المشروع
      const DataProject = await SELECTTablecompanySubProject(
        ProjectID,
        0,
        "difference"
      );
      const startDateProject = new Date(DataProject[0]?.ProjectStartdate);

      // اجمالي المالية
      const Amount = await SELECTSUMAmountandBring(ProjectID);

      // الطلبات
      const countallRequests = await SELECTDataAndTaketDonefromTableRequests(
        ProjectID,
        "allCount"
      );
      //  عدد الطلبات المغلقة
      const countCLOSE = await SELECTDataAndTaketDonefromTableRequests(
        ProjectID,
        "false"
      );
      let RateRequests =
        (countCLOSE["COUNT(Done)"] / countallRequests["COUNT(Done)"]) * 100;
      if (isNaN(RateRequests)) {
        RateRequests = 0;
      }
      // عدد الطلبات المفتوحة
      const countOPEN = await SELECTDataAndTaketDonefromTableRequests(
        ProjectID,
        "true"
      );
      // اكثر مهندس متفاعل عبر معرفة اكثر المهام منجزة

      const userMostAccomplished = await ExtractTheMostAccomplished(
        ProjectID,
        countTrue
      );
      const itemProject = await SELECTProjectStartdate(ProjectID, "Const");
      const { daysDifference, Total } = await AccountCostProject(
        itemProject.id,
        itemProject.ConstCompany
      );

      // استخراج مدير الفرع
      const userdata = await SELECTTableusersCompanyboss(
        userSession?.IDCompany
      );

      const boss = await Extract_Reporting_Section_Manager(
        userdata,
        DataProject[0]?.IDcompanySub
      );

      let data = {
        countSTageTrue: countTrue,
        countStageall: countall,
        rateProject: rateProject,
        StagesPending: StagesPending,
        LateStages: LateStages,
        countallRequests: countallRequests["COUNT(Done)"],
        countCLOSE: countCLOSE["COUNT(Done)"],
        countOPEN: countOPEN["COUNT(Done)"],
        RateRequests: RateRequests,
        MostAccomplished: userMostAccomplished,
        DaysUntiltoday: daysDifference,
        TotalcosttothCompany: Total,

        Nameproject: DataProject[0].Nameproject,
        TypeOFContract: DataProject[0].TypeOFContract,
        Daysremaining: TotalDay,
        ratematchtime: ratematchtime,
        EndDateProject: EndDateProject,
        startDateProject: startDateProject,
        TotalRevenue: Amount?.TotalRevenue,
        TotalExpense: Amount?.TotalExpense,
        TotalReturns: Amount?.TotalReturns,
        TotalDelayDay:
          DelayProject.length > 0
            ? DelayProject.map((item) => item.countdayDelay).reduce(
                (item, r) => item + r
              )
            : 0,
        DelayProject: DelayProject,
        boss: boss,
        NameCompany: userdata[0].NameCompany,
      };
      res.send({ success: "تمت العملية بنجاح", data: data }).status(200);
    } catch (error) {
      console.log(error);
      res.send({ success: "فشل تنفيذ العملية" }).status(404);
    }
  };
};

// لانشاء كائن المشروع
const BringTotalbalance = async (IDcompanySub, IDCompany, result) => {
  let arrayReturnProject = [];
  const datacompany = await SELECTTablecompany(IDCompany, "DisabledFinance");
  for (let index = 0; index < result?.length; index++) {
    const element = result[index];

    const data = await OpreationExtrinProject(
      element,
      IDCompany,
      IDcompanySub
    );
    if (data !== undefined) {
      arrayReturnProject.push({
        ...data,
        DisabledFinance: datacompany?.DisabledFinance,
      });
    }
  }
  return arrayReturnProject;
};
// عملية استخراج بيانات المشروع ككائان واحد
const OpreationExtrinProject = async (element, IDCompany, IDcompanySub) => {
  try {
    if (element?.id !== undefined) {
      const dataProject = await SELECTSUMAmountandBring(
        element.ProjectID !== undefined ? element.ProjectID : element.id
      );
      const rate = await PercentagecalculationforProject(
        element.ProjectID !== undefined ? element.ProjectID : element.id
      );
      const { daysDifference, Total } = await AccountCostProject(
        element.ProjectID !== undefined ? element.ProjectID : element.id,
        element.ConstCompany
      );
      const { TotalDay } = await Numberofdaysremainingfortheproject(
        element.ProjectID !== undefined ? element.ProjectID : element.id
      );
      const countuser = await BringCountUserinProject(
        IDCompany,
        IDcompanySub,
        element.ProjectID !== undefined ? element.ProjectID : element.id
      );
      const data = {
        ...element,
        DaysUntiltoday: daysDifference,
        TotalcosttothCompany: Total,
        cost: dataProject.RemainingBalance,
        rate: rate,
        countuser: countuser?.countuser,
        Daysremaining: TotalDay,
      };
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

// لمعرفة عدد مستخدمي المشروع

const BringCountUserinProject = (IDCompany, IDcompanySub, idproject) => {
  return new Promise(async (resolve, reject) => {
    let arrayvalidityuser = [];
    const result = await SELECTTableusersCompany(IDCompany);
    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      // console.log(element.Validity)
      const validity = JSON.parse(element.Validity) || [];
      if (validity.length > 0) {
        // console.log(type, "mmmmmmmm");
        const arrayUser = await BringUserinProject(
          validity,
          IDcompanySub,
          idproject,
          element
        );
 
        if (Object.entries(arrayUser).length > 0) {
          arrayvalidityuser.push(arrayUser);
        }
      }
    }
    resolve({ countuser: arrayvalidityuser.length });
  });
};
// استخراج المستخدمين الموجودين داخل المشروع
const BringUserinProject = (Validity, idBrinsh, idProject, element) => {
  let arrayUser = {};
  //      لاخراج  البيانات من داخل حاوية الصلاحيات
  Validity.forEach((pic) => {
    //  للتحقق من وجود المستخدم بداخل الفرع
    if (parseInt(pic.idBrinsh) === parseInt(idBrinsh)) {
      if(element === 'validityJob'){
        arrayUser = pic.job
      }else ;
      if (pic?.project.length > 0) {
        const findUserinProject = pic?.project?.find(
          (items) => parseInt(items.idProject) === parseInt(idProject)
        );
        //  للتحقق من وجود ان للمستخدم صلاحية لدخول المشروع
        if (findUserinProject) {
          arrayUser = element;
        }
      }
    } else {
      if (pic?.project.length > 0) {
        const findUserinProject = pic?.project?.find(
          (items) => parseInt(items.idProject) === parseInt(idProject)
        );
        //  للتحقق من وجود ان للمستخدم صلاحية لدخول المشروع
        if (findUserinProject) {
          arrayUser = findUserinProject;
        }
      }
    }
  });
  return arrayUser;
};

// استخراج مدير فرع الخاص بالتقرير

const Extract_Reporting_Section_Manager = (userdata, IDcompanySub) => {
  try {
    let boss;
    for (const user of userdata) {
      const validity = JSON.parse(user.Validity);
      const verification = validity.find(
        (item) => item.idBrinsh === IDcompanySub && item.job === "مدير الفرع"
      );
      if (verification) {
        boss = user.userName;
      }
    }
    return boss;
  } catch (error) {
    console.log(error);
  }
};

// حساب تكاليف المشروع حسب الايام
const AccountCostProject = async (id, ConstCompany) => {
  const DataProject = await SELECTTablecompanySubProject(id, 0, "difference");
  let Total = 0;
  let daysDifference;
  if (DataProject[0]?.ProjectStartdate !== null) {
    let StartDate = new Date(DataProject[0]?.ProjectStartdate);
    const date2 = new Date();
    daysDifference = await differenceInDays(StartDate, date2);
    // console.log(daysDifference);
    Total = parseInt(ConstCompany) * daysDifference;
  }
  if (isNaN(Total) || Total <= 0) {
    Total = 0;
    daysDifference = 0;
  }
  return { daysDifference, Total };
};

// const d = 328
// const b = -124
// console.log((b / d) * 100 )
// const percentageDifference = ((d - Math.abs(b)) / d) * 100;
// console.log(percentageDifference);
// حساب عدد الايام المتبقية للمشروع
const Numberofdaysremainingfortheproject = async (id) => {
  const DataProject = await SELECTTablecompanySubProject(id, 0, "difference");
  let TotalDay = 0;
  let ratematchtime = 0;

  const days = await SELECTTablecompanySubProjectStageCUST(
    id,
    "all",
    "SUM(Days)"
  );
  if (!isNaN(DataProject[0]?.ProjectStartdate)) {
    TotalDay = days[0]["SUM(Days)"];
  } else {
    const DAYSOFStage = days[0]["SUM(Days)"];
    const currentDate = new Date();
    const startDate = new Date(DataProject[0]?.ProjectStartdate);
    startDate.setDate(startDate.getDate() + DAYSOFStage); // إضافة الأيام

    const timeDiff = startDate - currentDate; // الفرق بين التواريخ بالمللي ثانية
    const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24)); // تحويل الفرق إلى أيام

    TotalDay = dayDiff;
  }
  ratematchtime =
    ((TotalDay + days[0]["SUM(Days)"]) / days[0]["SUM(Days)"]) * 100;
  // ratematchtime = (TotalDay / days[0]['SUM(Days)']) * 100;

  return { TotalDay, ratematchtime };
};

// حساب فارق الايام
function differenceInDays(startDate, endDate) {
  const millisecondsPerDay = 1000 * 60 * 60 * 24; // Milliseconds in one day
  const differenceInMilliseconds = endDate - startDate; // Difference in milliseconds
  return Math.floor(differenceInMilliseconds / millisecondsPerDay); // Convert to days
}

// استيراد النسبئة المئوية للمشروع

const PercentagecalculationforProject = async (id) => {
  try {
    //  نستدعي عدد كل المراحل الفرعية للمشروع
    const accountallStage = await SELECTTablecompanybrinshStagesSubAll(id);
    const countall = accountallStage["COUNT(StageSubName)"];
    const accountTrueStage = await SELECTTablecompanybrinshStagesSubAll(
      id,
      "true"
    );
    const countTrue = accountTrueStage["COUNT(StageSubName)"];
    let rate = (countTrue / countall) * 100;
    if (isNaN(rate)) {
      rate = 0;
    }

    return rate;
  } catch (error) {
    console.log(error);
  }
};

//  استيراد النسبئة المئوية للمرحلة
const PercentagecalculationforSTage = async (StageID, ProjectID) => {
  try {
    const accountallStageSub =
      await SELECTTablecompanySubProjectStageCUSTSubCount(StageID, ProjectID);
    const countall = accountallStageSub["COUNT(StageSubName)"];
    const accountTrueStageSub =
      await SELECTTablecompanySubProjectStageCUSTSubCount(
        StageID,
        ProjectID,
        "true"
      );
    const countTrue = accountTrueStageSub["COUNT(StageSubName)"];
    let rate = (countTrue / countall) * 100;

    if (isNaN(rate)) {
      rate = 0;
    }
    return rate;
  } catch (error) {
    console.log(error);
  }
};

// طلب ملفات الفرعية في الارشيف
const BringchildeArchives = async (children, idSub) => {
  return new Promise(async (resolve, reject) => {
    try {
      const folder = children?.find(
        (folder) => parseInt(folder.id) === parseInt(idSub)
      );

      if (folder) {
        resolve(folder.children);
      } else {
        children?.forEach(async (pic) => {
          if (pic.children) {
            const childrenNew = await BringchildeArchives(pic.children, idSub);
            // if(childrenNew !== undefined){
            resolve(childrenNew);
            // }
          }
        });
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
// استخراج الملفات والصورة من المجلد الفرعي
const ExtractDatafromFolderchilde = async (children) => {
  return new Promise((resolve, reject) => {
    let array = [];
    try {
      children?.forEach((pic, index) => {
        array.push({
          id: pic.id,
          namefile: `${pic.Date}(${index + 1})`,
          name: pic.name,
          type: pic.type,
          size: pic?.size !== undefined ? pic.size : null,
        });
      });
      resolve(array);
    } catch (error) {
      console.log(error);
    }
  });
};

//  التحقق ان المطلوب ليس من الملفات الرئيسية
const verifyfromfiletname = (folder) => {
  try {
    if (
      folder !== "المراحل" &&
      folder !== "العهد" &&
      folder !== "المرتجعات" &&
      folder !== "الفواتير والسندات"
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

// استخراج ملفات الفرعية للملفات الرئيسية للنظام
const ExtractDatafromFolderHome = async (
  idproject,
  FolderName,
  type = "Home",
  idSub = 0
) => {
  // console.log(FolderName);
  try {
    switch (FolderName) {
      case "المراحل":
        return await ExtractDatafromStage(idproject, type, idSub);
      case "الفواتير والسندات":
        return await ExtractDatafromExpense(idproject, type, idSub);
      case "العهد":
        return await ExtractDatafromRevenue(idproject, type, idSub);
      case "المرتجعات":
        return await ExtractDatafromReturn(idproject, type, idSub);
    }
  } catch (error) {
    console.log(error);
  }
};

// استخراج ملفات المراحل

const ExtractDatafromStage = async (idproject, type, idSub) => {
  try {
    let arrayfolder = [];
    const StagesCUST = await SELECTTablecompanySubProjectStageCUST(idproject);
    if (type === "Home") {
      StagesCUST.forEach((pic) => {
        arrayfolder.push({
          id: pic.StageID,
          idproject: idproject,
          name: pic.StageName,
          type: "folder",
        });
      });
    } else {
      let kind = idSub === "A1" ? "Chat" : "ChatSTAGE";
      const fileArray = await SELECTLastTableChateStage(
        idproject,
        idSub,
        1,
        "files",
        kind
      );
      // console.log(fileArray);
      for (let index = 0; index < fileArray.length; index++) {
        const element = fileArray[index];
        const Files = JSON.parse(element.File);
        if (Files.name !== undefined && Files.name !== "") {
          arrayfolder.push({
            id: index + 1,
            namefile: `${element.Date}(${index + 1})`,
            name: Files.name,
            type: Files.type,
            size: Files.size,
          });
        }
      }
    }

    return arrayfolder;
  } catch (error) {
    console.log(error);
  }
};

// استخراج الفواتير والسندات

const ExtractDatafromExpense = async (idproject, type, idSub) => {
  const dataHome = await SELECTTablecompanySubProjectexpense(
    idproject,
    "InvoiceNO"
  );
  // console.log(dataHome);
  let arrayfolder = [];
  if (type === "Home") {
    dataHome.forEach((pic, index) => {
      arrayfolder.push({
        id: pic.InvoiceNo,
        idproject: idproject,
        name: pic.InvoiceNo,
        type: "folder",
      });
    });
  } else {
    const datasub = await SELECTTablecompanySubProjectexpenseObjectOneforArchif(
      idSub,
      idproject
    );
    const Images = datasub.Image !== null ? JSON.parse(datasub.Image) : [];
    for (let index = 0; index < Images.length; index++) {
      const element = Images[index];
      arrayfolder.push({
        id: index + 1,
        namefile: `${datasub.InvoiceNo}-(${index + 1})`,
        name: element,
        type: "image/jpeg",
        size: 0,
      });
    }
    arrayfolder.push({
      id: arrayfolder.length + 1,
      Data: datasub,
      type: "Data",
      kindPage: "BringExpense",
      size: 0,
    });
  }
  return arrayfolder;
};

//
const ExtractDatafromReturn = async (idproject, type, idSub) => {
  try {
    const dataHome = await SELECTTablecompanySubProjectReturned(idproject);
    let arrayfolder = [];
    if (type === "Home") {
      dataHome.forEach((pic) => {
        arrayfolder.push({
          id: pic.ReturnsId,
          name: pic.ReturnsId,
          type: "folder",
        });
      });
    } else {
      const datasub = await SELECTTablecompanySubProjectReturnedObjectOne(
        idSub
      );
      const Images = datasub.Image !== null ? JSON.parse(datasub.Image) : [];
      for (let index = 0; index < Images.length; index++) {
        const element = Images[index];
        arrayfolder.push({
          id: index + 1,
          namefile: `${datasub.ReturnsId}-(${index + 1})`,
          name: element,
          type: "image/jpeg",
          size: 0,
        });
      }
      arrayfolder.push({
        id: arrayfolder.length + 1,
        Data: datasub,
        type: "Data",
        kindPage: "Return",
        size: 0,
      });
    }
    return arrayfolder;
  } catch (error) {
    console.log(error);
  }
};
const ExtractDatafromRevenue = async (idproject, type, idSub) => {
  try {
    const dataHome = await SELECTTablecompanySubProjectREVENUE(idproject);
    let arrayfolder = [];
    if (type === "Home") {
      dataHome.forEach((pic) => {
        arrayfolder.push({
          id: pic.RevenueId,
          name: pic.RevenueId,
          type: "folder",
        });
      });
    } else {
      const datasub = await SELECTTablecompanySubProjectREVENUEObjectOne(idSub);
      const Images = datasub.Image !== null ? JSON.parse(datasub.Image) : [];
      for (let index = 0; index < Images.length; index++) {
        const element = Images[index];
        arrayfolder.push({
          id: index + 1,
          namefile: `${datasub.RevenueId}-(${index + 1})`,

          name: element,
          type: "image/jpeg",
          size: 0,
        });
      }
      arrayfolder.push({
        id: arrayfolder.length + 1,
        Data: datasub,
        type: "Data",
        kindPage: "BringRevenue",

        size: 0,
      });
    }
    return arrayfolder;
  } catch (error) {
    console.log(error);
  }
};

// استخراج اكثر المهندسين انجازاً
const ExtractTheMostAccomplished = (ProjectID, countTrue) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await SELECTTablecompanySubProjectStagesSub(
        ProjectID,
        0,
        "accomplished"
      );
      let arrayNew = [];
      // console.log(result);
      for (let index = 0; index < result.length; index++) {
        const element = result[index];
        let arrayClosing = [];
        let Operations =
          element.closingoperations !== null
            ? JSON.parse(element.closingoperations)
            : [];
        for (let P = 0; P < Operations.length; P++) {
          const item = Operations[P];
          if (item.type === "تم الانجاز") {
            arrayClosing.push(item);
          }
        }
        arrayNew.push(arrayClosing[arrayClosing.length - 1]);
      }
      const similarPhoneNumbers = await countOccurrences(
        arrayNew,
        "PhoneNumber"
      );
      // console.log(similarPhoneNumbers);
      const largestNumber = await extractLargestNumber(similarPhoneNumbers);
      let arrayUser = [];
      for (let index = 0; index < largestNumber?.user.length; index++) {
        const items = largestNumber?.user[index];
        const DataUser = await SELECTTableusersCompanyonObject(items);
        let rate = (largestNumber.maxNumber / countTrue) * 100;
        if (isNaN(rate)) {
          rate = 0;
        }
        arrayUser.push({
          id: DataUser.id,
          userName: DataUser.userName,
          IDNumber: DataUser.IDNumber,
          PhoneNumber: DataUser.PhoneNumber,
          image: DataUser.image,
          job: DataUser.job,
          Count: largestNumber.maxNumber,
          rate: rate,
        });
      }
      resolve(arrayUser);
    } catch (error) {
      console.log(error);
    }
  });
};

// const data = { Alice: 4, Bob: 2,Bobd: 4, Charlie: 1 };

// Function to extract the largest number
function extractLargestNumber(obj) {
  const maxNumber = Math.max(...Object.values(obj));
  const user = Object.entries(obj)
    .filter(([key, value]) => value === maxNumber)
    .map((item) => item[0]);
  return { user, maxNumber };
}

// const largestNumber = extractLargestNumber(data);
// console.log(largestNumber); // Output: 4

// Sample data array
// let array = [
//   { id: 1001, userName: 'Alice', PhoneNumber: '1234567890', Date: new Date().toDateString() },
//   { id: 1002, userName: 'Bob', PhoneNumber: '1234567891', Date: new Date().toDateString() },
//   { id: 1003, userName: 'Alice', PhoneNumber: '1234567890', Date: new Date().toDateString() },
//   { id: 1004, userName: 'Charlie', PhoneNumber: '1234567892', Date: new Date().toDateString() },
//   { id: 1005, userName: 'Bob', PhoneNumber: '1234567891', Date: new Date().toDateString() },
// ];
function countOccurrences(arr, key) {
  return arr.reduce((acc, item) => {
    const value = item[key];
    if (acc[value]) {
      acc[value] += 1; // Increment count if already exists
    } else {
      acc[value] = 1; // Initialize count
    }
    return acc;
  }, {});
}

// const phoneNumberCounts = countOccurrences(array, 'userName');
// console.log(phoneNumberCounts);

// Function to extract duplicates based on userName or PhoneNumber
// function extractSimilarElements(arr, key) {
//     const seen = new Set();
//     const duplicates = arr.filter(item => {
//         const value = item[key];
//         if (seen.has(value)) {
//             return true; // Found a duplicate
//         }
//         seen.add(value);
//         return false;
//     });
//     return [...new Set(duplicates)]; // Remove duplicates from the result
// }

// Extract duplicates based on PhoneNumber

// const similarPhoneNumbers = extractSimilarElements(array, 'PhoneNumber');
// console.log(similarPhoneNumbers);
module.exports = {
  BringProject,
  BringProjectindividual,
  BringStageTemplet,
  BringStageSubTemplet,
  BringStage,
  BringStagesub,
  BringStageNotes,
  BringExpense,
  BringRevenue,
  BringReturned,
  BringArchives,
  BringArchivesFolderdata,
  PercentagecalculationforSTage,
  BringStageOneObject,
  BringArchivesFolderdata,
  BringTotalAmountproject,
  BringStatmentFinancialforproject,
  SearchinFinance,
  BringDataRequests,
  BringCountRequsts,
  BringReportforProject,
  BringProjectObjectone,
  BringDataprojectClosed,
  FilterProject,
  BringDataRequestsV2,
  BringCountRequstsV2,
};
