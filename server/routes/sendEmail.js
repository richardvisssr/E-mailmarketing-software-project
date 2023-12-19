const express = require("express");
const nodemailer = require("nodemailer");
const { PlannedEmail, Email } = require("../model/emailEditor");
const path = require("path");
const fs = require("fs");
const { sendWebsocketMessage } = require("../utils/websockets");

const router = express.Router();

router.post("/sendEmail", async (req, res) => {
  try {
    const { html, subscribers, subject, showHeader, headerText, id } = req.body;

    const imagePath = path.join(__dirname, "xtend-logo.webp");
    const imageAsBase64 = fs.readFileSync(imagePath, { encoding: "base64" });

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
        <div style="text-align: center; padding: 10px; font-family: 'Arial', sans-serif;">
        ${showHeader ? ` ${personalizedHeaderText}` : ""}
        </div>
        <div style=" padding: 20px; font-family: 'Arial', sans-serif; font-size: 16px; color: #333;">
        ${html}
      </div>
      <div style="background-color: #f1f1f1; font-family: 'Arial', sans-serif; text-align: center; padding: 10px;">
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
    const {
      mailId,
      id,
      title,
      html,
      subs,
      date,
      showHeader,
      headerText,
      subject,
    } = req.body;
    const subscribers = subs.map((subscriber) => {
      return {
        id: subscriber._id,
        name: subscriber.name,
        email: subscriber.email,
      };
    });

    console.log(subscribers);
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
      await mail.save();
      res.status(200).send("Mail updated successfully");
    } else {
      res.status(404).send("Mail not found");
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
