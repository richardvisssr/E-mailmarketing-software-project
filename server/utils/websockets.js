const http = require("http");
const ws = require("ws");
const express = require("express");
const session = require("express-session");

const host = process.env.HOST || "127.0.0.1";
const port = 7002;
const app = express();
const sessionParser = session({
  saveUninitialized: false,
  secret: "$eCuRiTY",
  resave: false,
});

const httpServer = http.createServer(app);
const webSocketServer = new ws.Server({ noServer: true, path: "/socket" });

httpServer.on("upgrade", (req, networkSocket, head) => {
  sessionParser(req, {}, () => {
    webSocketServer.handleUpgrade(req, networkSocket, head, (newWebSocket) => {
      webSocketServer.emit("connection", newWebSocket, req);
    });
  });
});

httpServer.listen(port, () => {
  const currentPort = httpServer.address().port;
  console.log(`Listening on http://${host}:${currentPort}`);
});

function sendWebsocketMessage(message) {
  webSocketServer.clients.forEach((client) => {
    if (client.readyState === ws.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

module.exports = { sendWebsocketMessage, httpServer };