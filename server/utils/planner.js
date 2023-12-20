const nodemailer = require("nodemailer");
const { PlannedEmail } = require("../model/emailEditor");

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

  try {
    for (const subscriber of email.subscribers) {
      const analysisPageUrl = `http://localhost:3000/analyse/`;

      const personalizedHtmlText = email.html.replace(
        /href="([^"]*)"/g,
        function (match, originalUrl) {
          return `href="${analysisPageUrl}${encodeURIComponent(
            originalUrl
          )}/${email.mailId}/1"`;
        }
      );
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
        ${personalizedHtmlText}
      </div>
      <div style="background-color: #f1f1f1; font-family: 'Arial', sans-serif; text-align: center; padding: 10px;">
        <p>
          Bekijk de online versie van deze e-mail
          <a href="http://localhost:3000/analyse/onlineEmail/${email.mailId}/${
          subscriber.id
        }" style="text-decoration: none; color: #007BFF;">
            hier
          </a>.
        </p>
        <a href="http://localhost:3000/unsubscribe/${email.mailId}/${
          subscriber.id
        }" style="text-decoration: none; color: #333;">
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

// Function to check for events and send email if necessary
async function checkEvents() {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, -7) + "00.000+00:00";

  console.log("Checking for events at", formattedDate);

  const emails = await PlannedEmail.find({
    date: { $lte: formattedDate },
    sended: false,
  });
  if (emails.length === 0) {
    console.log("No events found");
    return;
  }

  try {
    for (const email of emails) {
      console.log(email);
      const success = await sendEmail(email);

      if (success) {
        email.sended = true;
        await email.save();
      }
    }
  } catch (error) {
    console.error("Error checking events:", error);
  }
}

// Run the checkEvents function every minute
setInterval(checkEvents, 60000);
