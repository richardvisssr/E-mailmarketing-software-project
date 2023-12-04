const mongoose = require("mongoose");
const request = require("supertest");
const express = require("express");
const { app, server, httpServer } = require("../app");

const MailList = require("../model/mailList");

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
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  test("MailList get test", async () => {
    const response = await request(app).get("/mail/getList");

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
      .send({ name: newName });

    expect(response.status).toBe(200);
    expect(response.body.mailList).toContain(newName);
  });

  test("MailList add test 404", async () => {
    const newName = "NewList";
    await MailList.deleteMany({});

    const response = await request(app)
      .put("/mail/addList")
      .send({ name: newName });

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
      .send({ name: newName });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Internal server error");
  });

  test("MailList delete test 200", async () => {
    const listName = "CMD";
    const response = await request(app)
      .delete("/deleteList")
      .send({ name: listName });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "The list " + listName + " is deleted",
    });

    const updatedList = await MailList.findOne();
    expect(updatedList.mailList).not.toContain(listName);
  });

  test("MailList delete test 404", async () => {
    const response = await request(app)
      .delete("/deleteList")
      .send({ name: "nonexistent" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "List not found" });
  });

  test("MailList delete test 500", async () => {
    jest.spyOn(MailList, "findOne").mockImplementation(() => {
      throw new Error("Internal server error");
    });

    const response = await request(app)
      .delete("/deleteList")
      .send({ name: "any" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });
  });
});
