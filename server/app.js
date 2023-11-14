"use strict";

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const http = require("http");
const ws = require("ws");
const path = require("path");

const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3001;

// Hier komen de requires voor de routes

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.options("*", cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
const sessionParser = session({
  saveUninitialized: false,
  secret: "$eCuRiTy",
  resave: false,
});
app.use(sessionParser);
app.use(express.json());

// Hier komen de app.use voor routes

const httpServer = http.createServer(app);
const webSocketServer = new ws.Server({ noServer: true, path: "/socket" });

httpServer.on("upgrade", (req, networkSocket, head) => {
  sessionParser(req, {}, () => {
    webSocketServer.handleUpgrade(req, networkSocket, head, (newWebSocket) => {
      webSocketServer.emit("connection", newWebSocket, req);
    });
  });
});

app.use(express.static(path.join(__dirname, "client-side")));

webSocketServer.on("connection", (socket, req) => {
  console.log("WebSocket connection established");

  socket.on("message", (message) => {
    try {
      console.log("Buurman & Buurman are in the house!");
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  });

  socket.on("error", (error) => {
    console.error("There was an error: " + error);
  });
});

httpServer.listen(port, () =>
  console.log(`Listening on http://${host}:${port}`)
);

const server = app.listen(port, host, async () => {
  console.log("> connecting");
  await mongoose.connect(`mongodb://${host}:27017/nyala`);
  console.log("> connected");

  const serverInfo = server.address();
  const addressInfo = serverInfo.address;
  const portInfo = serverInfo.port;
  console.log(`Database started on http://${addressInfo}:${portInfo}`);
});
