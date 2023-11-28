const express = require("express");
const nodemailer = require("nodemailer");
const { Design, Email, PlannedEmail } = require("../model/emailEditor");

const router = express.Router();

router.post("/sendEmail", async (req, res) => {
  try {
    const { html, subscribers } = req.body;

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
        from: '"Fred Foo 👻" <foo@example.com>',
        to: subscriber.email,
        subject: "Hello ✔",
        html: `
                    <html>
                    <body>
                        <main>
                            ${html}
                        </main>
                        <footer style="background-color: #f1f1f1; text-align: center; padding: 10px;">
                            <a href="http://localhost:3000/unsubscribe">Uitschrijven</a>
                        </footer>
                    </body>
                    </html>
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
    const { id, html, subs, date } = req.body;
    const subscribers = subs.map((subscriber) => {
      return { name: subscriber.name, email: subscriber.email };
    });
    const planMail = await PlannedEmail.findOne({ id });
    console.log(subscribers);

    if (planMail) {
      planMail.id = id;
      planMail.html = html;
      planMail.subscribers = subscribers;
      planMail.date = date;
      await planMail.save();
      res.status(200).send("Mail planned successfully");
    } else {
      const newPlanMail = new PlannedEmail({ id, html, subscribers, date });
      await newPlanMail.save();
      res.status(200).send("Mail planned successfully");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
