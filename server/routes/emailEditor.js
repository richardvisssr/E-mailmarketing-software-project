const express = require("express");
const { Image, Design } = require("../model/emailEditor");
const router = express.Router();

router.get("/loadDesign/:id", async (req, res) => {
  try {
    const design = await Design.findById(req.params.id); // Get the design with the specified ID
    res.json(design.design);
  } catch (error) {
    console.error("Error loading design:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/saveDesign", async (req, res) => {
  const design = new Design({
    id: req.body.body.id,
    design: req.body,
  });

  try {
    await design.save();
    res.status(200).send("Design saved successfully");
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
