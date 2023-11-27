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
                        <a href="http://localhost:3000/unsubscribe?email=${encodeURIComponent(
                          subscriber.email
                        )}">Uitschrijven</a>
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

module.exports = router;
