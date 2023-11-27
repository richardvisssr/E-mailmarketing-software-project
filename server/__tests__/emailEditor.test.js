const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const { Design, Email } = require("../model/emailEditor");

const router = require("../routes/emailEditor");
const app = express();
app.use(express.json());
app.use("/mail", router);

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(`mongodb://127.0.0.1:27017/nyalaTest`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Email Editor Routes", () => {
  describe("GET /loadDesign/:id", () => {
    it("should return the design with the specified id", async () => {
      const testDesign = await Design.create({
        id: "123",
        design: { key: "value" },
      });

      const response = await request(app).get(
        `/mail/loadDesign/${testDesign.id}`
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(testDesign.design);

      await Design.deleteOne({ _id: testDesign._id });
    });
  });

  describe("PUT /saveDesign", () => {
    it("should save the design and return a success message", async () => {
      const response = await request(app)
        .put("/mail/saveDesign")
        .send({ id: "456", design: { key: "updatedValue" } });

      expect(response.status).toBe(200);
      expect(response.text).toBe("Design updated successfully");
    });
  });

  describe("PUT /sendEmail", () => {
    it("should send the email and return a success message", async () => {
      const response = await request(app)
        .put("/mail/sendEmail")
        .send({ id: "789", html: "<p>Email content</p>" });

      expect(response.status).toBe(200);
      expect(response.text).toBe("Design saved successfully");
    });
  });

  describe("GET /getEmail/:id", () => {
    it("should return the email with the specified id", async () => {
      const testEmail = await Email.create({ id: "456", html: "Test Email" });

      const response = await request(app).get(`/mail/getEmail/${testEmail.id}`);
      expect(response.status).toBe(200);
      expect(response.body.subject).toBe(testEmail.subject);
      await Email.deleteOne({ _id: testEmail._id });
    });
  });

  describe("PUT /sendEmail", () => {
    it("should handle errors during email sending", async () => {
      jest.spyOn(Email, "findOneAndUpdate").mockImplementationOnce(() => {
        throw new Error("Mocked email loading error");
      });

      const response = await request(app)
        .put("/mail/sendEmail")
        .send({ id: "789", html: "<p>Email content</p>" });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal server error" });
    });
  });

  describe("GET /getEmail/:id", () => {
    it("should handle errors during email loading", async () => {
      jest.spyOn(Email, "findOne").mockImplementationOnce(() => {
        throw new Error("Mocked email loading error");
      });

      const response = await request(app).get("/mail/getEmail/someid");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal server error" });
    });
  });
});
