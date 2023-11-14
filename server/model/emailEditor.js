const mongoose = require("../utils/connection");

const imageSchema = new mongoose.Schema({
  dataUrl: String,
});

const designSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  design: {
    type: Object,
    required: true,
  },
});

const Design = mongoose.model("Design", designSchema);

const Image = mongoose.model("Image", imageSchema);

module.exports = { Image, Design };
