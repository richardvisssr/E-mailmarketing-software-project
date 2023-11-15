import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { body: html } = req.body; // change this line

    console.log('html:', html); 

    let transporter = nodemailer.createTransport({
      host: '145.74.104.216',
      port: 1025,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'your_email@gmail.com', // replace with your email
        pass: 'your_email_password' // replace with your password
      }
    });

    let mailOptions = {
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: 'bar@example.com, baz@example.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world?', // plain text body
      html: html // html body
    };

    transporter.sendMail(mailOptions)
      .then(info => {
        res.status(200).json({ success: true });
      })
      .catch(error => {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Error sending email' });
      });
  } else {
    res.status(405).json({ error: 'We only accept POST' });
  }
}