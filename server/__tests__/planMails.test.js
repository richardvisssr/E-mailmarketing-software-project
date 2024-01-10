const express = require("express");
const request = require("supertest");
const routes = require("../routes/sendEmail");
const mongoose = require("mongoose");

const { app, httpServer, server } = require("../app");
const { PlannedEmail } = require("../model/emailEditor");
app.use(express.json());
app.use("/", routes);

let token;

beforeAll(async () => {
  token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ3OTU4NjEsImV4cCI6MTcxMjU3MTg2MX0.XbetRe5V3cNlGcJbS3_yzV01lTFcUfCuGef6Ukt--q0";
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(`mongodb://localhost:27017/nyalaTest`);
  }
});

beforeEach(async () => {
  const plannedEmailData = {
    id: "testPlannedEmailId",
    title: "testTitle",
    mailId: "testMailId",
    sent: false,
    html: "<p>Your test HTML content here</p>",
    subscribers: [{ _id: "1234567", name: "test", email: "test@gmail.com" }],
    date: new Date(),
    sended: false,
    showHeader: true,
    subject: "testSubject",
    status: "In afwachting",
  };

  await PlannedEmail.create(plannedEmailData);
});

afterEach(async () => {
  await PlannedEmail.deleteOne({ id: "testPlannedEmailId" });
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  httpServer.close();
  server.close();
});

describe("PUT /planMail", () => {
  it("should respond with success message when planning a mail", async () => {
    const response = await request(app)
      .put("/planMail")
      .send({
        id: "testPlannedEmailId",
        title: "testTitle",
        mailId: "testMailId",
        sent: false,
        html: "<p>Test HTML content</p>",
        subs: [[{ _id: '1234567', name: 'test', email: 'test@gmail.com' }]],        date: new Date(),
        showHeader: true,
        headerText: "Test Header",
        subject: "testSubject",
      })
      .set("Authorization", `Bearer ${token}`);
    // console.log(response.error);
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Mail planned successfully");
  });

  it("should respond with success message when updating a planned mail", async () => {
    const response = await request(app)
      .put("/planMail")
      .send({
        id: "testPlannedEmailId",
        title: "testTitle",
        mailId: "testMailId",
        sent: false,
        html: "<p>Test HTML content</p>",
        subs: [[{ _id: '1234567', name: 'test', email: 'test@gmail.com' }]],        date: new Date(),
        sended: false,
        showHeader: true,
        subject: "testSubject",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Mail planned successfully");
  });

  it("should respond with success message when planning a new mail", async () => {
    const response = await request(app)
      .put("/planMail")
      .send({
        id: "testPlannedEmailId2",
        title: "testTitle",
        mailId: "testMailId",
        sent: false,
        html: "<p>Test HTML content</p>",
        subs: [[{ _id: '1234567', name: 'test', email: 'test@gmail.com' }]],        date: new Date(),
        showHeader: true,
        subject: "testSubject",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Mail planned successfully");
  });

  it("should respond with an error when an internal server error occurs", async () => {
    jest.spyOn(PlannedEmail, "findOne").mockImplementation(() => {
      throw new Error("Internal server error");
    });

    const response = await request(app)
      .put("/planMail")
      .send({
        id: "testPlannedEmailId",
        title: "testTitle",
        html: "<p>Test HTML content</p>",
        mailId: "testMailId",
        sent: false,
        subs: [[{ _id: '1234567', name: 'test', email: 'test@gmail.com' }]],        date: new Date(),
        showHeader: true,
        subject: "testSubject",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "Internal server error" });
  });
});

describe("GET /plannedMails", () => {
  it("should respond with an array of planned mails", async () => {
    const response = await request(app)
      .get("/plannedMails")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body.plannedMails).toEqual(expect.any(Array));
    expect(response.statusCode).toBe(200);
  });

  it("should respond with an error when an internal server error occurs", async () => {
    jest.spyOn(PlannedEmail, "find").mockImplementation(() => {
      throw new Error("Internal server error");
    });

    const response = await request(app)
      .get("/plannedMails")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "Internal server error" });
  });
});

describe("DELETE /planMail/:id", () => {
  it("should respond with success message when deleting a planned mail", async () => {
    const response = await request(app)
      .delete("/planMail/testMailId")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Mail deleted successfully");
  });

  it("should respond with an error when an internal server error occurs", async () => {
    jest.spyOn(PlannedEmail, "findOneAndDelete").mockImplementation(() => {
      throw new Error("Internal server error");
    });

    const response = await request(app)
      .delete("/planMail/testMailId")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "Internal server error" });
  });
});

describe("PUT /updateMail", () => {
  it("should respond with success message when updating a planned mail", async () => {
    jest.spyOn(PlannedEmail, "findOne").mockImplementation(() => {
      return { save: () => {} };
    });

    const response = await request(app)
      .put("/updateMail")
      .send({
        id: "testPlannedEmailId",
        date: new Date(),
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Mail updated successfully");
  });

  it("should respond with a 404 error when the planned mail is not found", async () => {
    jest.spyOn(PlannedEmail, "findOne").mockImplementation(() => {
      return null;
    });

    const response = await request(app)
      .put("/updateMail")
      .send({
        id: "testPlannedEmailId",
        date: new Date(),
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("Mail not found");
  });

  it("should respond with an error when an internal server error occurs", async () => {
    jest.spyOn(PlannedEmail, "findOne").mockImplementation(() => {
      throw new Error("Internal server error");
    });

    const response = await request(app)
      .put("/updateMail")
      .send({
        id: "testPlannedEmailId",
        date: new Date(),
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "Internal server error" });
  });
});
