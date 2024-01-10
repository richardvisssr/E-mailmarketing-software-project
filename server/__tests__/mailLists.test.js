const mongoose = require("mongoose");
const request = require("supertest");
const { app, httpServer, server } = require("../app");

const MailList = require("../model/mailList");
let token;

describe("Mail List API", () => {
  beforeAll(async () => {
    token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ4ODY0OTYsImV4cCI6MTcxMjY2MjQ5Nn0.STjc2iZmL_VjLXI5UrPhyIvRSqHd5IxbUITB7oLzjSc";
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
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    httpServer.close();
    server.close();
  });

  test("MailList get test", async () => {
    const response = await request(app)
      .get("/mail/getList")
      .set("Authorization", `Bearer ${token}`);

    const expectedResult = ["Nieuwsbrief", "CMD", "ICT", "Leden"];

    expect(response.status).toBe(200);
    expect(response.body[0].mailList).toEqual(
      expect.arrayContaining(expectedResult)
    );
  });

  test("response should be same as created list", async () => {
    const response = await request(app)
      .get("/mail/getList")
      .set("Authorization", `Bearer ${token}`);
    const expectedResult = ["Nieuwsbrief", "CMD", "ICT", "Leden"];

    expect(response.status).toBe(200);
    expect(response.body[0].mailList).toEqual(
      expect.arrayContaining(expectedResult)
    );
  });

  test("MailList add test 200", async () => {
    const newName = "NewList";
    const response = await request(app)
      .put("/mail/addList")
      .send({ name: newName })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.mailList).toContain(newName);
  });

  test("getList error 500", async () => {
    jest.spyOn(MailList, "find").mockImplementationOnce(() => {
      throw new Error("Simulated internal server error");
    });

    const response = await request(app)
      .get("/mail/getList")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal server error");
  });

  test("MailList add test 404", async () => {
    const newName = "NewList";
    await MailList.deleteMany({});

    const response = await request(app)
      .put("/mail/addList")
      .send({ name: newName })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("List not found");
  });

  test("MailList add test 500", async () => {
    jest.spyOn(MailList, "findOne").mockImplementationOnce(() => {
      throw new Error("Simulated internal server error");
    });

    const newName = "NewList";
    const response = await request(app)
      .put("/mail/addList")
      .send({ name: newName })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal server error");
  });

  test("Delete mailList", async () => {
    const response = await request(app)
      .delete("/mail/deleteList")
      .send({
        name: "ICT",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.mailList).not.toBe("ICT");
  });

  test("Delete mailList that doesnt exist", async () => {
    const response = await request(app)
      .delete("/mail/deleteList")
      .send({
        name: "Bestaat niet",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("List not found");
  });
});
