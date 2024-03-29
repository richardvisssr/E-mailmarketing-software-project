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
  headerText: {
    type: String,
    required: false,
  },
  html: {
    type: String,
    required: true,
  },
  subscribers: {
    type: Array,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  showHeader: {
    type: Boolean,
    required: true,
  },
});

const plannedEmailSchema = new mongoose.Schema({
  mailId: {
    type: String,
    required: true,
  },
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
  sent: {
    type: Boolean,
    required: true,
  },
  showHeader: {
    type: Boolean,
    required: true,
  },
  headerText: {
    type: String,
    required: false,
  },
  subject: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Verzonden", "In afwachting", "Mislukt"],
    default: "In afwachting",
  },
});

const PlannedEmail = mongoose.model("PlannedEmail", plannedEmailSchema);

const Email = mongoose.model("Email", emailSchema);

const Design = mongoose.model("Design", designSchema);

module.exports = { Design, Email, PlannedEmail };
