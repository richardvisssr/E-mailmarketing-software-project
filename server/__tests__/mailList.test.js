const mongoose = require("mongoose");
require("../model/mailList");
const { httpServer, server } = require("../app");

const MailList = mongoose.model("mailList");

describe("MailList Model Tests", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      // If no existing connection, create a new one
      await mongoose.connect(`mongodb://127.0.0.1:27017/nyalaTest`);
    }
  });

  beforeEach(async () => {
    await MailList.create({
      mailList: ["Nieuwsbrief", "CMD", "ICT", "Leden"],
    });
    const mailLijst = await MailList.findOne({});
  });

  afterEach(async () => {
    await MailList.deleteMany({});
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    httpServer.close();
    server.close();
  });

  test("MailList Add test", async () => {
    let testMailList = await MailList.findOne({});

    testMailList.mailList.push("Alumni");

    await testMailList.save();

    const resultMailList = await MailList.findOne({});

    const expectedResult = ["Nieuwsbrief", "CMD", "ICT", "Leden", "Alumni"];

    expect(resultMailList.mailList).toEqual(expectedResult);
  });
});
