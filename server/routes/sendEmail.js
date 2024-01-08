const express = require("express");
const nodemailer = require("nodemailer");
const { PlannedEmail, Email } = require("../model/emailEditor");
const path = require("path");
const fs = require("fs");
const cheerio = require("cheerio");
const { sendWebsocketMessage } = require("../utils/websockets");

const router = express.Router();

router.post("/sendEmail", async (req, res) => {
  try {
    const { html, subscribers, subject, showHeader, headerText, id } = req.body;

    const imagePath = path.join(__dirname, "xtend-logo.webp");
    const imageAsBase64 = fs.readFileSync(imagePath, { encoding: "base64" });

    const $ = cheerio.load(html);
    const bodyBackground = $("body").css("background-color");
  
    function getReadableTextColor(bodyBackground) {
      // Convert hex color to RGB
      const rgbColor = hexToRgb(bodyBackground);
  
      switch (rgbColor) {
        case "rgb(255, 255, 255)": // White background
          return "#282828"; // Dark text
        case "rgb(0, 0, 0)": // Black background
          return "#ffffff"; // Light text
        default:
          // For other background colors, determine the contrast and choose text color accordingly
          const luminance = calculateLuminance(rgbColor);
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

    if (subscribers.length === 0) {
      res.status(400).json({ error: "No subscribers found" });
      return;
    }

    let transporter = nodemailer.createTransport({
      host: "145.74.104.216",
      port: 1025,
      secure: false,
      auth: {
        user: "your_email@gmail.com",
        pass: "your_email_password",
      },
    });

    let sentSubscribers = [];

    const analysisPageUrl = `http://localhost:3000/analyse/`;

    const personalizedHtmlText = html.replace(
      /href="([^"]*)"/g,
      function (match, originalUrl) {
        return `href="${analysisPageUrl}${encodeURIComponent(
          originalUrl
        )}/${id}/1"`;
      }
    );

    for (const subscriber of subscribers) {
      let personalizedHeaderText = headerText.replace(
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
        subject: `${subject}`,
        html: `
        <div style="text-align: center; padding: 10px; font-family: 'Arial', sans-serif; color: ${textColor}">
        ${showHeader ? ` ${personalizedHeaderText}` : ""}
        </div>
        <div style="padding: 20px; font-family: 'Arial', sans-serif; font-size: 16px; color: #333;">
        ${personalizedHtmlText}
      </div>
      <div style="background-color: #ffffff; font-family: 'Arial', sans-serif; text-align: center; padding: 10px; color: #000000">
        <p>
          Bekijk de online versie van deze e-mail
          <a href="http://localhost:3000/analyse/onlineEmail/${id}/${
          subscriber._id
        }" style="text-decoration: none; color: #007BFF;">
            hier
          </a>.
        </p>
        <a href="http://localhost:3000/unsubscribe/${id}/${
          subscriber._id
        }" style="text-decoration: none;">
          Uitschrijven
        </a>
      </div>
      
        `,
      };

      await transporter.sendMail(mailOptions);
      sentSubscribers.push(subscriber.email);
    }
    sendWebsocketMessage({ type: "sendEmail", templateId: id });
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error sending email" });
  }
});

router.get("/isMailSended/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const email = await Email.findOne({ id });

    if (email) {
      res.status(200).send("Mail has been sent");
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/planMail", async (req, res) => {
  try {
    const { mailId, id, title, html, subs, date, showHeader, headerText, subject } =
      req.body;
    const subscribers = subs.map((subscriberArray) => {
      const subscriber = subscriberArray[0];
      return {
        id: subscriber._id,
        name: subscriber.name,
        email: subscriber.email,
      };
    });

    const planMail = await PlannedEmail.findOne({ id });
    if (planMail) {
      planMail.mailId = mailId;
      planMail.id = id;
      planMail.title = title;
      planMail.html = html;
      planMail.subscribers = subscribers;
      planMail.date = date;
      planMail.subject = subject;
      planMail.headerText = headerText;
      await planMail.save();

      res.status(200).send("Mail planned successfully");
    } else {
      const newPlanMail = new PlannedEmail({
        mailId,
        id,
        title,
        html,
        subscribers,
        date,
        sent: false,
        showHeader,
        headerText,
        subject,
      });
      await newPlanMail.save();
      res.status(200).send("Mail planned successfully");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/plannedMails", async (req, res) => {
  try {
    const plannedMails = await PlannedEmail.find();
    res.status(200).json({ plannedMails });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/planMail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await PlannedEmail.findOneAndDelete({ id });
    res.status(200).send("Mail deleted successfully");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/updateMail", async (req, res) => {
  try {
    const { id, date } = req.body;

    const mail = await PlannedEmail.findOne({ id });
    if (mail) {
      mail.date = date;
      mail.mailId = id;
      mail.sent = false;
      await mail.save();
      res.status(200).send("Mail updated successfully");
    } else {
      res.status(404).send("Mail not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
