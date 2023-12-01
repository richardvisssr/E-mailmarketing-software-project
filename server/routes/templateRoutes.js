const express = require("express");
const router = express.Router();
const { Design, Email } = require("../model/emailEditor");

router.get("/templates", async (req, res) => {
  try {
    const designs = await Design.find();

    res.json(designs);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/templates/:id", async (req, res) => {
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
});

router.delete("/template/:id", async (req, res) => {
  try {
    const design = await Design.findOneAndDelete({ id: req.params.id });
    const email = await Email.findOneAndDelete({ id: req.params.id });
    if (design && email) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: "Design or email not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
