const { insertTablePostPublic } = require("../../sql/INsertteble");
const {
  SELECTTableIDcompanytoPost,
  SELECTTablePostPublic,
  SELECTCOUNTCOMMENTANDLIKPOST,
  SELECTTableLikesPostPublicotherroad,
  SELECTTableCommentPostPublic,
  SELECTTablePostPublicSearch,
  SELECTTablePostPublicOneObject,
  SELECTTablecompanySub,
} = require("../../sql/selected/selected");
const { SELECTTableusersCompanyonObject } = require("../../sql/selected/selectuser");


const BringPost = async (req, res) => {
  try {
    const id = req.query.CompanyID;
    const PostID = req.query.PostID;
    const user = req.query.user;
    const now = new Date();
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
    }

    // Extract day, month, and year from the Date object
    const day = String(now.getUTCDate()).padStart(2, "0"); // Day of the month (01 to 31)
    const month = String(now.getUTCMonth() + 1).padStart(2, "0"); // Month (01 to 12)
    const year = String(now.getUTCFullYear()).slice(); // Last two digits of the year

    // Format the date as "DD-MM-YY"
    const formattedDate = `${year}-${month}-${day}`;
    let where ='';

    if(userSession.jobdiscrption !== 'موظف'){
    const arrayes= await BringPostforUsersinCompany(userSession.PhoneNumber);
    where = `AND PR.id= ${arrayes}`
    }


    const arrayPosts = await BringPostforEmploaysCompany(id, formattedDate, PostID,user,where);
    res.send({ success: "تمت العملية بنجاح", data: arrayPosts }).status(200);
    // console.log(arrayPosts);
  } catch (error) {
    console.log(error);
    res.send({ success: "فشل تنفيذ العملية" }).status(404);
  }
};

const BringCommentinsert = async (req, res) => {
  try {
    const PostId = req.query.PostID;
    const count = req.query.count;

    const result = await SELECTTableCommentPostPublic(PostId, count);
    res.send({ success: "تمت العملية بنجاح", data: result }).status(200);
  } catch (error) {
    console.log(error);
    res.send({ success: "فشل تنفيذ المهمة" }).status(404);
  }
};


// وظيفة جلب المنشورات لاعضاء الشركة 
const BringPostforEmploaysCompany =async (id, formattedDate, PostID,user,where ="") =>{
  try{   
    const result = await SELECTTablePostPublic(id, formattedDate, PostID,where);
    let arrayPosts = [];
    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      const Comment = await SELECTCOUNTCOMMENTANDLIKPOST(
        element.PostID,
        "Comment"
      );
      const Likeuser = await SELECTTableLikesPostPublicotherroad(
        element.PostID,
        user
      );
      const Likes = await SELECTCOUNTCOMMENTANDLIKPOST(element.PostID, "Likes");

      let data = {
        ...element,
        Likeuser:
          Likeuser !== false && Likeuser !== undefined ? true : Likeuser,
        Comment: Comment["COUNT(userName)"],
        Likes: Likes["COUNT(userName)"],
      };
      arrayPosts.push(data);
    }
    return arrayPosts;
  }catch(error){console.log(error)}
}



const BringPostforUsersinCompany = async (PhoneNumber) => {
  try{
    
    const arrayData = await filterProjectforusers(PhoneNumber);
    const where = arrayData.reduce((item,r) => `${String(item) + " AND "+ r}`);
    return where;
  }catch(error){
    console.log(error);
  };
}


const filterProjectforusers = (PhoneNumber, idBrinsh = 0) => {
  try {
    return new Promise(async (resolve, reject) => {
      const Datausere = await SELECTTableusersCompanyonObject(PhoneNumber);

      let validity =
        Datausere.Validity !== null ? JSON.parse(Datausere.Validity) : [];
      let arrayData = [];
        for (let index = 0; index < validity?.length; index++) {
          const element = validity[index];
          for (let index = 0; index < element.project.length; index++) {
                const elementProject = element.project[index];
                  arrayData.push(elementProject.idProject);
              }
        }
        resolve(arrayData);
     
    });
  } catch (error) {
    console.log(error);
  }
};

const SearchPosts = async (req, res) => {
  try {
    const id = req.query.CompanyID;
    const DateStart = req.query.DateStart;
    const DateEnd = req.query.DateEnd;
    const type = req.query.type;
    const nameProject = req.query.nameProject;
    const userName = req.query.userName;
    const branch = req.query.branch;
    const PostID = req.query.PostID;
    const user = req.query.user;

    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
    }

    let where ='';

    if(userSession.jobdiscrption !== 'موظف'){
    const arrayes= await BringPostforUsersinCompany(userSession.PhoneNumber);
    where = `AND PR.id= ${arrayes}`
    };

    const result = await SELECTTablePostPublicSearch(
      id,
      DateStart,
      DateEnd,
      type,
      nameProject,
      userName,
      branch,
      parseInt(PostID),
      where
    );
    let arraynew = [];

    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      const Comment = await SELECTCOUNTCOMMENTANDLIKPOST(
        element.PostID,
        "Comment"
      );
      const Likeuser = await SELECTTableLikesPostPublicotherroad(
        element.PostID,
        user
      );
      const Likes = await SELECTCOUNTCOMMENTANDLIKPOST(element.PostID, "Likes");
      let data = {
        ...element,
        Likeuser:
          Likeuser !== false && Likeuser !== undefined ? true : Likeuser,
        Comment: Comment["COUNT(userName)"],
        Likes: Likes["COUNT(userName)"],
      };
      arraynew.push(data);
    }
    res.send({ success: "تمت العملية بنجاح", data: arraynew }).status(200);
  } catch (error) {
    console.log(error);
    res.send({ success: "فشل تنفيذ العملية" }).status(404);
  }
};

const BringObjectOnefromPost = async (req, res) => {
  try {
    const PostID = req.query.PostID;
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
    }
    const PostOne = await SELECTTablePostPublicOneObject(PostID);
    const Comment = await SELECTCOUNTCOMMENTANDLIKPOST(PostID, "Comment");
    const Likeuser = await SELECTTableLikesPostPublicotherroad(
      PostID,
      userSession.userName
    );
    const Likes = await SELECTCOUNTCOMMENTANDLIKPOST(PostID, "Likes");

    let data = {
      ...PostOne,
      Likeuser: Likeuser !== false && Likeuser !== undefined ? true : Likeuser,
      Comment: Comment["COUNT(userName)"],
      Likes: Likes["COUNT(userName)"],
    };
    res.send({ success: "تمت العملية بنجاح", data: data }).status(200);
  } catch (error) {
    console.log(error);
    res.send({ success: "فشل تنفيذ العملية" }).status(400);
  }
};

const BringDatabrachCompany = async (req, res) => {
  try {
    const userSession = req.session.user;
    if (!userSession) {
      res.status(401).send("Invalid session");
      console.log("Invalid session");
    }
    const result = await SELECTTablecompanySub(
      userSession.IDCompany,
      "id,NameSub AS name"
    );
    res.send({ success: "تمت العملية بنجاح", data: result });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  BringPost,
  BringCommentinsert,
  SearchPosts,
  BringObjectOnefromPost,
  BringDatabrachCompany,
};
