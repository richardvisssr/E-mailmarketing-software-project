"use strict";
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const http = require("http");
const path = require("path");
const configFilePath = path.join(__dirname, "../config/config.json");
let debounceTimer;
let isRestarting = false;

const host = process.env.HOST || "127.0.0.1";
const port = 3001;

function restartServer() {
  if (isRestarting) {
    console.log("Server is already restarting. Skipping this attempt.");
    return;
  }

  isRestarting = true;

  server.close((error) => {
    isRestarting = false;

    if (error) {
      console.log(error);
      console.error("Error closing the server:", error);
    } else {
      console.log("Server closed successfully. Restarting...");

      setTimeout(() => {
        const newServer = app.listen(port, host, () => {
          console.log("> connecting");
          console.log("> connected");

          const serverInfo = newServer.address();
          const addressInfo = serverInfo.address;
          const portInfo = serverInfo.port;
          console.log(`Database started on http://${addressInfo}:${portInfo}`);
        });

        server = newServer;
      }, 1000);
    }
  });
}

fs.watch(configFilePath, () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    console.log(`Config file ${configFilePath} changed`);
    restartServer();
    debounceTimer = null;
  }, 1000);
});

// Hier komen de requires voor de utils
const verifyToken = require("./utils/verifyToken");

// Hier komen de requires voor de routes
const settingsRouter = require("./routes/settingsRoute");
const loginRouter = require("./routes/loginRouter");
const subscriberRouter = require("./routes/subscribers");
const emailEditorRouter = require("./routes/emailEditor");
const mailListRouter = require("./routes/mailLists");
const sendMailRouter = require("./routes/sendEmail");
const adminpanelRouter = require("./routes/templateRoutes");
const emailAnalyticsRouter = require("./routes/emailAnalytics");
const unsubscribeAnalyticsRouters = require("./routes/unsubcsribeAnalytics");

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

// Hier komen de app.use voor routes
app.use("/", loginRouter);
app.use("/", verifyToken);
app.use("/", settingsRouter);
app.use("/", subscriberRouter);
app.use("/", adminpanelRouter);
app.use("/mail", emailEditorRouter);
app.use("/mail", mailListRouter);
app.use("/", sendMailRouter);
app.use("/", emailAnalyticsRouter);
app.use("/", unsubscribeAnalyticsRouters);

const httpServer = http.createServer(app);

app.use(express.static(path.join(__dirname, "client-side")));

let server = app.listen(port, host, async () => {
  console.log("> connecting");
  console.log("> connected");

  const serverInfo = server.address();
  const addressInfo = serverInfo.address;
  const portInfo = serverInfo.port;
  console.log(`Database started on http://${addressInfo}:${portInfo}`);
});

module.exports = { app, server, httpServer };
