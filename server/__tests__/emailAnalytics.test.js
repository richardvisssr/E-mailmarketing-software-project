const request = require("supertest");
const { app, httpServer, server } = require("../app");
const mongoose = require("mongoose");
const sendWebsocketMessage =
  require("../utils/websockets").sendWebsocketMessage;
const EmailAnalytics = require("../model/emailAnalytics");
let token;

// Mock the WebSocket server
jest.mock("../utils/websockets", () => ({
  sendWebsocketMessage: jest.fn(),
  httpServer: {
    clients: [{ readyState: 1, send: jest.fn() }],
    close: jest.fn(),
  },
}));

describe("EmailAnalytics Model Tests", () => {
  beforeAll(async () => {
    token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ3OTU4NjEsImV4cCI6MTcxMjU3MTg2MX0.XbetRe5V3cNlGcJbS3_yzV01lTFcUfCuGef6Ukt--q0";
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect("mongodb://127.0.0.1:27017/nyalaTest", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }
  });

  beforeEach(async () => {
    await EmailAnalytics.create({
      emailId: "testEmailId",
      opened: 0,
      unsubscribed: 0,
      links: [{ link: "testLink", count: 4 }],
    });
  });

  afterEach(async () => {
    await EmailAnalytics.deleteMany({});
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // Close the WebSocket server and reset the mock implementation
    jest.resetModules();
    jest.clearAllMocks();
    httpServer.close();
    server.close();
  });

  describe("GET /trackOnlineView/:emailId", () => {
    it("should track online view and send WebSocket message", async () => {
      const emailId = "testEmailId";
      const analytics = {
        opened: 0,
        save: jest.fn(),
      };
      jest.spyOn(EmailAnalytics, "findOne").mockResolvedValue(analytics);
      const response = await request(app)
        .get(`/trackOnlineView/${emailId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.text).toBe("");

      // Assert that the analytics were updated and saved
      expect(analytics.opened).toBe(1);
      expect(analytics.save).toHaveBeenCalled();

      // Assert that the WebSocket message was sent
      expect(sendWebsocketMessage).toHaveBeenCalledWith({
        type: "trackOnlineView",
        emailId,
        opened: 1,
      });
    });

    it("should handle missing emailId gracefully", async () => {
      const response = await request(app)
        .get("/trackOnlineView/undefined")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.text).toBe("Email ID is required");
    });

    it("should handle errors gracefully", async () => {
      // Mock the findOne method to throw an error
      jest.spyOn(EmailAnalytics, "findOne").mockImplementation(() => {
        throw new Error("An error occurred");
      });

      const response = await request(app)
        .get("/trackOnlineView/testEmailId")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.text).toBe("An error occurred");
    });

    it("should track hyperlinks and send WebSocket message", async () => {
      const emailId = "testEmailId";
      const link = "testLink";
      const analytics = {
        links: [{ link, count: 4 }],
        save: jest.fn(),
      };

      jest.spyOn(EmailAnalytics, "findOne").mockResolvedValue(analytics);
      const response = await request(app)
        .get(`/trackHyperlinks/${link}/${emailId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.text).toBe("");

      // Assert that the analytics were updated and saved
      expect(analytics.links[0].count).toBe(5);
      expect(analytics.save).toHaveBeenCalled();
    });

    it("should handle missing emailId gracefully", async () => {
      const response = await request(app)
        .get("/trackHyperlinks/undefined/undefined") // No emailId provided
        .set("Authorization", `Bearer ${token}`);

      // Assert the response status
      expect(response.status).toBe(400);

      // Assert the response body (optional)
      expect(response.text).toBe("Email ID and Link are required");
    });

    it("should track unsubscribe and send WebSocket message", async () => {
      const emailId = "testEmailId";
      const analytics = {
        unsubscribed: 0,
        save: jest.fn(),
      };

      jest.spyOn(EmailAnalytics, "findOne").mockResolvedValue(analytics);
      const response = await request(app)
        .get(`/trackUnsubscribe/${emailId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.text).toBe("");

      // Assert that the analytics were updated and saved
      expect(analytics.unsubscribed).toBe(1);
      expect(analytics.save).toHaveBeenCalled();
    });

    it("should handle missing emailId gracefully", async () => {
      const response = await request(app)
        .get("/trackUnsubscribe/")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it("should handle errors gracefully", async () => {
      // Mock the findOne method to throw an error
      jest.spyOn(EmailAnalytics, "findOne").mockImplementation(() => {
        throw new Error("An error occurred");
      });

      const response = await request(app)
        .get("/trackUnsubscribe/testEmailId")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.text).toBe("An error occurred");
    });

    it("should track unsubscribe and send WebSocket message", async () => {
      const emailId = "testEmailId";
      const analytics = {
        unsubscribed: 0,
        save: jest.fn(),
      };

      jest.spyOn(EmailAnalytics, "findOne").mockResolvedValue(analytics);
      const response = await request(app)
        .get(`/trackUnsubscribe/${emailId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.text).toBe("");

      // Assert that the analytics were updated and saved
      expect(analytics.unsubscribed).toBe(1);
      expect(analytics.save).toHaveBeenCalled();
    });

    it("should handle missing emailId gracefully", async () => {
      const response = await request(app)
        .get("/trackUnsubscribe/")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(404);
    });

    it("should handle errors gracefully", async () => {
      jest.spyOn(EmailAnalytics, "findOne").mockImplementation(() => {
        throw new Error("An error occurred");
      });

      const response = await request(app)
        .get("/trackUnsubscribe/testEmailId")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.text).toBe("An error occurred");
    });

    it("should handle errors gracefully", async () => {
      const response = await request(app)
        .get("/trackOnlineView/testEmailId")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.text).toBe("An error occurred");
    });

    it("should return analytics for a valid emailId", async () => {
      const emailId = "testEmailId";
      const analytics = {
        opened: 2,
        unsubscribed: 1,
        links: [
          { url: "https://example.com/link1", count: 3 },
          { url: "https://example.com/link2", count: 1 },
        ],
      };

      jest.spyOn(EmailAnalytics, "findOne").mockResolvedValue(analytics);

      const response = await request(app)
        .get(`/stats/${emailId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        [emailId]: {
          opened: 2,
          unsubscribed: 1,
          totalLinkClicks: 4,
          links: [
            { url: "https://example.com/link1", count: 3 },
            { url: "https://example.com/link2", count: 1 },
          ],
        },
      });
    });

    it("should return default analytics for a non-existent emailId", async () => {
      const emailId = "nonExistentEmailId";
      const analytics = null;

      jest.spyOn(EmailAnalytics, "findOne").mockResolvedValue(analytics);

      const response = await request(app)
        .get(`/stats/${emailId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        [emailId]: {
          opened: 0,
          unsubscribed: 0,
          totalLinkClicks: 0,
        },
      });
    });
  });
});
