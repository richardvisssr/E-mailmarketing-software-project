const express = require("express");
const mailList = require("../model/mailList");
const router = express.Router();

router.get("/getList", async (req, res) => {
  const masterKeyFromCookies = req.cookies.masterKey;
  const userKeyCookies = req.cookies.userKey;

  if (
    (!masterKeyFromCookies && !userKeyCookies) ||
    (masterKeyFromCookies !== undefined &&
      masterKeyFromCookies !== req.session.masterKey) ||
    (userKeyCookies !== undefined && userKeyCookies !== req.session.userKey)
  ) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  } else {
    try {
      const subscriptions = await mailList.find();
      res.json(subscriptions);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

router.put("/addList", async (req, res) => {
  const masterKeyFromCookies = req.cookies.masterKey;
  if (!masterKeyFromCookies || masterKeyFromCookies !== req.session.masterKey) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  } else {
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
  }
});

router.put("/updateListName", async (req, res) => {
  const masterKeyFromCookies = req.cookies.masterKey;
  if (!masterKeyFromCookies || masterKeyFromCookies !== req.session.masterKey) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  } else {
    const { name, newName } = req.body;

    try {
      const existingList = await mailList.findOne({ mailList: name });

      if (!existingList) {
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
      await existingList.save();

      res
        .status(200)
        .json({ message: "The list " + name + " is updated to " + newName });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

router.delete("/deleteList", async (req, res) => {
  const masterKeyFromCookies = req.cookies.masterKey;
  if (!masterKeyFromCookies || masterKeyFromCookies !== req.session.masterKey) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  } else {
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
  }
});

module.exports = router;
