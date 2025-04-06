const express = require("express");
const app = express();
const http = require("http");
const  config  = require("./config.js");
const { createAdapter } = require("@socket.io/redis-adapter");
const { Redis } = require("ioredis");

const server = http.createServer(app);

// Create Redis clients for Socket.IO adapter
const pubClient = new Redis(config.redis);
const subClient = pubClient.duplicate();




// // Log Redis connection events
pubClient.on('error', (error) => {
  console.error('Socket.IO Redis pub client error:', error);
});

subClient.on('error', (error) => {
  console.error('Socket.IO Redis sub client error:', error);
});
// const io = require("socket.io")(server);

const io = require("socket.io")(server,{cors: {
    origin: config.corsOrigins,
    methods: ['GET', 'POST']
  },
  adapter: createAdapter(pubClient, subClient)});

app.set('trust proxy', 'loopback');
app.set('trust proxy', false);

module.exports = { express, app, http, server, io };
