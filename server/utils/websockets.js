const express = require("express");
const http = require("http");
const ws = require("ws");
const session = require("express-session");

const app = express();
const host = process.env.HOST || "127.0.0.1";
const port = 7002;

app.use(express.json());
const sessionParser = session({
  saveUninitialized: false,
  secret: "$eCuRiTy",
  resave: false,
});
app.use(sessionParser);

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

module.exports = { sendWebsocketMessage, app, httpServer };
