const express = require("express");
const { Design, Email } = require("../model/emailEditor");
const router = express.Router();

router.get("/loadDesign/:id", async (req, res) => {
  try {
    const design = await Design.findOne({ id: req.params.id });

    const responseData = {
      design: design.design,
      title: design.title,
    };

    res.json(responseData);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.put("/saveDesign", async (req, res) => {
  const id = req.body.id;
  const design = req.body.design;
  const title = req.body.title;

  try {
    const existingDesign = await Design.findOne({ id });
    if (existingDesign) {
      existingDesign.design = design;
      await existingDesign.save();
      res.status(200).send("Design updated successfully");
    } else {
      const newDesign = new Design({ id, design, title });
      await newDesign.save();
      res.status(200).send("Design saved successfully");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.put("/sendEmail", async (req, res) => {
  const id = req.body.id;
  const html = req.body.html;
  const subscribers = req.body.subscribers;
  try {
    const existingHtml = await Email.findOneAndUpdate(
      { id },
      { html, subscribers },
      { upsert: true, new: true }
    );
    res.status(200).send("Design saved successfully");
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/getEmail/:id", async (req, res) => {
  try {
    const email = await Email.findOne({ id: req.params.id });
    res.json(email);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/subscribers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const email = await Email.findOne({ 'subscribers._id': id });
    if (email) {
      const subscriber = email.subscribers.find(sub => sub._id.toString() === id);
      res.status(200).send(subscriber);
    } else {
      res.status(404).send({ message: "Subscriber not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = router;
