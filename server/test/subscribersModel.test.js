"use strict";

const mongoose = require("mongoose");
const { Subscriber } = require("../model/subscribers");

describe("Subscriber Model Tests", () => {
  let testMail = "test@example.com";

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect("mongodb://127.0.0.1:27017/Nyala", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });

  beforeEach(async () => {
    await Subscriber.create({ email: testMail, abonnement: ["CMD"] });
  });

  afterEach(async () => {
    await Subscriber.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test("abonnement can be added", async () => {
    let testSubscriber = await Subscriber.findOne({
      email: testMail,
    });
    const abonnementToAdd = "ICT";
    await testSubscriber.updateOne({
      $addToSet: { abonnement: abonnementToAdd },
    });
    const resultSubscriber = await Subscriber.findOne({
      email: testMail,
    });
    const expectedAbonnement = ["CMD", abonnementToAdd];
    expect(resultSubscriber.abonnement).toEqual(expectedAbonnement);
  });

  test("abonnement can be removed", async () => {
    let testSubscriber = await Subscriber.findOne({
      email: testMail,
    });
    const abonnementToRemove = "CMD";
    await testSubscriber.updateOne({
      $pull: { abonnement: abonnementToRemove },
    });

    const resultSubscriber = await Subscriber.findOne({
      email: testMail,
    });
    const expectedAbonnement = [];
    expect(resultSubscriber.abonnement).toEqual(expectedAbonnement);
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
