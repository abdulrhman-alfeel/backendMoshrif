import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import socket from "../utils/socket";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSendImage = () => {
    const formData = new FormData();
    formData.append("image", image);

    socket.emit("send-image", formData, (response) => {
      // console.log("Image sent response:", response);
    });
  };

  return (
    <View>
      <TouchableOpacity onPress={() => fileInputRef.current.click()}>
        <Text>Select Image</Text>
      </TouchableOpacity>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
      <TouchableOpacity onPress={handleSendImage}>
        <Text>Send Image</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ImageUpload;




const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  // console.log("⚡: A user connected");

  socket.on("send-image", (image, callback) => {
    // Handle the image file here
    // console.log("Received image:", image);
         writeFile("/tmp/upload", image, (err) => {
            callback({ message: err? "failure" : "success" });
          });
    // Save the image to a file or process it as needed

    // Send a response back to the client
    callback({ message: "Image received successfully" });
  });

  socket.on("disconnect", () => {
    // console.log("🔥: A user disconnected");
  });
});

http.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});


// er-side (Node.js)

// js

// Open In Editor
// Edit
// Copy code
// import { writeFile } from "fs";
// import { Server } from "socket.io";

// const io = new Server({ maxHttpBufferSize: 1e8 }); // increase maxHttpBufferSize to 100MB

// io.on("connection", (socket) => {
//   socket.on("upload", (file, callback) => {
//     console.log(file); // <Buffer 25 50 44...>
//     // save the content to the disk, for example
//     writeFile("/tmp/upload", file, (err) => {
//       callback({ message: err? "failure" : "success" });
//     });
//   });
// });



// import { Image } from 'react-native-compressor';

// const result = await Image.compress('file://path_of_file/image.jpg', {
//   compressionMethod: 'manual',
//   maxWidth: 1000,
//   quality: 0.8,
// });
// Video
// Automatic Video Compression Like Whatsapp
// import { Video } from 'react-native-compressor';

// const result = await Video.compress(
//   'file://path_of_file/BigBuckBunny.mp4',
//   {},
//   (progress) => {
//     console.log('Compression Progress: ', progress);
//   }
// );

//OR

// const result = await Video.compress(
//   'https://example.com/video.mp4',
//   {
//     progressDivider: 10,
//     downloadProgress: (progress) => {
//       console.log('downloadProgress: ', progress);
//     },
//   },
//   (progress) => {
//     console.log('Compression Progress: ', progress);
//   }
// );