const mongoose = require("mongoose");
const request = require("supertest");
const { app, server, httpServer} = require("../app");

const MailList = require("../model/mailingList");

describe("Mail List API", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect("mongodb://127.0.0.1:27017/nyalaTest", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });

  beforeEach(async () => {
    await MailList.create({
      mailList: ["Nieuwsbrief", "CMD", "ICT", "Leden"],
    });
  });

  afterEach(async () => {
    await MailList.deleteMany({});
  });

  afterAll(async () => {
    server.close();
    httpServer.close();
    await mongoose.disconnect();
  });

  test("MailList get test", async () => {
    const response = await request(app).get("/mail/getList");

    const expectedResult = ["Nieuwsbrief", "CMD", "ICT", "Leden"];

    expect(response.status).toBe(200);
    expect(response.body[0].mailList).toEqual(
      expect.arrayContaining(expectedResult)
    );
  });

  test("MailList add test", async () => {
    const newName = "NewList";
    const response = await request(app)
      .put("/mail/addList")
      .send({ name: newName });

    expect(response.status).toBe(200);
    expect(response.body.mailList).toContain(newName);
  });
});
