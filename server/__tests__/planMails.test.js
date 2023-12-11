const express = require("express");
const request = require("supertest");
const routes = require("../routes/sendEmail");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use("/", routes);

const PlannedEmail = mongoose.model("PlannedEmail");

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(`mongodb://localhost:27017/nyala`);
  }
});

beforeEach(async () => {
  const plannedEmailData = {
    id: "testPlannedEmailId",
    title: "testTitle",
    html: "<p>Your test HTML content here</p>",
    subscribers: [{ id: "1234567", name: "test", email: "test@gmail.com" }],
    date: new Date(),
    sended: false,
    showHeader: true,
    subject: "testSubject",
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
});

describe("PUT /planMail", () => {
  it("should respond with success message when planning a mail", async () => {
    const response = await request(app)
      .put("/planMail")
      .send({
        id: "testPlannedEmailId",
        title: "testTitle",
        html: "<p>Test HTML content</p>",
        subs: [
          { _id: "1234567", name: "test1", email: "test1@gmail.com" },
          { _id: "7654321", name: "test2", email: "test2@gmail.com" },
        ],
        date: new Date(),
        showHeader: true,
        subject: "testSubject",
      });

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Mail planned successfully");
  });

  it("should respond with success message when updating a planned mail", async () => {
    const response = await request(app)
      .put("/planMail")
      .send({
        id: "testPlannedEmailId",
        title: "testTitle",
        html: "<p>Test HTML content</p>",
        subs: [{ _id: "1234567", name: "test1", email: "test@gmail.com" }],
        date: new Date(),
        sended: false,
        showHeader: true,
        subject: "testSubject",
      });

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Mail planned successfully");
  });

  it("should respond with success message when planning a new mail", async () => {
    const response = await request(app)
      .put("/planMail")
      .send({
        id: "testPlannedEmailId2",
        title: "testTitle",
        html: "<p>Test HTML content</p>",
        subs: [{ _id: "1234568", name: "test1", email: "jan@gmail.com" }],
        date: new Date(),
        showHeader: true,
        subject: "testSubject",
      });

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
        subs: [
          { _id: "1234567", name: "test1", email: "test1@gmail.com" },
          { _id: "7654321", name: "test2", email: "test2@gmail.com" },
        ],
        date: new Date(),
        showHeader: true,
        subject: "testSubject",
      });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "Internal server error" });
  });
});

describe("GET /plannedMails", () => {
  it("should respond with an array of planned mails", async () => {
    const response = await request(app).get("/plannedMails");
    expect(response.body.plannedMails).toEqual(expect.any(Array));
    expect(response.statusCode).toBe(200);
  });

  it("should respond with an error when an internal server error occurs", async () => {
    jest.spyOn(PlannedEmail, "find").mockImplementation(() => {
      throw new Error("Internal server error");
    });

    const response = await request(app).get("/plannedMails");
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "Internal server error" });
  });
});

describe("DELETE /planMail/:id", () => {
  it("should respond with success message when deleting a planned mail", async () => {
    const response = await request(app).delete("/planMail/testMailId");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Mail deleted successfully");
  });

  it("should respond with an error when an internal server error occurs", async () => {
    jest.spyOn(PlannedEmail, "findOneAndDelete").mockImplementation(() => {
      throw new Error("Internal server error");
    });

    const response = await request(app).delete("/planMail/testMailId");
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "Internal server error" });
  });
});

describe("PUT /updateMail", () => {
  it("should respond with success message when updating a planned mail", async () => {
    jest.spyOn(PlannedEmail, "findOne").mockImplementation(() => {
      return { save: () => {} };
    });

    const response = await request(app).put("/updateMail").send({
      id: "testPlannedEmailId",
      date: new Date(),
    });

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Mail updated successfully");
  });

  it("should respond with a 404 error when the planned mail is not found", async () => {
    jest.spyOn(PlannedEmail, "findOne").mockImplementation(() => {
      return null;
    });

    const response = await request(app).put("/updateMail").send({
      id: "testPlannedEmailId",
      date: new Date(),
    });

    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("Mail not found");
  });

  it("should respond with an error when an internal server error occurs", async () => {
    jest.spyOn(PlannedEmail, "findOne").mockImplementation(() => {
      throw new Error("Internal server error");
    });

    const response = await request(app).put("/updateMail").send({
      id: "testPlannedEmailId",
      date: new Date(),
    });

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "Internal server error" });
  });
});