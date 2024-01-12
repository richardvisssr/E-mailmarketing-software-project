const express = require("express");
const request = require("supertest");
const routes = require("../routes/templateRoutes");
const mongoose = require("mongoose");
const { app, httpServer, server } = require("../app");
app.use(express.json());
app.use("/", routes);

const Design = mongoose.model("Design");
const Email = mongoose.model("Email");
let token;

beforeAll(async () => {
  token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ3OTU4NjEsImV4cCI6MTcxMjU3MTg2MX0.XbetRe5V3cNlGcJbS3_yzV01lTFcUfCuGef6Ukt--q0";
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(`mongodb://localhost:27017/nyala`);
  }
});

beforeEach(async () => {
  const designData = {
    id: "testDesignId",
    design: { test: "test" },
    title: "testTitle",
  };

  const emailData = {
    id: "testEmailId",
    html: "<p>Your test HTML content here</p>",
    showHeader: true,
    subject: "Test Subject",
  };

  await Email.create(emailData);
  await Design.create(designData);
});
afterEach(async () => {
  await Design.deleteOne({ id: "testDesignId" });
  await Email.deleteOne({ id: "testEmailId" });
});
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  httpServer.close();
  server.close();
});

describe("GET /templates", () => {
  it("should respond with an array of templates", async () => {
    const response = await request(app)
      .get("/templates")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body).toEqual(expect.any(Array));
    expect(response.statusCode).toBe(200);
  }, 10000);
  it("should respond with an error when an internal server error occurs", async () => {
    jest.spyOn(Design, "find").mockImplementation(() => {
      throw new Error("Internal Server Error");
    });

    const response = await request(app)
      .get("/templates")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "Internal Server Error" });
  }, 10000);
});

describe("GET /templates/:id", () => {
  it("should respond with a template", async () => {
    const response = await request(app)
      .get("/templates/testEmailId")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body).toEqual(expect.any(Object));
    expect(response.statusCode).toBe(200);
  }, 10000);

  it("should respond with an error", async () => {
    const response = await request(app)
      .get("/templates/100")
      .set("Authorization", `Bearer ${token}`);
    expect(response.body).toEqual({ error: "Email not found" });
    expect(response.statusCode).toBe(404);
  }, 10000);

  it("should respond with an error when an internal server error occurs", async () => {
    jest.spyOn(Email, "findOne").mockImplementation(() => {
      throw new Error("Internal Server Error");
    });

    const response = await request(app)
      .get("/templates/testEmailId")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "Internal Server Error" });
  }, 10000);
});

describe("DELETE /template/:id", () => {
  it("should respond with a success message", async () => {
    await Design.create({
      id: "testEmailId",
      design: { key: "value" },
      title: "Title",
    });

    const response = await request(app)
      .delete("/template/testEmailId")
      .set("Authorization", `Bearer ${token}`);

    expect(response.body).toEqual({ success: true });
    expect(response.statusCode).toBe(200);
  }, 10000);

  it("should respond with an error when an internal server error occurs", async () => {
    jest.spyOn(Email, "findOneAndDelete").mockImplementation(() => {
      throw new Error("Internal Server Error");
    });

    const response = await request(app)
      .delete("/template/testEmailId")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ message: "Internal Server Error" });
  }, 10000);
});
