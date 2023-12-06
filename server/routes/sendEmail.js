const express = require("express");
const nodemailer = require("nodemailer");
const { PlannedEmail } = require("../model/emailEditor");

const router = express.Router();

router.post("/sendEmail", async (req, res) => {
  try {
    const { html, subscribers, subject, showHeader, id } = req.body;

    let transporter = nodemailer.createTransport({
      host: "145.74.104.216",
      port: 1025,
      secure: false,
      auth: {
        user: "your_email@gmail.com",
        pass: "your_email_password",
      },
    });

    for (const subscriber of subscribers) {
      let mailOptions = {
        from: '"Xtend" <info@svxtend.nl>',
        to: subscriber.email,
        subject: `${subject}`,
        html: `
        <div style="text-align: center; padding: 10px; font-family: 'Arial', sans-serif;">
          <h1 style="color: #333; font-size: 24px;">Xtend</h1>
          ${
            showHeader
              ? `<h2 style="color: #666; font-size: 20px;">Beste ${subscriber.name}, hierbij een nieuwe bericht</h2>`
              : ""
          }
        </div>
        <div style="padding: 20px; font-family: 'Arial', sans-serif; font-size: 16px; color: #333;">
        ${html}
      </div>
      <div style="background-color: #f1f1f1; font-family: 'Arial', sans-serif; text-align: center; padding: 10px;">
        <p>
          Bekijk de online versie van deze e-mail
          <a href="http://localhost:3000/onlineEmail/${id}/${
          subscriber._id
        }" style="text-decoration: none; color: #007BFF;">
            hier
          </a>.
        </p>
        <a href="http://localhost:3000/unsubscribe/${
          subscriber._id
        }" style="text-decoration: none;">
          Uitschrijven
        </a>
      </div>
      
        `,
      };

      await transporter.sendMail(mailOptions);
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error sending email" });
  }
});

router.put("/planMail", async (req, res) => {
  try {
    const { id, title, html, subs, date, showHeader, subject } = req.body;
    const subscribers = subs.map((subscriber) => {
      return { id: subscriber._id, name: subscriber.name, email: subscriber.email };
    });
    const planMail = await PlannedEmail.findOne({ id });

    if (planMail) {
      planMail.id = id;
      planMail.title = title;
      planMail.html = html;
      planMail.subscribers = subscribers;
      planMail.date = date;
      planMail.subject = subject;
      await planMail.save();
      res.status(200).send("Mail planned successfully");
    } else {
      const newPlanMail = new PlannedEmail({
        id,
        title,
        html,
        subscribers,
        date,
        sended: false,
        showHeader,
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

router.put("/updateMail/", async (req, res) => {
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
