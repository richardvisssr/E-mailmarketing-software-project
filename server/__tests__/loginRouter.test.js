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
      .set("Authorization", "Bearer validToken")
      .send({ device: "mobile" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toEqual("validToken");
  });

  it("should handle tempAuth route", async () => {
    jwt.sign.mockReturnValue("tempToken");

    const response = await request(app).get("/auth/tempAuth");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toEqual("tempToken");
  });

  it("should handle login with invalid token", async () => {
    const response = await request(app)
      .post("/auth/login")
      .set("Authorization", "Bearer token")
      .send({ device: "user-agent" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("should handle login with missing token", async () => {
    const response = await request(app)
      .post("/auth/login")
      .set("Authorization", "Bearer ")
      .send({ device: "user-agent" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it("should generate an access token with valid payload", () => {
    const id = "user12345";
    const expectedToken = "validToken";

    const actualToken = generateAccessToken(id);

    const decoded = jwt.verify(actualToken, secretKey);
    expect(decoded.sub).toBe(id);
    expect(decoded.iat).toBeCloseTo(Math.floor(Date.now() / 1000), -2);
    expect(decoded.exp).toBeCloseTo(
      Math.floor(Date.now() / 1000) + 24 * 60 * 60,
      -2
    );
  });
});
