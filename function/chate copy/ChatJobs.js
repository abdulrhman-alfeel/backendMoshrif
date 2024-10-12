
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
});
};

// **************

module.exports = {
  ChatOpration,
  ChatOprationView,

};
