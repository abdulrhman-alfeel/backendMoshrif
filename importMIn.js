const express = require("express");
const app = express();
const http = require("http");
const  config  = require("./config.js");

const server = http.createServer(app);


// const io = require("socket.io")(server);

const io = require("socket.io")(server,
  {
    cors: {
    origin: config.corsOrigins,
    methods: ['GET', 'POST']
  }
});

// app.set('trust proxy', 'loopback');
app.set('trust proxy', false);

module.exports = { express, app, http, server, io };
