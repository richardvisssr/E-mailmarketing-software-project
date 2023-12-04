const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/sendEmail", async (req, res) => {
  try {
    const { html, subscribers, id } = req.body;
 
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
        <div style="padding: 20px; font-family: 'Arial', sans-serif; font-size: 16px; color: #333;">
        ${html}
      </div>
      <div style="background-color: #f1f1f1; text-align: center; padding: 10px;">
        <p>
          Bekijk de online versie van deze e-mail
          <a href="http://localhost:3000/onlineEmail/${id}/${subscriber._id
        }" style="text-decoration: none; color: #007BFF;">
            hier
          </a>.
        </p>
        <a href="http://localhost:3000/unsubscribe/${subscriber._id
        }" style="text-decoration: none; color: #333;">
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

module.exports = router;
