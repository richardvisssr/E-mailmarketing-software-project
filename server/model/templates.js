const mongoose = require("mongoose");

const templates = new mongoose.schema({});

const Templates = mongoose.model("Templates", templates);

module.exports = { Templates };
