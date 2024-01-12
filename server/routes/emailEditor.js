const express = require("express");
const cheerio = require("cheerio");
const { PlannedEmail, Design, Email } = require("../model/emailEditor");
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
    res.status(500).json({ error: "Internal server error" });
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
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/sendEmail", async (req, res) => {
  const id = req.body.id;
  const html = req.body.html;
  const subscribers = req.body.subscribers;
  const subject = req.body.subject;
  const showHeader = req.body.showHeader;
  const headerText = req.body.headerText;

  try {
    const existingHtml = await Email.findOneAndUpdate(
      { id },
      { html, subscribers, subject, showHeader, headerText },
      { upsert: true, new: true }
    );

    if (existingHtml) {
      res.status(200).send("Design updated successfully");
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/getEmail/:id", async (req, res) => {
  try {
    let email = await Email.findOne({ id: req.params.id });

    if (!email) {
      email = await PlannedEmail.findOne({ id: req.params.id });
    }

    if (email) {
      const $ = cheerio.load(email.html);
      const bodyBackground = $("body").css("background-color");

      const textColor = getReadableTextColor(bodyBackground);

      res.json({
        email: email,
        bodyBackground: bodyBackground,
        textColor: textColor,
      });
    } else {
      res.status(404).json({ error: "Email not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/subscribers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const email = await Email.findOne({ "subscribers._id": id });
    if (email) {
      const subscriber = email.subscribers.find(
        (sub) => sub._id.toString() === id
      );
      res.status(200).send(subscriber);
    } else {
      res.status(404).send({ message: "Subscriber not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

function getReadableTextColor(bodyBackground) {
  const rgbColor = () => {
    if (bodyBackground == "transparent") {
      return "rgb(255, 255, 255)";
    } else {
      return hexToRgb(bodyBackground);
    }
  };

  switch (rgbColor()) {
    case "rgb(255, 255, 255)":
      return "#282828";
    case "rgb(0, 0, 0)":
      return "#ffffff";
    default:
      const luminance = calculateLuminance(rgbColor());
      return luminance > 0.5 ? "#282828" : "#ffffff";
  }
}

function calculateLuminance(rgbColor) {
  const rgbArray = rgbColor.match(/\d+/g).map(Number);
  const [r, g, b] = rgbArray.map((value) => {
    value /= 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hexColor) {
  const hex = hexColor.replace(
    /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
    (m, r, g, b) => {
      return "#" + r + r + g + g + b + b;
    }
  );

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )})`
    : null;
}

module.exports = router;
