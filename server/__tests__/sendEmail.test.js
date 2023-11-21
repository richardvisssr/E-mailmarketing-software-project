const request = require("supertest");
const express = require("express");
const nodemailer = require("nodemailer");

const router = require("../routes/sendEmail");
const app = express();
app.use(express.json());
app.use("/sendEmail", router);

describe("Email Router", () => {
  let testAccount;
  let transporter;

  beforeAll(async () => {
    testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  });

  test("should send email to subscribers", async () => {
    const subscribers = [
      { email: "subscriber1@example.com" },
      { email: "subscriber2@example.com" },
    ];

    const htmlContent = "<p>This is the email content</p>";

    const response = await request(app)
      .post("/sendEmail/sendEmail")
      .send({ html: htmlContent, subscribers });

    expect(response.status).toBe(200);

  });

  test("should return 404 error for invalid route", async () => {
    const response = await request(app).get("/sendEmail/invalidRoute");

    expect(response.status).toBe(404);

  });

  test("should return 500 error for internal server error", async () => {

    jest.spyOn(nodemailer, 'createTransport').mockImplementation(() => {
      throw new Error('Internal Server Error');
    });

    const subscribers = [
      { email: "subscriber1@example.com" },
      { email: "subscriber2@example.com" },
    ];

    const htmlContent = "<p>This is the email content</p>";

    const response = await request(app)
      .post("/sendEmail/sendEmail")
      .send({ html: htmlContent, subscribers });

    expect(response.status).toBe(500);

  });
});
