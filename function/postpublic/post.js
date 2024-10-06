const { insertTablePostPublic } = require("../../sql/INsertteble");
const {
  SELECTTableIDcompanytoPost,
  SELECTTablePostPublic,
  SELECTCOUNTCOMMENTANDLIKPOST,
  SELECTTableLikesPostPublicotherroad,
  SELECTTableCommentPostPublic,
  SELECTTablePostPublicSearch,
  SELECTTablePostPublicOneObject,
} = require("../../sql/selected/selected");
const ffmpeg = require("../../middleware/ffmpeg");
const fs = require("fs");
const path = require("path");
const insertPostURL = async (items) => {
  try {
    if (Object.entries(items.File).length > 0) {
      if (items.File.type === "video/mp4") {
        const result = await SELECTTableIDcompanytoPost(items.ProjectID);
        const data = [
          items.Sender,
          items.File.name,
          items.File.type,
          items.message,
          `${new Date().toUTCString()}`,
          items.StageID,
          items.ProjectID,
          result.IDcompanySub,
          result.NumberCompany,
        ];
        await insertTablePostPublic(data);
      }
    }
  } catch (err) {
    console.log(err.message);
  }
};
// const Screenshot = async (fileName) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const file = bucket.file(fileName);
//       // console.log(fileName, "find");
//       const tempFilePath = path.join(__dirname, "../../upload/", fileName);
//       const filesImage = `image${String(fileName).replace("mp4", "png")}`;
//       const tempFilePathtimp = path.join(__dirname, "../../temp/", filesImage);
//       const timePosition = "00:00:00.100";
//       const filename = `temp/${filesImage}`;
//       const filePath = path.join(__dirname, "../../upload/", fileName);

//       const finds = checkFileExistsSync(fileName, filePath);

//       if (finds) {
//         await fFmpegFunction(filename, filePath, timePosition);
//         resolve(filesImage);
//       } else {
//         file.download({ destination: tempFilePath }, async (err) => {
//           await fFmpegFunction(filename, tempFilePath, timePosition);
//           resolve(filesImage);
//         });
//       }
//       const findsImage = checkFileExistsSync(
//         tempFilePathtimp,
//         tempFilePathtimp
//       );
//       if (findsImage) {
//         try {
//           bucket.upload(tempFilePathtimp);
//         } catch (error) {
//           console.log(error);
//         }
//       }
//     } catch (error) {
//       console.log(error);
//       reject(error);
//     }
//   });
// };

const BringPost = async (req, res) => {
  try {
    const id = req.query.CompanyID;
    const PostID = req.query.PostID;
    const user = req.query.user;
    const now = new Date();

    // Extract day, month, and year from the Date object
    const day = String(now.getUTCDate()).padStart(2, "0"); // Day of the month (01 to 31)
    const month = String(now.getUTCMonth() + 1).padStart(2, "0"); // Month (01 to 12)
    const year = String(now.getUTCFullYear()).slice(); // Last two digits of the year

    // Format the date as "DD-MM-YY"
    const formattedDate = `${year}-${month}-${day}`;
    // console.log(id, formattedDate, PostID);
    const result = await SELECTTablePostPublic(id, formattedDate, PostID);
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
      // console.log(Likeuser, "hhhhhh", element.PostID, user);
      let data = {
        ...element,
        Likeuser:
          Likeuser !== false && Likeuser !== undefined ? true : Likeuser,
        Comment: Comment["COUNT(userName)"],
        Likes: Likes["COUNT(userName)"],
      };
      arrayPosts.push(data);
    }

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

const SearchPosts = async (req, res) => {
  try {
    // console.log(req.query);
    const id = req.query.CompanyID;
    const DateStart = req.query.DateStart;
    const DateEnd = req.query.DateEnd;
    const type = req.query.type;
    const nameProject = req.query.nameProject;
    const userName = req.query.userName;
    const PostID = req.query.PostID;
    const user = req.query.user;

    const result = await SELECTTablePostPublicSearch(
      id,
      DateStart,
      DateEnd,
      type,
      nameProject,
      userName,
      parseInt(PostID)
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
    const Comment = await SELECTCOUNTCOMMENTANDLIKPOST(
      PostID,
      "Comment"
    );
    const Likeuser = await SELECTTableLikesPostPublicotherroad(
      PostID,
      userSession.userName
    );
    const Likes = await SELECTCOUNTCOMMENTANDLIKPOST(PostID, "Likes");

    let data = {
      ...PostOne,
      Likeuser:
        Likeuser !== false && Likeuser !== undefined ? true : Likeuser,
      Comment: Comment["COUNT(userName)"],
      Likes: Likes["COUNT(userName)"],
    };
    res.send({ success: "تمت العملية بنجاح", data: data }).status(200);
  } catch (error) {
    console.log(error);
    res.send({ success: "فشل تنفيذ العملية" }).status(400);
  }
};

module.exports = {
  insertPostURL,
  BringPost,
  BringCommentinsert,
  SearchPosts,
  BringObjectOnefromPost,
};
