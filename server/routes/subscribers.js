"use strict";

const express = require("express");
const { Subscriber, Unsubscriber } = require("../model/subscribers");
const router = express.Router();

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
    return res.status(500).send(error);
  }
});

router.post("/reason", async (req, res) => {
  const { reason } = req.body;

  try {
    const unsubscriber = new Unsubscriber({
      reason: reason,
    });
    await unsubscriber.save();
    return res.status(200).send({ message: "Reason added" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post("/subscribers/add", async (req, res) => {
  try {
    const { email, subscription } = req.body;

    if (!email || !subscription || !Array.isArray(subscription)) {
      return res.status(400).json({ message: "Bad Request: Invalid input" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Bad Request: Invalid email format" });
    }

    // const validsubscriptions = Haal hier de lijsten op met de model.
    // const invalidsubscription = subscription.find(a => !validsubscriptions.includes(a));

    // if (invalidsubscription) {
    //   return res.status(400).json({ message: `Bad Request: Invalid subscription - ${invalidsubscription}` });
    // }

    const subscriber = {
      email,
      subscription,
    };

    const newSubscriber = new Subscriber(subscriber);
    await newSubscriber.save();
    res.status(200).json({ message: "Subscriber added" });
  } catch (err) {
    console.log(err);
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

module.exports = router;
