"use strict";

const express = require("express");
const { Category } = require("../model/subscribers");
const router = express.Router();

router.get("/unsubscribe/count", async (req, res) => {
  try {
    const categories = await Category.find();
    const array = categories.map((element) => {
      return { name: element.name, count: element.count };
    });
    res.status(200).send(array);
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

router.put("/unsubscribe/lists", async (req, res) => {
  const { subscriptions } = req.body;

  try {
    for (const subscription of subscriptions) {
      const maillist = await Category.findOne({ name: subscription });

      if (!maillist) {
        maillist = new Category({ name: subscription, count: 1 });
      } else {
        maillist.count += 1;
      }

      await maillist.save();
    }

    res.status(200).json({ message: "Unsubscribebs updated" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
