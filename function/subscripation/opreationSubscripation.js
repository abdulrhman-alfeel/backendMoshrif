const moment = require("moment-timezone");
const { inserTableSubscripation } = require("../../sql/INsertteble");





const insertDataproject = async (IDCompany,ProjectID) => {
try{
    const newDate = moment.parseZone(new Date()).format("yy-MM-DD");
    const endDate = `${moment.parseZone(newDate).format("yy-MM")}-30`;
    console.log(endDate,newDate)
    await inserTableSubscripation([IDCompany,ProjectID,newDate,endDate]);
}catch(error){
    console.log(error)
}
};


const opreationInvoice =  () => {
    return async (req,res) =>{
    




    }
}