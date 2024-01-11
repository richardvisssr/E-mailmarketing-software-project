const mongoose = require("../utils/connection");

const emailAnalyticsSchema = new mongoose.Schema({
  emailId: {
    type: String,
    required: true,
  },
  opened: {
    type: Number,
    default: 0,
  },
  unsubscribed: {
    type: Number,
    default: 0,
  },
  links: [
    {
      link: String,
      count: { type: Number, default: 0 },
    },
  ],
    recipientCount: {
    type: Number,
    default: 0,
  },
});

const EmailAnalytics = mongoose.model("EmailAnalytics", emailAnalyticsSchema);

module.exports = EmailAnalytics;
