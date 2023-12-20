const nodemailer = require("nodemailer");
const http = require("http");
const ws = require("ws");
const express = require("express");
const session = require("express-session");
const { PlannedEmail } = require("../server/model/emailEditor");
const fs = require("fs");
const path = require("path");

let config = require("../config/config.json");
const host = process.env.HOST || "127.0.0.1";
const port = 8000;
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

// Function to send email
async function sendEmail(email) {
  const imagePath = path.join(__dirname, "xtend-logo.webp");
  const imageAsBase64 = fs.readFileSync(imagePath, { encoding: "base64" });

  const transporter = nodemailer.createTransport({
    host: "145.74.104.216",
    port: 1025,
    secure: false,
    auth: {
      user: "your_email@gmail.com",
      pass: "your_email_password",
    },
  });

  let sentSubscribers = [];

  try {
    for (const subscriber of email.subscribers) {
      let personalizedHeaderText = email.headerText.replace(
        "{name}",
        subscriber.name
      );

      personalizedHeaderText = personalizedHeaderText.replace(/\n/g, "<br>");

      personalizedHeaderText = personalizedHeaderText.replace(
        "{image}",
        `<img src="data:image/webp;base64,${imageAsBase64}" alt="Xtend Logo" style="width: 100px; height: auto;" />`
      );

      if (sentSubscribers.includes(subscriber.email)) {
        continue;
      }

      let mailOptions = {
        from: '"Xtend" <info@svxtend.nl>',
        to: subscriber.email,
        subject: `${email.subject}`,
        html: `
        <div style="text-align: center; padding: 10px; font-family: 'Arial', sans-serif;">
        ${email.showHeader ? ` ${personalizedHeaderText}` : ""}
        </div>
        <div style="padding: 20px; font-family: 'Arial', sans-serif; font-size: 16px; color: #333;">
        ${email.html}
      </div>
      <div style="background-color: #f1f1f1; font-family: 'Arial', sans-serif; text-align: center; padding: 10px;">
        <p>
          Bekijk de online versie van deze e-mail
          <a href="http://localhost:3000/onlineEmail/${email.id}/${
          subscriber.id
        }" style="text-decoration: none; color: #007BFF;">
            hier
          </a>.
        </p>
        <a href="http://localhost:3000/unsubscribe/${
          subscriber.id
        }" style="text-decoration: none;">
          Uitschrijven
        </a>
      </div>
      
        `,
      };

      await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Failed to send email:", error);
            reject(error);
          } else {
            console.log("Email sent:", info.response);
            resolve();
          }
        });
      });
    }

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

// Function to check for emails and send email if necessary
async function checkEmails() {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, -7) + "00.000+00:00";

  console.log("Checking for emails at", formattedDate);

  const emails = await PlannedEmail.find({
    date: { $lte: formattedDate },
    sent: false,
  });

  if (emails.length === 0) {
    console.log("No emails found");
    return;
  }

  try {
    for (const email of emails) {
      const success = await sendEmail(email);

      if (success) {
        email.status = "Verzonden";
        email.sent = true;
        await email.save();
        sendWebsocketMessage({ type: "update", message: "Email sent" });
      } else {
        email.status = "Mislukt";
        await email.save();
        sendWebsocketMessage({
          type: "update",
          message: "Failed to send email",
        });
      }
    }
  } catch (error) {
    console.error("Error checking emails:", error);
  }
}

// Function to reload configuration
function reloadConfig() {
  try {
    const configPath = "../config/config.json";
    const configFile = require.resolve(configPath);

    // Check if the file exists and is not empty
    if (fs.existsSync(configFile) && fs.statSync(configFile).size > 0) {
      delete require.cache[configFile];
      config = require(configPath);
      console.log("Config reloaded:", config);
      clearInterval(emailCheckInterval);
      startEmailCheckInterval();
    } else {
      console.error("Config file is empty or does not exist.");
    }
  } catch (error) {
    console.error("Error reloading config:", error);
  }
}

// Debounce function
function debounce(func, delay) {
  let timeoutId;
  return function () {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(func, delay);
  };
}

// Watch for changes to the config file with debounce
const debouncedReloadConfig = debounce(reloadConfig, 1000);

// Watch for changes to the config file
fs.watch("../config/config.json", (event, filename) => {
  if (event === "change") {
    console.log("Config file changed. Reloading...");
    debouncedReloadConfig();
  }
});

function startEmailCheckInterval() {
  emailCheckInterval = setInterval(
    checkEmails,
    JSON.parse(config.updateInterval)
  );
}

// Start the email check interval initially
let emailCheckInterval;
startEmailCheckInterval();
