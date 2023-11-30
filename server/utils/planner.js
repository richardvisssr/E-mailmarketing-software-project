const nodemailer = require("nodemailer");
const { PlannedEmail } = require("../model/emailEditor");

// Function to send email
function sendEmail(event) {
  const transporter = nodemailer.createTransport({
    host: "145.74.104.216",
    port: 1025,
    secure: false,
    auth: {
      user: "your_email@gmail.com",
      pass: "your_email_password",
    },
  });

  event.subscribers.forEach((subscriber) => {
    const mailOptions = {
      from: "xtend@svxtend.nl",
      to: subscriber.email,
      subject: event.title,
      html: `${event.html}
        </div>
          <div style="background-color: #f1f1f1; text-align: center; padding: 10px;">
            <a style="text-decoration: none; color: #333;" href="http://localhost:3000/unsubscribe?email=${encodeURIComponent(
              subscriber.email
            )}">Uitschrijven</a>
          </div>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Failed to send email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  });
}

// Function to check for events and send email if necessary
async function checkEvents() {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, -7) + "00.000+00:00";

  console.log("Checking for events at", formattedDate);

  const events = await PlannedEmail.find({ date: formattedDate });

  if (events.length === 0) {
    console.log("No events found");
    return;
  }

  try {
    for (const event of events) {
      sendEmail(event);
    }
  } catch (error) {
    console.error("Error checking events:", error);
  }
}

// Run the checkEvents function every minute
setInterval(checkEvents, 60000);
