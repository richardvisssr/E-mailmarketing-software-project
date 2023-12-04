const request = require("supertest");
const mongoose = require("mongoose");
const { app, server, httpServer } = require("../app");

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
      name: "Matthias",
      subscriptions: ["Nieuwsbrief", "CMD", "ICT", "Leden"],
    });

    const sub = await Subscriber.findOne({ email: "Matthias@budding.nl" });
    subscriberEmail = sub;
    subscribersSubscriptions = sub.subscription;
  });

  afterEach(async () => {
    await Subscriber.deleteMany({});
  });

  afterAll(async () => {
    server.close();
    httpServer.close();
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  test("Get subscribers with selected mailing list", async () => {
    const selectedMailingList = "Nieuwsbrief";
    const response = await request(app)
      .get("/subscribers")
      .query({ selectedMailingList });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Array));
  });

  test("Get subs of subscriber that doesn't exist", async () => {
    const response = await request(app).get("/test@test.nl/subs");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Subscriber not found" });
  });

  test("Internal server error when adding a subscriber", async () => {
    jest.spyOn(Subscriber.prototype, "save").mockImplementationOnce(() => {
      throw new Error("Internal server error");
    });

    const response = await request(app)
      .post("/subscribers/add")
      .send({
        email: "test@example.com",
        name: "Test",
        subscriptions: ["Newsletter", "Members"],
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal Server Error" });
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
        name: subscriberEmail.name,
        subscriptions: ["Leden"],
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Subscriber updated" });
  });

  test("Getting the subscribtions of an subscriber", async () => {
    const response = await request(app).get(`/${subscriberEmail.email}/subs`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(subscribersSubscriptions);
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
        name: subscriberEmail.name,
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
        name: "Test",
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
        name: "Test",
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

  test("Adding a subscriber with valid input", async () => {
    const response = await request(app)
      .post("/subscribers/add")
      .send({
        email: "test@example.com",
        name: "Test",
        subscriptions: ["Leden", "Nieuwsbrief"],
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "New subscriber added" });
  });

  test("Adding a subscriber with missing email", async () => {
    const response = await request(app)
      .post("/subscribers/add")
      .send({
        subscription: ["Leden", "Nieuwsbrief"],
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Bad Request: Invalid input" });
  });

  test("Adding a subscriber with missing subscription", async () => {
    const response = await request(app).post("/subscribers/add").send({
      email: "test@example.com",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Bad Request: Invalid input" });
  });

  test("Adding a subscriber with invalid email format", async () => {
    const response = await request(app)
      .post("/subscribers/add")
      .send({
        email: "invalidemail",
        name: "Test",
        subscriptions: ["Leden", "Nieuwsbrief"],
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Bad Request: Invalid email format",
    });
  });

  test("Getting all subscribers", async () => {
    const subscribers = [
      { email: "test1@example.com", name: "Test 1", subscriptions: ["Leden"] },
      {
        email: "test2@example.com",
        name: "Test 2",
        subscriptions: ["Nieuwsbrief"],
      },
      {
        email: "test3@example.com",
        name: "Test 3",
        subscriptions: ["Leden", "Nieuwsbrief"],
      },
    ];

    jest.spyOn(Subscriber, "find").mockResolvedValue(subscribers);

    const response = await request(app).get("/subscribers/all");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(subscribers);
  });

  test("Internal server error when getting all subscribers", async () => {
    jest.spyOn(Subscriber, "find").mockImplementationOnce(() => {
      throw new Error("Internal server error");
    });

    const response = await request(app).get("/subscribers/all");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });
  });

  test("Adding a subscriber with existing email", async () => {
    const response = await request(app)
      .post("/subscribers/add")
      .send({
        email: subscriberEmail.email,
        name: subscriberEmail.name,
        subscriptions: ["Leden"],
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Subscriptions added to existing subscriber",
    });
  });

  test("Updating a subscriber with valid input", async () => {
    const newName = "New Name";
    const newEmail = "newemail@example.com";

    const response = await request(app)
      .put(`/change/${subscriberEmail.email}`)
      .send({
        name: newName,
        email: newEmail,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Subscriber updated" });

    const updatedSubscriber = await Subscriber.findOne({ email: newEmail });
    expect(updatedSubscriber).toBeDefined();
    expect(updatedSubscriber.name).toBe(newName);
  });

  test("Updating a subscriber with invalid email format", async () => {
    const newName = "New Name";
    const newEmail = "invalidemail";

    const response = await request(app)
      .put(`/change/${subscriberEmail.email}`)
      .send({
        name: newName,
        email: newEmail,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Bad Request: Invalid email format",
    });
  });

  test("No subscribers found", async () => {
    const subscription = "InvalidSubscription";

    const subscribers = [];

    jest.spyOn(Subscriber, "find").mockResolvedValue(subscribers);

    const response = await request(app).delete(`/unsubscribe/${subscription}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "No subscribers found" });

    expect(Subscriber.find).toHaveBeenCalledWith({
      subscription: subscription,
    });
  });

  test("Internal server error", async () => {
    const subscription = "Leden";

    jest
      .spyOn(Subscriber, "find")
      .mockRejectedValue(new Error("Internal server error"));

    const response = await request(app).delete(`/unsubscribe/${subscription}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal server error" });

    expect(Subscriber.find).toHaveBeenCalledWith({
      subscription: subscription,
    });
  });
});
