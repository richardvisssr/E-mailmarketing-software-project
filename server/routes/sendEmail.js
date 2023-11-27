const express = require("express");
const nodemailer = require("nodemailer");

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
        from: '"Xtend" <info@svxtend.nl>',
        to: subscriber.email,
        subject: `Hallo ${subscriber.name} - Xtend nieuwsbrief`,
        html: `
          <div style="background-color: #f1f1f1; text-align: center; padding: 10px;">
            <h1 style="color: #333; font-size: 24px;">Xtend</h1>
            <h2 style="color: #666; font-size: 20px;">Beste ${
              subscriber.name
            }, hierbij ontvang je onze nieuwsbrief</h2>
          </div>
          <div style="padding: 20px;">
            ${html}
          </div>
          <div style="background-color: #f1f1f1; text-align: center; padding: 10px;">
            <a style="text-decoration: none; color: #333;" href="http://localhost:3000/unsubscribe?email=${encodeURIComponent(
              subscriber.email
            )}">Uitschrijven</a>
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

module.exports = router;
