const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

const { Subscriber } = require("../model/subscribers");

describe("Subscribers routes test", () => {
  let subscriberEmail;
  let subscribersSubscriptions;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect("mongodb:127.0.0.1:27017/nyalaTest", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });

  beforeEach(async () => {
    await Subscriber.create({
      email: "Matthias@budding.nl",
      subscription: ["Nieuwsbrief", "CMD", "ICT"],
    });

    const sub = await Subscriber.findOne({ email: "Matthias@budding.nl" });
    subscriberEmail = sub;
    subscribersSubscriptions = sub.subscription;
  });

  afterEach(async () => {
    await Subscriber.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test("should return subscribers for selected mailing list", async () => {
    Subscriber.find = jest
      .fn()
      .mockResolvedValue([
        { email: "subscriber1@test.com" },
        { email: "subscriber2@test.com" },
      ]);

    const selectedMailingList = "Leden";
    const response = await request(app)
      .get("/getSubscribers")
      .query({ selectedMailingList });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { email: "subscriber1@test.com" },
      { email: "subscriber2@test.com" },
    ]);
    expect(Subscriber.find).toHaveBeenCalledWith({
      subscription: selectedMailingList,
    });
  });

  test("should handle internal server error", async () => {
    Subscriber.find = jest.fn().mockRejectedValue(new Error("Database error"));

    const selectedMailingList = "Leden";
    const response = await request(app)
      .get("/getSubscribers")
      .query({ selectedMailingList });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });
  });

  test("Get subs of subscriber", async () => {
    const response = await request(app).get(`/${subscriberEmail.email}/subs`);
    const expectedResult = subscribersSubscriptions;

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining(expectedResult));
  });

  test("Get subs of subscriber that doesn't exist", async () => {
    const response = await request(app).get("/test@test.nl/subs");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Subscriber not found" });
  });

  test("Adding reason to unsubscribe", async () => {
    const response = await request(app)
      .post("/reason")
      .send({ reden: "Ik wil geen mail meer" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Reason added" });
  });

  test("Adding an user to the database", async () => {
    const response = await request(app)
      .put("/subscribers/add")
      .send({
        email: subscriberEmail.email,
        subscriptions: ["Leden"],
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Subscriber updated" });
  });

  test("Removing an user from the database", async () => {
    const response = await request(app)
      .delete("/unsubscribe")
      .send({ email: subscriberEmail.email });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Subscriber removed" });
  });

  test("Removing an user that doesn't exist", async () => {
    const response = await request(app)
      .delete("/unsubscribe")
      .send({ email: "Test@test.nl" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Subscriber not found" });
  });

  test("Removing a subscription from an user", async () => {
    const response = await request(app)
      .delete("/unsubscribe/subs")
      .send({
        email: subscriberEmail.email,
        subscriptions: ["Nieuwsbrief"],
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "subscriptions removed successfully",
    });
  });

  test("Removing something without a subscription given", async () => {
    const response = await request(app).delete("/unsubscribe/subs").send({
      email: subscriberEmail.email,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "No subscriptions provided",
    });
  });

  test("Removing a subscription from an user that doesn't exist", async () => {
    const response = await request(app)
      .delete("/unsubscribe/subs")
      .send({
        email: "Test@tes.nl",
        subscriptions: ["Nieuwsbrief"],
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Subscriber not found",
    });
  });

  test("Adding a subscription to an user that doesn't exist", async () => {
    const response = await request(app)
      .put("/subscribers/add")
      .send({
        email: "Test@tes.nl",
        subscriptions: ["Nieuwsbrief"],
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Subscriber updated" });
  });

  test("should return 404 if subscriber not found", async () => {
    const subscriber = "TEST@TEST.nl";
    const response = await request(app).get(`/${subscriber}/subs`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Subscriber not found" });
  });
});
