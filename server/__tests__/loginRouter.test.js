const request = require("supertest");
const jwt = require("jsonwebtoken");
const express = require("express");
const authRoutes = require("../routes/loginRouter");

jest.mock("jsonwebtoken");

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

describe("Authentication Routes", () => {

  it("should handle login with valid token", async () => {
    jwt.verify.mockImplementation((token, secretKey, callback) => {
      callback(null, { sub: "user12345" });
    });

    const response = await request(app)
      .post("/auth/login")
      .set("Authorization", "Bearer validToken");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toEqual("validToken");
  });

  it("should handle login without token", async () => {
    jwt.verify.mockImplementation((token, secretKey, callback) => {
      callback(new Error("Invalid token"));
    });

    const response = await request(app).post("/auth/login");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeUndefined();
  });

  it("should handle tempAuth route", async () => {
    jwt.sign.mockReturnValue("tempToken");

    const response = await request(app).get("/auth/tempAuth");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toEqual("tempToken");
  });
});
