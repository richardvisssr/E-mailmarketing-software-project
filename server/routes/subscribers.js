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
      { abonnement: 1 }
    );
    if (!sub) {
      return res.status(404).send({ message: "Subscriber not found" });
    }
    return res.status(200).send(sub.abonnement);
  } catch (error) {
    return res.status(500).send(error);
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
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post("/subscribers/add", async (req, res) => {
  try {
    const { email } = req.body;
    const subscriber = {
      email,
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

router.delete("/unsubscribe/subs", async (req, res) => {
  const { email, abonnementen } = req.body;

  try {
    const subscriber = await Subscriber.findOne({ email });

    if (!subscriber) {
      return res.status(404).send({ message: "Subscriber not found" });
    }

    if (abonnementen && abonnementen.length > 0) {
      subscriber.abonnementen = subscriber.abonnementen.filter(
        (subscription) => !abonnementen.includes(subscription)
      );
    }

    await subscriber.save();

    return res
      .status(200)
      .send({ message: "Abonnementen removed successfully" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;
