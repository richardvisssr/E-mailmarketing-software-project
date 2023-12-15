"use strict";

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const http = require("http");
const path = require("path");

const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3001;

// Hier komen de requires voor de routes
const subscriberRouter = require("./routes/subscribers");
const emailEditorRouter = require("./routes/emailEditor");
const mailListRouter = require("./routes/mailLists");
const sendMailRouter = require("./routes/sendEmail");
const adminpanelRouter = require("./routes/templateRoutes");
const unsubscribeAnalyticsRouters = require("./routes/unsubcsribeAnalytics");

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
app.use("/", subscriberRouter);
app.use("/", adminpanelRouter);
app.use("/mail", emailEditorRouter);
app.use("/mail", mailListRouter);
app.use("/", sendMailRouter);
app.use("/", unsubscribeAnalyticsRouters);

const httpServer = http.createServer(app);

app.use(express.static(path.join(__dirname, "client-side")));

const server = app.listen(port, host, async () => {
  console.log("> connecting");
  console.log("> connected");

  const serverInfo = server.address();
  const addressInfo = serverInfo.address;
  const portInfo = serverInfo.port;
  console.log(`Database started on http://${addressInfo}:${portInfo}`);
});

module.exports = { app, server, httpServer };
