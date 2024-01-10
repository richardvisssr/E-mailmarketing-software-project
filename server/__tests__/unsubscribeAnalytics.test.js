const request = require("supertest");
const mongoose = require("mongoose");
const { app, httpServer, server } = require("../app");

const { Unsubscriber, Category } = require("../model/subscribers");
const { response } = require("express");
let token;

describe("Unsubscribe Analytics", () => {
  beforeAll(async () => {
    token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ4ODY0OTYsImV4cCI6MTcxMjY2MjQ5Nn0.STjc2iZmL_VjLXI5UrPhyIvRSqHd5IxbUITB7oLzjSc";
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect("mongodb:127.0.0.1:27017/nyalaTest", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });

  beforeEach(async () => {
    await Unsubscriber.create(
      {
        reason: "Te veel mail",
        count: "5",
      },
      {
        reason: "Geen interesse",
        count: "3",
      },
      {
        reason: "Spam",
        count: "2",
      }
    );

    await Category.create(
      {
        name: "ICT",
        count: "5",
      },
      {
        name: "CMD",
        count: "3",
      },
      {
        name: "Leden",
        count: "2",
      }
    );
  });

  afterEach(async () => {
    await Unsubscriber.deleteMany({});
    await Category.deleteMany({});
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    httpServer.close();
    server.close();
  });

  describe("GET /unsubscribe/count", () => {
    it("should return an array with the correct objects", async () => {
      const mockCategories = [
        { name: "ICT", count: 5 },
        { name: "CMD", count: 3 },
        { name: "Leden", count: 2 },
      ];

      Category.find = jest.fn().mockResolvedValue(mockCategories);

      const response = await request(app)
        .get("/unsubscribe/count")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).toEqual(mockCategories);
    });

    it("should return 500 status code and error message on server error", async () => {
      Category.find = jest
        .fn()
        .mockRejectedValue(new Error("Internal server error"));

      const response = await request(app)
        .get("/unsubscribe/count")
        .set("Authorization", `Bearer ${token}`)
        .expect(500);

      expect(response.body).toEqual({ message: "Internal server error" });
    }, 10000);
  });

  describe("GET /unsubscribeReasons", () => {
    it("should return an array with the correct objects", async () => {
      const response = await request(app)
        .get("/unsubscribeReasons")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).toEqual([
        { reason: "Te veel mail", count: 5 },
        { reason: "Geen interesse", count: 3 },
        { reason: "Spam", count: 2 },
      ]);
    }, 10000);
  });

  describe("PUT /unsubscribe/lists", () => {
    it("should update the lists", async () => {
      const response = await request(app)
        .put("/unsubscribe/lists")
        .set("Authorization", `Bearer ${token}`)
        .send({
          subscriptions: ["ICT", "CMD", "Leden"],
        })
        .expect(200);

      expect(response.body).toEqual({
        message: "Unsubscribebs updated",
      });
    });

    it("should return 500 status code and error message on server error", async () => {
      Category.find = jest
        .fn()
        .mockRejectedValue(new Error("Internal server error"));

      const response = await request(app)
        .get("/unsubscribe/count")
        .set("Authorization", `Bearer ${token}`)
        .expect(500);

      expect(response.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("PUT /reason", () => {
    it("should update the reason", async () => {
      const response = await request(app)
        .put("/reason")
        .set("Authorization", `Bearer ${token}`)
        .send({
          reden: "Te veel mail",
        })
        .expect(200);

      expect(response.body).toEqual({
        message: "Reason added",
      });
    });

    it("should return 500 status code and error message on server error", async () => {
      Category.find = jest
        .fn()
        .mockRejectedValue(new Error("Internal server error"));

      const response = await request(app)
        .get("/unsubscribe/count")
        .set("Authorization", `Bearer ${token}`)
        .expect(500);

      expect(response.body).toEqual({ message: "Internal server error" });
    });
  });
});
