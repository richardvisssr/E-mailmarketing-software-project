const mongoose = require("../utils/connection");

const templates = new mongoose.Schema({});

const Templates = mongoose.model("Templates", templates);

module.exports = { Templates };
