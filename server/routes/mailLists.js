const express = require("express");
const mailList = require("../model/mailList");
const router = express.Router();

router.get("/getList", async (req, res) => {
  try {
    const subscriptions = await mailList.find();
    res.json(subscriptions);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/addList", async (req, res) => {
  const { name } = req.body;
  try {
    const existingList = await mailList.findOne();

    if (!existingList) {
      return res.status(404).json({ message: "List not found" });
    }

    existingList.mailList.push(name);
    const updatedList = await existingList.save();

    res.json(updatedList);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/deleteList", async (req, res) => {
  const { name } = req.body;

  try {
    const existingList = await mailList.findOne();

    if (!existingList) {
      return res.status(404).json({ message: "List not found" });
    }

    existingList.mailList = existingList.mailList.filter(
      (mail) => mail !== name
    );
    const updatedList = await existingList.save();

    res.status(200).json({ message: "The list " + name + " is deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
