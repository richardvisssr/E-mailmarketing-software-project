const express = require("express");
const router = express();
const EmailAnalytics = require("../model/emailAnalytics");
const { sendWebsocketMessage } = require("../utils/websockets");

async function getAnalytics(emailId) {
  return (
    (await EmailAnalytics.findOne({ emailId })) ||
    new EmailAnalytics({ emailId })
  );
}

router.get("/trackOnlineView/:emailId", async (req, res) => {
  try {
    const { emailId } = req.params;

    if (!emailId) {
      return res.status(400).send("Email ID is required");
    }

    const analytics = await getAnalytics(emailId);
    analytics.opened += 1;
    await analytics.save();

    if (res.statusCode === 200) {
      sendWebsocketMessage({
        type: "trackOnlineView",
        emailId,
        opened: analytics.opened,
      });
    }
    return res.status(200).send();
  } catch (error) {
    return res.status(500).send("An error occurred");
  }
});

router.get("/trackHyperlinks/:link/:emailId", async (req, res) => {
  try {
    const { emailId, link } = req.params;

    if (!emailId) {
      return res.status(400).send("Email ID is required");
    }

    const analytics = await getAnalytics(emailId);

    let linkObj = analytics.links.find((l) => l.link === link);

    if (!linkObj) {
      linkObj = { link, count: 1 };
      analytics.links.push(linkObj);
    }

    linkObj.count++;

    await analytics.save();

    if (res.statusCode === 200) {
      sendWebsocketMessage({
        type: "trackHyperlinks",
        emailId,
        link,
        clicks: linkObj.count,
      });
    }
    return res.status(200).send();
  } catch (error) {
    return res.status(500).send("An error occurred");
  }
});

router.get("/trackUnsubscribe/:emailId", async (req, res) => {
  try {
    const { emailId } = req.params;

    if (!emailId) {
      return res.status(400).send("Email ID is required");
    }

    const analytics = await getAnalytics(emailId);
    analytics.unsubscribed += 1;
    await analytics.save();

    if (res.statusCode === 200) {
      sendWebsocketMessage({
        type: "trackUnsubscribe",
        emailId,
        unsubscribed: analytics.unsubscribed,
      });
    }
    return res.status(200).send();
  } catch (error) {
    return res.status(500).send("An error occurred");
  }
});

router.get("/stats/:emailId", async (req, res) => {
  const { emailId } = req.params;

  const analytics = await EmailAnalytics.findOne({ emailId });

  if (!analytics) {
    return res.json({
      [emailId]: {
        opened: 0,
        unsubscribed: 0,
        totalLinkClicks: 0,
      },
    });
  }

  let totalLinkClicks = analytics.links.reduce(
    (total, linkObj) => total + linkObj.count,
    0
  );

  res.json({
    [emailId]: {
      opened: analytics.opened,
      unsubscribed: analytics.unsubscribed,
      totalLinkClicks,
      links: analytics.links,
    },
  });
});

module.exports = router;
