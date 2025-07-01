const express = require("express");
const app = express();
const http = require("http");
const  config  = require("./config.js");

const server = http.createServer(app);


// const io = require("socket.io")(server);

// const io = require("socket.io")(server);
const io = require("socket.io")(server);

app.set('trust proxy', 'loopback');
app.set('trust proxy', false);

module.exports = { express, app, http, server, io };
// d