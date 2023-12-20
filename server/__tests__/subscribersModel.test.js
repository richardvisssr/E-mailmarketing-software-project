"use strict";

const mongoose = require("mongoose");
const { Subscriber } = require("../model/subscribers");
const { httpServer, server } = require("../app");

describe("Subscriber Model Tests", () => {
  let testMail = "test@example.com";
  let testName = "testName";

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect("mongodb://127.0.0.1:27017/nyalaTest", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });

  beforeEach(async () => {
    await Subscriber.create({
      email: testMail,
      name: testName,
      subscription: ["CMD"],
    });
  });

  afterEach(async () => {
    await Subscriber.deleteMany({});
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    httpServer.close();
    server.close();
  });

  test("abonnement can be added", async () => {
    let testSubscriber = await Subscriber.findOne({
      email: testMail,
    });
    const abonnementToAdd = "ICT";
    await testSubscriber.updateOne({
      $addToSet: { subscription: abonnementToAdd },
    });
    const resultSubscriber = await Subscriber.findOne({
      email: testMail,
    });
    const expectedAbonnement = ["CMD", abonnementToAdd];
    expect(resultSubscriber.subscription).toEqual(expectedAbonnement);
  });

  test("abonnement can be removed", async () => {
    let testSubscriber = await Subscriber.findOne({
      email: testMail,
    });
    const abonnementToRemove = "CMD";
    await testSubscriber.updateOne({
      $pull: { subscription: abonnementToRemove },
    });

    const resultSubscriber = await Subscriber.findOne({
      email: testMail,
    });
    const expectedAbonnement = [];
    expect(resultSubscriber.subscription).toEqual(expectedAbonnement);
  });

  test("subscriber can be removed", async () => {
    let testSubscriber = await Subscriber.findOne({
      email: testMail,
    });
    await testSubscriber.deleteOne();
    const resultSubscriber = await Subscriber.findOne({
      email: testMail,
    });
    expect(resultSubscriber).toEqual(null);
  });
});
