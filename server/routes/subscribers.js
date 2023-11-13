"use strict";

const express = require("express");
const { Subscriber, Unsubscriber } = require("../model/subscribers");
const router = express.Router();

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

module.exports = router;
