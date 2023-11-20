"use strict";

const express = require("express");
const { Subscriber, Unsubscriber } = require("../model/subscribers");
const router = express.Router();

router.get("/getSubscribers", async (req, res) => {
  const selectedMailingList = req.query.selectedMailingList;
  try {
    const subscribers = await Subscriber.find({
      abonnement: selectedMailingList,
    });

    res.json(subscribers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

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

router.put("/subscribers/add", async (req, res) => {
  const { email, abonnementen } = req.body;
  try {
    await Subscriber.findOneAndUpdate(
      { email: email },
      { $addToSet: { abonnement: abonnementen } },
      { upsert: true }
    );

    res.status(200).json({ message: "Subscriber updated" });
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
  const { email, abonnement } = req.body;

  try {
    const subscriber = await Subscriber.findOne({ email: email });

    if (!subscriber) {
      return res.status(404).send({ message: "Subscriber not found" });
    }

    if (abonnement && abonnement.length > 0) {
      subscriber.abonnement = subscriber.abonnement.filter(
        (subscription) => !abonnement.includes(subscription)
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
