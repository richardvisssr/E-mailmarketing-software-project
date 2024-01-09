const nodemailer = require("nodemailer");
const http = require("http");
const ws = require("ws");
const express = require("express");
const session = require("express-session");
const cheerio = require("cheerio");
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
  const html = email.html;

  const $ = cheerio.load(html);
  const bodyBackground = $("body").css("background-color");

  function getReadableTextColor(bodyBackground) {
    // Convert hex color to RGB
    const rgbColor = () => {
      if (bodyBackground == "transparent") {
        return "rgb(255, 255, 255)";
      } else {
        return hexToRgb(bodyBackground);
      }
    };

    switch (rgbColor()) {
      case "rgb(255, 255, 255)": // White background
        return "#282828"; // Dark text
      case "rgb(0, 0, 0)": // Black background
        return "#ffffff"; // Light text
      default:
        // For other background colors, determine the contrast and choose text color accordingly
        const luminance = calculateLuminance(rgbColor());
        return luminance > 0.5 ? "#282828" : "#ffffff"; // Use dark text for light backgrounds, and light text for dark backgrounds
    }
  }

  function calculateLuminance(rgbColor) {
    // Convert RGB color to relative luminance using the formula for sRGB luminance
    const rgbArray = rgbColor.match(/\d+/g).map(Number);
    const [r, g, b] = rgbArray.map((value) => {
      value /= 255;
      return value <= 0.03928
        ? value / 12.92
        : Math.pow((value + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function hexToRgb(hexColor) {
    // Convert hex color to RGB
    const hex = hexColor.replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => {
        return "#" + r + r + g + g + b + b;
      }
    );

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
          result[3],
          16
        )})`
      : null;
  }

  const textColor = getReadableTextColor(bodyBackground);

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

  if (textColor) {
    try {
      for (const subscriber of email.subscribers) {
        let personalizedHeaderText = email.headerText.replace(
          "{name}",
          subscriber.name
        );

        const analysisPageUrl = `http://localhost:3000/analyse/`;

        const personalizedHtmlText = email.html.replace(
          /href="([^"]*)"/g,
          function (match, originalUrl) {
            return `href="${analysisPageUrl}${encodeURIComponent(
              originalUrl
            )}/${email.mailId}/1"`;
          }
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
          <div style="text-align: center; padding: 10px; font-family: 'Arial', sans-serif; color: ${textColor}">
          ${email.showHeader ? ` ${personalizedHeaderText}` : ""}
          </div>
          <div style="padding: 20px; font-family: 'Arial', sans-serif; font-size: 16px; color: ${textColor}">
          ${personalizedHtmlText}
        </div>
        <div style="background-color: #fff; font-family: 'Arial', sans-serif; text-align: center; padding: 10px; color: #000">
          <p>
            Bekijk de online versie van deze e-mail
            <a href="http://localhost:3000/analyse/onlineEmail/${
              email.mailId
            }/${subscriber.id}" style="text-decoration: none; color: #007BFF;">
              hier
            </a>.
          </p>
          <a href="http://localhost:3000/unsubscribe/${email.mailId}/${
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
      if (email.subscribers.length === 0) {
        email.status = "Mislukt";
        await email.save();
        sendWebsocketMessage({
          type: "update",
          message: "Failed to send email",
        });
        continue;
      }

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
