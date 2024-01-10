const request = require("supertest");
const express = require("express");
const nodemailer = require("nodemailer");
const { Subscriber } = require("../model/subscribers");
const mongoose = require("mongoose");

const router = require("../routes/sendEmail");
const app = express();
app.use(express.json());
app.use("/sendEmail", router);
let token;

describe("Email Router", () => {
  let testAccount;
  let transporter;
  let subscribers;

  beforeAll(async () => {
    token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ4ODY0OTYsImV4cCI6MTcxMjY2MjQ5Nn0.STjc2iZmL_VjLXI5UrPhyIvRSqHd5IxbUITB7oLzjSc";
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

  beforeEach(async () => {
    if (mongoose.connection.readyState === 0) {
      // If no existing connection, create a new one
      await mongoose.connect(`mongodb://127.0.0.1:27017/nyalaTest`);
    }
  });

  afterEach(async () => {
    await mongoose.disconnect();
  });

  afterAll(async () => {  
    await transporter.close();
  });

  test("should add 500 subscribers", async () => {
    // Create an array of promises for adding subscribers
    const subscriberPromises = Array.from({ length: 500 }, (_, index) => {
      const subscriber = new Subscriber({
        email: `subscriber${index + 1}@example.com`,
        name: `Subscriber ${index + 1}`,
        subscription: ["ICT", "CMD", "Leden"],
      });

      return subscriber.save();
    });

    // Wait for all promises to resolve
    subscribers = await Promise.all(subscriberPromises);

    // Check that 500 subscribers were added
    const count = await Subscriber.countDocuments({});
    expect(count).toBe(500);
  });

  xtest("should send email to subscribers", async () => {
    const htmlContent = "<p>This is the email content</p>";

    const response = await request(app)
      .post("/sendEmail/sendEmail")
      .send({ html: htmlContent, subscribers, id })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  }, 150000);

  test("should return 404 error for invalid route", async () => {
    const response = await request(app)
      .get("/sendEmail/invalidRoute")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  test("should return 500 error for internal server error", async () => {
    jest.spyOn(nodemailer, "createTransport").mockImplementation(() => {
      throw new Error("Internal Server Error");
    });

    const htmlContent = "<p>This is the email content</p>";

    const response = await request(app)
      .post("/sendEmail/sendEmail")
      .send({ html: htmlContent, subscribers })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(500);
  });
});
