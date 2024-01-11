const express = require("express");
const mailList = require("../model/mailList");
const { Category } = require("../model/subscribers");
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

    // await Category.create({ name: name });
    res.json(updatedList);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/updateListName", async (req, res) => {
  const { name, newName } = req.body;

  try {
    const existingList = await mailList.findOne({ mailList: name });

    if (!existingList) {
      console.log("No existing list");
      return res.status(404).json({ message: "List not found" });
    }

    if (newName === "") {
      return res.status(400).json({ message: "New name is empty" });
    }

    if (newName === name) {
      return res.status(400).json({ message: "New name is the same" });
    }

    if (existingList.mailList.includes(newName)) {
      return res.status(400).json({ message: "New name already exists" });
    }

    if (newName.trim() !== newName) {
      return res.status(400).json({ message: "New name contains spaces" });
    }

    existingList.mailList = existingList.mailList.map((mail) =>
      mail === name ? newName : mail
    );

    const list = await Category.findOne({ name: name }); // DIT GAAT FOUT

    if (!list) {
      console.log("No list");
      return res.status(404).json({ message: "List not found" });
    }
    list.name = newName;

    await list.save();
    await existingList.save();

    res
      .status(200)
      .json({ message: "The list " + name + " is updated to " + newName });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/deleteList", async (req, res) => {
  const { name } = req.body;

  try {
    const existingList = await mailList.findOne({ mailList: name });

    if (!existingList) {
      return res.status(404).json({ message: "List not found" });
    }

    existingList.mailList = existingList.mailList.filter(
      (mail) => mail !== name
    );
    await existingList.save();

    res.status(200).json({ message: "The list " + name + " is deleted" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
