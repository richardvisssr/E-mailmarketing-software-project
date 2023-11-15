const express = require("express");
const { Image, Design } = require("../model/emailEditor");
const router = express.Router();

router.get("/loadDesign/:id", async (req, res) => {
  try {
    const design = await Design.findOne({ id: req.params.id });

    res.json(design.design);
  } catch (error) {
    console.error("Error loading design:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/saveDesign", async (req, res) => {
  const id = req.body.body.id;
  const design = req.body;

  try {
    const existingDesign = await Design.findOne({ id });

    if (existingDesign) {
      // Update existing design
      existingDesign.design = design;
      await existingDesign.save();
      res.status(200).send("Design updated successfully");
    } else {
      // Create a new design
      const newDesign = new Design({ id, design });
      await newDesign.save();
      res.status(200).send("Design saved successfully");
    }
  } catch (error) {
    console.error("Error saving design:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/saveImage", async (req, res) => {
  try {
    const { image } = req.body;
    // Sla de afbeelding op in de database
    const savedImage = await Image.create({ dataUrl: image });
    res.json({ success: true, savedImage });
  } catch (error) {
    console.error("Fout bij opslaan van de afbeelding:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
