const mongoose = require('../utils/connection');

const imageSchema = new mongoose.Schema({
    dataUrl: String,
  });

const designSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  design: {
    type: Object,
    required: true
  }
});

const emailSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  html: {
    type: String,
    required: true,
  },
});

const Email = mongoose.model('Email', emailSchema);

const Design = mongoose.model('Design', designSchema);


const Image = mongoose.model('Image', imageSchema);

module.exports = { Image, Design, Email };


