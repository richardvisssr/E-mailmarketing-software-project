"use strict";

const express = require("express");
const { Subscriber, Unsubscriber } = require("../model/subscribers");
const router = express.Router();

router.get("/subscribers", async (req, res) => {
  const selectedMailingList = req.query.selectedMailingList.split(",");
  try {
    const subscribers = await Subscriber.find({
      subscription: { $in: selectedMailingList },
    });
    res.status(200).send(subscribers);
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

router.get("/subscribers/all", async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.status(200).send(subscribers);
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

router.post("/subscribers/add", async (req, res) => {
  try {
    const { email, name, subscriptions } = req.body;

    if (!email || !subscriptions || !Array.isArray(subscriptions)) {
      return res.status(400).json({ message: "Bad Request: Invalid input" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json({ message: "Bad Request: Invalid email format" });
    }

    const subscriber = {
      email,
      name,
      subscription: subscriptions,
    };

    const newSubscriber = new Subscriber(subscriber);
    await newSubscriber.save();
    res.status(200).json({ message: "Subscriber added" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:subscriber/subs", async (req, res) => {
  const { subscriber } = req.params;

  try {
    const sub = await Subscriber.findOne(
      {
        email: subscriber,
      },
      { subscription: 1 }
    );

    if (!sub) {
      return res.status(404).send({ message: "Subscriber not found" });
    }

    return res.status(200).send(sub.subscription);
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
});

router.post("/reason", async (req, res) => {
  const { reden } = req.body;

  try {
    const unsubscriber = new Unsubscriber({
      reden: reden,
    });
    await unsubscriber.save();
    return res.status(200).send({ message: "Reason added" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/subscribers/add", async (req, res) => {
  const { email, subscriptions } = req.body;
  try {
    await Subscriber.findOneAndUpdate(
      { email: email },
      { $addToSet: { subscription: subscriptions } },
      { upsert: true }
    );

    res.status(200).json({ message: "Subscriber updated" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.put("/change/:subscriber", async (req, res) => {
  const prevEmail = req.params.subscriber;
  const { name, email } = req.body;

  try {
    const selectedSubscriber = await Subscriber.findOne({
      email: prevEmail,
    });

    if (!selectedSubscriber) {
      return res.status(404).send({ message: "Subscriber not found" });
    }

    if (name) {
      selectedSubscriber.name = name;
    }

    if (email) {
      selectedSubscriber.email = email;
    }

    await selectedSubscriber.save();

    res.status(200).json({ message: "Subscriber updated" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/unsubscribe", async (req, res) => {
  const { email } = req.body;
  try {
    const subscriber = await Subscriber.findOneAndDelete({
      email: email,
    });
    if (!subscriber) {
      return res.status(404).send({ message: "Subscriber not found" });
    }
    return res.status(200).send({ message: "Subscriber removed" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.delete("/unsubscribe/subs", async (req, res) => {
  const { email, subscriptions } = req.body;

  try {
    const subscriber = await Subscriber.findOne({ email: email });

    if (!subscriber) {
      return res.status(404).send({ message: "Subscriber not found" });
    }

    if (subscriptions && subscriptions.length > 0) {
      subscriber.subscription = subscriber.subscription.filter(
        (subscription) => !subscriptions.includes(subscription)
      );
    } else {
      return res.status(400).send({ message: "No subscriptions provided" });
    }

    await subscriber.save();

    return res
      .status(200)
      .send({ message: "subscriptions removed successfully" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.delete("/unsubscribe/:subscription", async (req, res) => {
  const { subscription } = req.params;

  try {
    const subscribers = await Subscriber.find({ subscription: subscription });

    if (subscribers.length === 0) {
      return res.status(404).send({ message: "No subscribers found" });
    }

    subscribers.forEach(async (subscriber) => {
      subscriber.subscription = subscriber.subscription.filter(
        (sub) => sub !== subscription
      );
      await subscriber.save();
    });

    return res
      .status(200)
      .send({ message: "Subscription removed for all subscribers" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
