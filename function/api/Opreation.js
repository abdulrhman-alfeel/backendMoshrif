const { uploaddata } = require("../../bucketClooud");
const { deleteFileSingle } = require("../../middleware/Fsfile");
const { DeleteTablecompanySubProjectall, DeleteTablecompanySubProjectallapi } = require("../../sql/delete");
const { insertTablecompanySubProjectexpenseapi, insertTablecompanySubProjectREVENUEapi, insertTablecompanySubProjectReturnedapi } = require("../../sql/INsertteble");
const { SELECTProjectStartdate, SELECTTablecompanySubProjectexpenseObjectOne, SELECTTableFinance, SELECTTableFinanceapi } = require("../../sql/selected/selected");
const { UPDATETablecompanySubProjectexpenseapi, UPDATETablecompanySubProjectREVENUEapi, UPDATETablecompanySubProjectReturnedapi, UPDATETablecompanySubProjectFinancial, UpdateTablecompanySubProjectapi } = require("../../sql/update");
const { OpreationProjectInsertv2 } = require("../companyinsert/insertProject");
const { RearrangeStageID, Switchbetweendeleteorupdatefiles } = require("../companyinsert/UpdateProject");
const { Projectinsert, Financeinsertnotification } = require("../notifcation/NotifcationProject");



const ProjectOpreationsinsert = async (req,res) =>{
    try{
    const {IDcompanySub,Nameproject,Note,TypeOFContract,GuardNumber,LocationProject,numberBuilding,Referencenumber,userName}= req.body;
    const Contractsigningdate = new Date();
    await OpreationProjectInsertv2(IDcompanySub,Nameproject,Note,TypeOFContract,GuardNumber,LocationProject,numberBuilding,Referencenumber,Contractsigningdate);
    await Projectinsert(IDcompanySub, userName);

    res
    .send({
    success: "تم انشاء مشروع بنجاح",
    })
    .status(200);
    }catch(error){console.log(error)}
}

const ProjectOpreationsUpdate = async (req,res) =>{
    try{
    const dataCampny = req.session.data;
    const {IDcompanySub,Nameproject,Note,GuardNumber,LocationProject,numberBuilding,Referencenumber,userName}= req.body;
    const StartDate = await SELECTProjectStartdate(Referencenumber,"all","Referencenumber");
    await UpdateTablecompanySubProjectapi([Nameproject,Note,GuardNumber,LocationProject,numberBuilding,IDcompanySub,Referencenumber,dataCampny?.id],"Referencenumber");
    if (StartDate?.numberBuilding !== numberBuilding) {
        await RearrangeStageID(StartDate.id, StartDate, numberBuilding);
    }
    await Projectinsert(StartDate.IDcompanySub, userName, "تعديل");
    res
    .send({
    success: "تم تعديل مشروع بنجاح",
    })
    .status(200);
    }catch(error){console.log(error)}
}


const FinancialOperationsDatainsert = async (req,res) =>{
    try{
        const {Referencenumber,Amount,Data,SectionType,Referencenumberfinanc,userName} = req.body;
        const dataProject = await SELECTProjectStartdate(Referencenumber,"all","Referencenumber");
        const projectID = dataProject?.id;
        // Expense
        switch(SectionType){
            case "Expense":
            const ClassificationName = req.body.ClassificationName;
            await OpreationExpensedatainsert(Referencenumberfinanc,
                projectID,
                Amount,
                Data,
                ClassificationName
                );
            await Financeinsertnotification(
                projectID,
                "مصروفات",
                "إضافة",
                userName
                );
            break
            case "Revenue":
            const Bank = req.body.Bank;
            await insertTablecompanySubProjectREVENUEapi([
                Referencenumberfinanc,
                projectID,
                Amount,
                Data,
                Bank
            ]);
            await Financeinsertnotification(
                projectID,
                "عهد",
                "إضافة",
                userName
            );
            break
            case "Returns": 
            await insertTablecompanySubProjectReturnedapi([
                Referencenumber,
                projectID,
                Amount,
                Data
            ]);
            await Financeinsertnotification(
                projectID,
                "مرتجعات",
                "إضافة",
                userName
            );
            break
        }
        res
        .send({
        success: "تم اضافة البيانات  بنجاح",
        })
        .status(200);

    }catch(error){console.log(error)}
}

const FinancialOperationsDataUpdate = async (req,res) =>{
    try{
        const dataCampny = req.session.data;
        const {IDcompanySub,Referencenumber,Amount,Data,SectionType,Referencenumberfinanc} = req.body;
        // Expense 
        switch(SectionType){
            case "Expense":
            const ClassificationName = req.body.ClassificationName;
            await UPDATETablecompanySubProjectexpenseapi([Amount,Data,ClassificationName,Referencenumberfinanc,dataCampny?.id,IDcompanySub,Referencenumber]);
            break
            case "Revenue":
            const Bank = req.body.Bank;
            await UPDATETablecompanySubProjectREVENUEapi([
                Amount,
                Data,
                Bank,
                Referencenumberfinanc,
                dataCampny?.id,IDcompanySub,Referencenumber
            ]);
            break
            case "Returns": 
            await UPDATETablecompanySubProjectReturnedapi([
                Amount,
                Data,
                Referencenumberfinanc,
                dataCampny?.id,IDcompanySub,Referencenumber
            ]);
            break
        }
        res
        .send({
        success: "تم تعديل  بنجاح",
        })
        .status(200);

    }catch(error){
        console.log(error);
        res
        .send({
        success: "فشل تنفيذ العملية",
        })
        .status(402);
    }
}


const FinancialOperationsFile = async (req,res) => {
    try{
        const dataCampny = req.session.data;
        const {IDcompanySub,Referencenumber,Referencenumberfinanc,SectionType} = req.body;
        let arrayImage = [];
        if (req.files && req.files.length > 0) {
        for (let index = 0; index < req.files.length; index++) {
        const element = req.files[index];
        await uploaddata(element);
        deleteFileSingle(element.filename, "upload");
        arrayImage.push(element.filename);
    }
}
    if(Boolean(SectionType)  && req.files.length > 0){
        await UPDATETablecompanySubProjectFinancial([JSON.stringify(arrayImage),Referencenumberfinanc,dataCampny?.id,IDcompanySub,Referencenumber],SectionType);
        res
        .send({
        success: "تم اضافة الملفات  بنجاح",
        })
        .status(200);
    }else{
        res
        .send({
        success: "فشل تنفيذ العملية",
        })
        .status(402);
    }
    }catch(error){
        console.error(error);
        res
        .send({
        success: "فشل تنفيذ العملية",
        })
        .status(402);
    }
}


const OpreationExpensedatainsert = async (
    Referencenumberfinanc,
    projectID,
    Amount,
    Data,
    ClassificationName,
    ) => {
        if (Boolean(Amount) && Boolean(Data)) {
            const Taxable = 15;
            const totaldataproject =
            await SELECTTablecompanySubProjectexpenseObjectOne(projectID, "count");
            const InvoiceNo = totaldataproject["COUNT(*)"] + 1;
    
            await insertTablecompanySubProjectexpenseapi([
                Referencenumberfinanc,
                projectID,
                Amount,
                Data,
                ClassificationName,
                InvoiceNo,
                Taxable
            ])
        
        }
    
}



const DeleteOperationsFinancial = async (req,res) => {
    try{
        const dataCampny = req.session.data;
        const {typeTeple,Referencenumberfinanc,IDcompanySub,Referencenumber} = req.query;
        const NumberCompany = dataCampny.id;
        const result = await SELECTTableFinanceapi(typeTeple,parseInt(Referencenumberfinanc),parseInt(NumberCompany),parseInt(IDcompanySub),parseInt(Referencenumber));
        let Images = Boolean(result.Image) ? JSON.parse(result.Image) : [];
        for (let index = 0; index < Images.length; index++) {
        const element = Images[index];
        console.log(element);
        await Switchbetweendeleteorupdatefiles(element, "", "delete");
        }
        await DeleteTablecompanySubProjectallapi(typeTeple, parseInt(Referencenumberfinanc),parseInt(NumberCompany),parseInt(IDcompanySub),parseInt(Referencenumber));
        res.status(200).send({success:'تمت العملية بنجاح'}); 

        } catch (error) {
        return res.status(500).json({ error: 'Something went wrong' });
        }

}




module.exports = {
    ProjectOpreationsinsert,
    ProjectOpreationsUpdate,
    FinancialOperationsDatainsert,
    FinancialOperationsDataUpdate,
    FinancialOperationsFile,
    DeleteOperationsFinancial
}