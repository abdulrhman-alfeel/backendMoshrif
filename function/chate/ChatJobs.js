const {
  insertTableChate,
  insertTableChateStage,
  insertTableViewsChateStage,
} = require("../../sql/INsertteble");
const {
  SELECTTableChateStageOtherroad,
  SELECTTableViewChateStage,
} = require("../../sql/selected/selected");
const { ClassChatOpration, ClassChatOprationView } = require("./ChatJobsClass");
const time = require("./TIME.JS");

let arra = [];
//   عمليات استقبال وارسال ومشاهدة شات المراحل


// عملية ارسال واستقبال لشات المراحل
const ChatOpration = async (Socket, io) => {
  ClassChatOpration(Socket, io)
};
// عملية مشاهدة لرسائل شات المراحل
const ChatOprationView = async (Socket, io) => {
  Socket.on("view_message", async (data) => {
   const result = await ClassChatOprationView(data);
  // io.to(data.ProjectID)
  // .timeout(100)
  // .emit("received_View_message", result)
});
};

// **************

module.exports = {
  ChatOpration,
  ChatOprationView,

};
