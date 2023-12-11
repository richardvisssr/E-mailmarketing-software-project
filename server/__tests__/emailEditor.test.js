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

afterEach(async () => {
  await Design.deleteMany({});
  await Email.deleteMany({});
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
});

describe("Email Editor Routes", () => {
  describe("GET /loadDesign/:id", () => {
    it("should return the design with the specified id", async () => {
      const testDesign = await Design.create({
        id: "123",
        design: { key: "value" },
        title: "testen",
      });

      const response = await request(app).get(
        `/mail/loadDesign/${testDesign.id}`
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        design: testDesign.design,
        title: testDesign.title,
      });

      await Design.deleteOne({ _id: testDesign._id });
    });
  });

  describe("PUT /sendEmail", () => {
    it("should send the email and return a success message", async () => {
      // Delete existing email with the same id
      await Email.deleteOne({ id: "789" });

      const response = await request(app)
        .put("/mail/sendEmail")
        .send({ id: "789", html: "<p>Email content</p>" });

      expect(response.status).toBe(200);
      expect(response.text).toBe("Design updated successfully");
    });
  });

  describe("GET /getEmail/:id", () => {
    it("should return the email with the specified id", async () => {
      // Delete existing email with the same id
      await Email.deleteOne({ id: "456" });

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

  describe("test 500 error on /loadDesign/:id", () => {
    it("should handle errors during design loading", async () => {
      jest.spyOn(Design, "findOne").mockImplementationOnce(() => {
        throw new Error("Mocked design loading error");
      });

      const response = await request(app).get("/mail/loadDesign/someid");
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal server error" });
    });
  });

  describe("test 200 and save on saveDesign", () => {
    it("should update the design and return a success message", async () => {
      // Create a design with the same id
      await Design.create({
        id: "456",
        design: { key: "initialValue" },
        title: "Initial Title",
      });

      const response = await request(app)
        .put("/mail/saveDesign")
        .send({
          id: "456",
          design: { key: "updatedValue" },
          title: "Updated Title",
        });

      expect(response.status).toBe(200);
      expect(response.text).toBe("Design updated successfully");
    });
  });

  describe("test 200 and save on saveDesign", () => {
    it("should save the design and return a success message", async () => {
      const response = await request(app)
        .put("/mail/saveDesign")
        .send({
          id: "789",
          design: { key: "newValue" },
          title: "New Title",
        });
  
      expect(response.status).toBe(200);
      expect(response.text).toBe("Design saved successfully");
    });
  });
 
});
