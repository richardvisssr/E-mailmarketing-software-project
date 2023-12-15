const { uid } = require("uid/secure");
const express = require("express");
const router = express.Router();
const { Design, Email } = require("../model/emailEditor");

router.post("/login", async (req, res) => {
  if (req.session.masterKey) {
    res.status(200).send({ success: true, masterKey: req.session.masterKey });
    return;
  }
  const masterKey = uid(20);
  req.session.masterKey = masterKey;
  res.cookie("masterKey", masterKey, { maxAge: 86400000, httpOnly: true });

  res.status(200).send({ success: true, masterKey: masterKey });
});

router.get("/templates", async (req, res) => {
  const masterKeyFromCookies = req.cookies.masterKey;
  if (!masterKeyFromCookies || masterKeyFromCookies !== req.session.masterKey) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  } else {
    try {
      const designs = await Design.find();

      res.json(designs);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

router.get("/templates/:id", async (req, res) => {
  const masterKeyFromCookies = req.cookies.masterKey;
  if (!masterKeyFromCookies || masterKeyFromCookies !== req.session.masterKey) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  } else {
    try {
      const email = await Email.findOne({ id: req.params.id });

      if (email) {
        res.json(email);
      } else {
        res.status(404).json({ error: "Email not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

router.delete("/template/:id", async (req, res) => {
  const masterKeyFromCookies = req.cookies.masterKey;
  if (!masterKeyFromCookies || masterKeyFromCookies !== req.session.masterKey) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  } else {
    try {
      const design = await Design.findOneAndDelete({ id: req.params.id });
      const email = await Email.findOneAndDelete({ id: req.params.id });
      if (design && email) {
        res.status(200).send({ success: true });
      } else {
        res.status(404).send({ message: "Design or email not found" });
      }
    } catch (error) {
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
});

module.exports = router;
