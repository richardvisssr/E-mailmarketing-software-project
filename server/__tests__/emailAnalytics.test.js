const request = require("supertest");
const { app, httpServer, server } = require("../app");
const mongoose = require("mongoose");
const EmailAnalytics = mongoose.model("EmailAnalytics");
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
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ3MjI0NjgsImV4cCI6MTcxMjQ5ODQ2OH0.a-WwuZn-jBwTfZi3UIvCrJxr-dU8cyyKAnZZCVAtByU";
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect("mongodb:127.0.0.1:27017/nyalaTest", {
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
    // await EmailAnalytics.deleteMany({});
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
      const response = await request(app)
        .get("/trackOnlineView/testEmailId")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.text).toBe("");

      // // Assert that the WebSocket message was sent
      // const sendWebsocketMessage =
      //   require("../utils/websockets").sendWebsocketMessage;
      // expect(sendWebsocketMessage).toHaveBeenCalledWith({
      //   type: "trackOnlineView",
      //   emailId: "testEmailId",
      //   opened: 1,
      // });
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
    const response = await request(app)
      .get("/trackHyperlinks/testLink/testEmailId")
      .set("Authorization", `Bearer ${token}`);

    // Assert the response status
    expect(response.status).toBe(200);

    // Assert the response body (optional)
    expect(response.text).toBe("");

    // Assert that the WebSocket message was sent
    expect(httpServer.clients[0].send).toHaveBeenCalledWith(
      JSON.stringify({
        type: "trackHyperlinks", // Fix this to trackHyperlinks
        emailId: "testEmailId",
        link: "testLink",
        clicks: 1,
      })
    );
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
    const response = await request(app)
      .get("/trackUnsubscribe/testEmailId")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.text).toBe("");

    // // Assert that the WebSocket message was sent
    // const sendWebsocketMessage =
    //   require("../utils/websockets").sendWebsocketMessage;
    // expect(sendWebsocketMessage).toHaveBeenCalledWith({
    //   type: "trackUnsubscribe",
    //   emailId: "testEmailId",
    //   unsubscribed: 1,
    // });
  });

  it("should handle missing emailId gracefully", async () => {
    const response = await request(app)
      .get("/trackUnsubscribe")
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
      .get("/trackUnsubscribe/testEmailId")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(500);
    expect(response.text).toBe("An error occurred");
  });

  it("should track unsubscribe and send WebSocket message", async () => {
    const response = await request(app)
      .get("/trackUnsubscribe/testEmailId")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.text).toBe("");

    // Assert that the WebSocket message was sent
    // const sendWebsocketMessage =
    //   require("../utils/websockets").sendWebsocketMessage;
    // expect(sendWebsocketMessage).toHaveBeenCalledWith({
    //   type: "trackUnsubscribe",
    //   emailId: "testEmailId",
    //   unsubscribed: 1,
    // });
  });

  it("should handle missing emailId gracefully", async () => {
    const response = await request(app)
      .get("/trackUnsubscribe")
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
      .get("/trackUnsubscribe/testEmailId")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(500);
    expect(response.text).toBe("An error occurred");
  });
  });
});
