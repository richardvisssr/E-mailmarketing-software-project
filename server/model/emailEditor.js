const mongoose = require("../utils/connection");

const designSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  design: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
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

const plannedEmailSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    require: true,
  },
  html: {
    type: String,
    required: false,
  },
  subscribers: {
    type: Array,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const PlannedEmail = mongoose.model("PlannedEmail", plannedEmailSchema);

const Email = mongoose.model("Email", emailSchema);

const Design = mongoose.model("Design", designSchema);

module.exports = { Design, Email, PlannedEmail };
