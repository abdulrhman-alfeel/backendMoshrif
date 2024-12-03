const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

app.set('trust proxy', 'loopback');
app.set('trust proxy', false);

module.exports = { express, app, http, server, io };
