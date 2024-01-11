const request = require("supertest");
const express = require("express");
const apiRoutes = require("../routes/settingsRoute");
const { Activity, Token } = require("../model/activityModel");

const app = express();
app.use(express.json());
app.use("", apiRoutes);

describe("API Routes", () => {
  let token;
  beforeAll(async () => {
    token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ4ODY0OTYsImV4cCI6MTcxMjY2MjQ5Nn0.STjc2iZmL_VjLXI5UrPhyIvRSqHd5IxbUITB7oLzjSc";
  });

  // Define a setup function to create a test token before tests
  async function setupTestToken() {
    const existingToken = await Token.findOne();

    if (!existingToken) {
      const newToken = new Token({
        token: "testToken",
        secret: "testSecret",
      });

      await newToken.save();
    }
  }
  // Clean up the database after each test
  afterEach(async () => {
    await Activity.deleteMany();
  });

  it("should update settings", async () => {
    const response = await request(app)
      .put("/settings")
      .send({ intervalTime: 5, expirationTime: 30, activityLog: true })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Settings updated");
  });

  it("should get settings", async () => {
    const response = await request(app)
      .get("/settings")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.intervalTime).toBe(5);
    expect(response.body.expirationTime).toBe(30);
    expect(response.body.activityLog).toBe(true);
  });

  it("should get activity log", async () => {
    await Activity.create({
      time: new Date(),
      ip: "127.0.0.1",
      location: "localhost",
      device: "test device",
    });

    const response = await request(app)
      .get("/activity")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1); // Adjust based on your test data
  });

  //   it("should generate token", async () => {
  //     const response = await request(app)
  //       .post("/generateToken")
  //       .set("Authorization", `Bearer ${token}`);

  //     expect(response.status).toBe(200);
  //     expect(response.body.token).toBeDefined();
  //     expect(response.body.secret).toBeDefined();
  //   });
});
