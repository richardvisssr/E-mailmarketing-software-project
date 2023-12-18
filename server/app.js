"use strict";

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const http = require("http");
const ws = require("ws");
const path = require("path");
const jwt = require("jsonwebtoken");
const secretKey = "eyJzdWIiOiJ1c2VyMTIzNDUiLCJpYXQiOjE3MDI4ODczNjAsImV4cCI6MT";

const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3001;

function verifyToken(req, res, next) {
  console.log(req.body);
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    res.status(401).send({ message: "Unauthorized: token missing" });
    return;
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      res.status(401).send({ message: "Unauthorized: invalid token" });
      return;
    }

    req.userId = decoded.sub;
    next();
  });
}

// Hier komen de requires voor de routes
const loginRouter = require("./routes/loginRouter");
const subscriberRouter = require("./routes/subscribers");
const emailEditorRouter = require("./routes/emailEditor");
const mailListRouter = require("./routes/mailLists");
const sendMailRouter = require("./routes/sendEmail");
const adminpanelRouter = require('./routes/templateRoutes');
const afbeeldingRouter = require('./routes/afbeeldingRouter');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.options("*", cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json());
const sessionParser = session({
  saveUninitialized: false,
  secret: "$eCuRiTy",
  resave: false,
  cookie: { secure: false, maxAge: 86400000, httpOnly: true },
  credentials: true,
});
app.use(sessionParser);
app.use(express.json());

app.use("/", (req, res, next) => {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});
// Hier komen de app.use voor routes
app.use("/", loginRouter);
app.use("/", verifyToken);
app.use("/", subscriberRouter);
app.use('/', adminpanelRouter);
app.use("/mail", emailEditorRouter);
app.use("/mail", mailListRouter);
app.use("/", sendMailRouter);
app.use("/afbeelding", afbeeldingRouter);

const httpServer = http.createServer(app);
const webSocketServer = new ws.Server({ noServer: true, path: "/socket" });

webSocketServer.on("connection", (socket, req) => {
  socket.on("message", (message) => {
    console.log("WebSocket message received:", message);
  });

  socket.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

httpServer.on("upgrade", (req, networkSocket, head) => {
  sessionParser(req, {}, () => {
    webSocketServer.handleUpgrade(req, networkSocket, head, (newWebSocket) => {
      webSocketServer.emit("connection", newWebSocket, req);
    });
  });
});

httpServer.listen(() => {
  const port = httpServer.address().port;
  console.log(`Listening on http://${host}:${port}`);
});

const server = app.listen(port, host, async () => {
  console.log("> connecting");
  console.log("> connected");

  const serverInfo = server.address();
  const addressInfo = serverInfo.address;
  const portInfo = serverInfo.port;
  console.log(`Database started on http://${addressInfo}:${portInfo}`);
});

module.exports = {app, server, httpServer, webSocketServer};
