const { firebase } = require("../firebase/indexfirebase");

let notificationPayload = {
  roomId: 1,
  roomName: "التاكسيات",
  receiverIds: "عبدالرحمن",
  type: "رسائل",
};
async function massges() {
  let res = await firebase.messaging().sendEachForMulticast({
    tokens: [
      "f7Gec17DToOaMIyCBtmesD:APA91bHtxvaQon3XV-XTD4PDefcVv_WTaS7Wf7hcbDIzvlPwD8JR38PpDoF2Q0OIGTZgwqk7-Vdj251jWQVeriEQTcIMQIanOgatdfxzc98TRxyvg6j1L6oaB6Rl7bGVK22iHoYp701O",
      "erY2AX73RQ2J-c98yp0gia:APA91bHbrE9Z7KTAPMYbtS7ZWIBFnZNP7k8RYxmSECQeqEoLRV4cwwCUbHetd6ySOpu0aOToqC-CyRxikLMVV7F8C5S3wSdcnD3rKmsE7VEj_HW3FntDkmv3gQOZsiGKeL3t8_KefmXy",
      // // Add more tokens here...
      // "token3:APA91bGPx...",
      // "token4:APA91bGPx...",
    ],
        notification: {
      title: "start day",
      body: "hi abood",
    },
    data: {
      notification_type: "chat",
      navigationId: "messages",
      data: JSON.stringify(notificationPayload),
    },
  });
  console.log(res)
}
module.exports = {massges}


let res = await firebase.messaging().sendEachForMulticast({
  tokens: tokens,
  notification: {
    ...notification,
    android: {
      ...notification.android,
      image: 'https://storage.googleapis.com/demo_backendmoshrif_bucket-2/Vector.png',
    },
    apns: {
      ...notification.apns,
      payload: {
        aps: {
          'mutable-content': 1,
          // Include other APS settings if needed
        },
        image: 'https://storage.googleapis.com/demo_backendmoshrif_bucket-2/Vector.png',
      },
    },
  },
  data: {
    notification_type: notification_type,
    navigationId: navigationId,
    data: JSON.stringify(data),
  },
});