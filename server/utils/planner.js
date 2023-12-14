const nodemailer = require("nodemailer");
const http = require("http");
const ws = require("ws");
const express = require("express");
const session = require("express-session");
const { PlannedEmail } = require("../model/emailEditor");

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
  const transporter = nodemailer.createTransport({
    host: "145.74.104.216",
    port: 1025,
    secure: false,
    auth: {
      user: "your_email@gmail.com",
      pass: "your_email_password",
    },
  });

  if (email.subscribers.length === 0) {
    console.log("No subscribers found");
    return false;
  }

  try {
    const results = [];

    for (const subscriber of email.subscribers) {
      const mailOptions = {
        from: "xtend@svxtend.nl",
        to: subscriber.email,
        subject: email.subject,
        html: `
        <div style="text-align: center; padding: 10px; font-family: 'Arial', sans-serif;">
          <h1 style="color: #333; font-size: 24px;">Xtend</h1>
          ${
            email.showHeader
              ? `<h2 style="color: #666; font-size: 20px;">Beste ${subscriber.name}, hierbij een nieuwe bericht</h2>`
              : ""
          }
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
        }" style="text-decoration: none; color: #333;">
          Uitschrijven
        </a>
      </div>
      
        `,
      };

      const sendEmailPromise = await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Failed to send email:", error);
            reject(error);
          } else {
            console.log("Email sent:", info.response);
            resolve(info.response);
          }
        });
      });

      results.push(sendEmailPromise);
    }

    const responses = await Promise.all(results);

    return responses.every(response => !!response);
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
        sendWebsocketMessage({ type: "update", message: "Failed to send email" });
      }
    }
  } catch (error) {
    console.error("Error checking emails:", error);
  }
}

// Run the checkEmails function every minute
setInterval(checkEmails, 60000);
