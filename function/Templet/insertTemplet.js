const { uploaddata } = require("../../bucketClooud");
const {
  verificationfromdata,
  StageTempletXsl2,
} = require("../../middleware/Aid");
const { implmentOpreationSingle } = require("../../middleware/Fsfile");
const {
  insertTablecompanySubProjectStagetemplet,
  insertTablecompanySubProjectStageSubtemplet2,
  insertTablecompanySubProjectStageSubtemplet,
  insertTableStagestype,
} = require("../../sql/INsertteble");
const {
  SELECTFROMTableStageTempletmax,
} = require("../../sql/selected/selected");

const insertStageHome = (uploadQueue) => {
  return async (req, res) => {
    try {
      const { Type, StageName, Days, Ratio = 0 , attached } = req.body;
      const userSession = req.session.user;
      if (!userSession) {
        return res.status(401).send("Invalid session");
      }

      if (await verificationfromdata([Type, StageName, Days])) {
        const result = await SELECTFROMTableStageTempletmax(
          Type,
          userSession?.IDCompany
        );
        const ListID = await insertTableStagestype(userSession?.IDCompany,Type);

        if (result.StageID && String(result.StageID)?.length !== 0) {
          // حساب مجموع النسب التقديرية الحالية مع النسبة الجديدة
          const currentRatio = result.TotalRatio || 0; // إذا كانت النسبة غير موجودة، تعتبر 0
          const totalRatio =
            Type !== "عام" ? currentRatio + Number(Ratio) : Ratio;

          // التحقق إذا كانت النسبة الإجمالية أكبر من 100
          if (totalRatio > 100) {
            return res
              .status(400)
              .send({ error: "مجموع النسب لا يجب أن يتجاوز 100" });
          }
          await insertTablecompanySubProjectStagetemplet([
            Number(result.StageID) + 1,
            Type,
            StageName,
            Days,
            Ratio,
            attached,
            userSession?.IDCompany,
            ListID,
          ]);

          return res.send({ success: "تمت الاضافة بنجاح" }).status(200);
        } else {
          return res.send({ success: "هناك خطأ" }).status(200);
        }
      } else {
        return res
          .send({ success: "يرجى ادخال البيانات بشكل صحيح" })
          .status(400);
      }
    } catch (error) {
      console.log(error);
    }
  };
};

const insertStageSub = (uploadQueue) => {
  return async (req, res) => {
    try {
      const { StageID, StageSubName, Stagestype_id } = req.body;
      const userSession = req.session.user;
      if (!userSession) {
        return res.status(401).send("Invalid session");
      }

      const attached = req.file ? req.file.filename : null;
      if (await verificationfromdata([StageID, StageSubName])) {
        if (attached !== null && attached !== undefined) {
          await insertTablecompanySubProjectStageSubtemplet2([
            StageID,
            StageSubName,
            attached,
            userSession?.IDCompany,
            Stagestype_id,
          ]);
          await uploaddata(req.file);
          await implmentOpreationSingle("upload", attached);
        } else {
          await insertTablecompanySubProjectStageSubtemplet2([
            StageID,
            StageSubName,
            null,
            userSession?.IDCompany,
            Stagestype_id,
          ]);
        }
        return res.send({ success: "تمت الاضافة بنجاح" }).status(200);
      } else {
        return res
          .send({ success: "يرجى ادخال البيانات بشكل صحيح" })
          .status(400);
      }
    } catch (error) {
      console.log(error);
      return res.send({ success: "حدث خطأ" }).status(400);
    }
  };
};
function checkIfNumber(item, key, type = "جدول المراحل الرئيسية") {
  if (String(item[key]).length <= 0) {
    return `${type} في ${key} يجب ملىء`;
  }
  return null; // إذا كانت القيمة صحيحة
};

// const finRatio = data
//         .filter((item) => !isNaN(Number(elements[4]))) // التصفية فقط للأرقام
//         .reduce((acc, curr) => acc + Number(curr.Ratio), 0);
//       if (finRatio > 100) {
//         res.status(401).send({
//           success: "يجب ان تكون النسبة التقديرية اقل من 100",
//         });
//       }
const b = [
  {StageID:1,StageName:'hello',Days:5},
  {StageID:2,StageName:'srrtre',Days:2},
  {StageID:3,StageName:'gdasdf',Days:5},
  {StageID:4,StageName:'xzcvzcv',Days:6},
  {StageID:5,StageName:'345dfs',Days:7},
];
const stageIDToSearch = 3; 

// الفهرس الذي يمثل عمود StageID في الكائن (بافتراض أنه في الفهرس 0)
const stageIDColumnIndex = 0;

for (let item of b) {
  // التحقق باستخدام الفهرس (رقم العمود) بدلاً من الاسم
  const stageID = Object.values(item)[stageIDColumnIndex]; 

  if (stageID === stageIDToSearch) {
    break; // التوقف بعد العثور على العنصر
  }
}
// console.log(b)

// const insertStageTempletinDatabase = async (path) => {
//     try {
    
//       const data = await StageTempletXsl2(path, 0);
      
//       if (data && data.length > 0) {
//         console.log(data);
//         const dataSub = await StageTempletXsl2(path, 1);
//         const result = await SELECTFROMTableStageTempletmax(
//           "عام",
//           1
//         );
        
//         let StageIDnew = Number(result.StageID || 0);
//         for (const item of data) {
//           const elements = Object.values(item);
//           const validationMessage =
//           checkIfNumber(elements, 0) || checkIfNumber(elements, 3);
//           StageIDnew += 1;
          
          
//           console.log(path,elements);
//           if (elements[3] && Number(elements[3])) {
//             const finRatio = data
//               .filter((items) => Object.values(items)[0] === elements[0]) // التصفية فقط للأرقام
//               .reduce((acc, curr) => acc + Number(curr.Ratio), 0);
//             if (finRatio > 100) {
//               return res.status(200).send({
//                 success: "يجب ان تكون النسبة التقديرية اقل من 100",
//               });
//             }
//           }
//          const ListID = await insertTableStagestype(elements[1]);



//           if (dataSub && dataSub.length > 0) {
//             //  console.log( StageIDnew,
//             // elements[0],
//             // elements[1],
//             // elements[2],
//             // Number(elements[3] || 0),
//             // null,
//             // 1,
//             // ListID,'hhh',dataSub)
//             for (const itemsub of dataSub) {
//               let sub = Object.values(itemsub);
//               if (sub[0] === elements[0]) {
//                 console.log(  StageIDnew,
//                     sub[1],
//                     1,
//                     ListID,sub[0] === elements[0],'hhhhh')
             
//               }
//             }
//           }
//         }

       
//       } else {
//         new Error("No data found in the Excel file.");
//       }
//     } catch (error) {
      
//     }
// };


// insertStageTempletinDatabase('D:\\ppp\\aldy\\Purebred_horses\\38\\backend\\StagesTempletEXcel2.xlsx')
const insertStageTempletinDatabase = (uploadQueue) => {
  return async (req, res) => {
    try {
      const userSession = req.session.user;
      if (!userSession) {
        res.status(401).send("Invalid session");
      };

      const data = await StageTempletXsl2(req.file.path, 0);
      if (data && data.length > 0) {
        const dataSub = await StageTempletXsl2(req.file.path, 1);
        const result = await SELECTFROMTableStageTempletmax(
          "عام",
          userSession?.IDCompany
        );

        let StageIDnew = Number(result.StageID || 0);

        for (const item of data) {
          const elements = Object.values(item);
          const validationMessage =
            checkIfNumber(elements, 0) || checkIfNumber(elements, 3);
          StageIDnew += 1;

          if (validationMessage) {
            return res.status(200).send({
              success: validationMessage,
            });
          }

          if (elements[3] && Number(elements[3])) {
            const finRatio = data
              .filter((items) => Object.values(items)[0] === elements[0]) // التصفية فقط للأرقام
              .reduce((acc, curr) => acc + Number(curr.Ratio), 0);
            if (finRatio > 100) {
              return res.status(200).send({
                success: "يجب ان تكون النسبة التقديرية اقل من 100",
              });
            }
          }
          const ListID = await insertTableStagestype( elements[1]);

          await insertTablecompanySubProjectStagetemplet([
            StageIDnew,
            elements[0],
            elements[1],
            elements[2],
            Number(elements[3] || 0),
            null,
            userSession?.IDCompany,
            ListID,
          ]);

          if (dataSub && dataSub.length > 0) {
            for (const itemsub of dataSub) {
              let sub = Object.values(itemsub);
              if (sub[0] === elements[0]) {
                await insertTablecompanySubProjectStageSubtemplet([
                  StageIDnew,
                  sub[1],
                  userSession?.IDCompany,
                  ListID,
                ]);
              }
            }
          }
        }

        return res
          .send({
            success: "تمت العملية بنجاح ",
          })
          .status(200);
      } else {
        new Error("No data found in the Excel file.");
      }
    } catch (error) {
      return res
        .send({
          success: "حدث خطأ اثناء ادخال البيانات ",
        })
        .status(401);
    }
  };
};


const insertTypeTemplet = () => {
  return async (req,res) =>{
    const userSession = req.session.user;
    const {Type} = req.params;

    if(!userSession){
        return res.status(401).send("Invalid session");
    };
    await insertTableStagestype(userSession?.IDCompany,Type);
    return res.status(200).send({ success: "تمت الاضافة بنجاح" });


  }
}
module.exports = {
  insertStageHome,
  insertStageSub,
  insertStageTempletinDatabase,
  insertTypeTemplet
};
