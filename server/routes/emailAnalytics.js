const express = require("express");
const router = express();
const EmailAnalytics = require("../model/emailAnalytics");
const { sendWebsocketMessage } = require("../utils/websockets");

router.get("/trackOnlineView/:emailId", async (req, res) => {
  try {
    const { emailId } = req.params;

    if (!emailId) {
      return res.status(400).send('Email ID is required');
    }

    const analytics =
      (await EmailAnalytics.findOne({ emailId })) ||
      new EmailAnalytics({ emailId });
    analytics.opened += 1;
    await analytics.save();

    console.log(`New count for email ID ${emailId}: ${analytics.opened}`);
    if (res.statusCode === 200) {
      sendWebsocketMessage({ type: "trackOnlineView", emailId, opened: analytics.opened });
    }
    return res.status(200).send();
  } catch (error) {
    console.error(error);
    return res.status(500).send('An error occurred');
  }
});

router.get("/trackUnsubscribe/:emailId", async (req, res) => {
  try {
    const { emailId } = req.params;

    if (!emailId) {
      return res.status(400).send('Email ID is required');
    }

    const analytics =
      (await EmailAnalytics.findOne({ emailId })) ||
      new EmailAnalytics({ emailId });
    analytics.unsubscribed += 1;
    await analytics.save();

    console.log(`New count for email ID ${emailId}: ${analytics.unsubscribed}`);
    if (res.statusCode === 200) {
      sendWebsocketMessage({ type: "trackUnsubscribe", emailId, unsubscribed: analytics.unsubscribed });
    }
    return res.status(200).send();
  } catch (error) {
    console.error(error);
    return res.status(500).send('An error occurred');
  }
});

router.get("/stats/:emailId", async (req, res) => {
  const { emailId } = req.params;

  // Find the analytics data for the specified emailId
  const analytics = await EmailAnalytics.findOne({ emailId });

  // If no data was found, create a new object with 0 values
  if (!analytics) {
    console.log(`No analytics data found for emailId: ${emailId}`);
    return res.json({
      [emailId]: {
        opened: 0,
        unsubscribed: 0,
      },
    });
  }

  // Return the analytics data
  res.json({
    [emailId]: {
      opened: analytics.opened,
      unsubscribed: analytics.unsubscribed,
    },
  });
});


module.exports = router;
