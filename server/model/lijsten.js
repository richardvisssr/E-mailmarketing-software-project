const mongoose = require("mongoose");

const lijst = new mongoose.Schema({
    namen: {
        type: [String],
        required: true,
    }
});

const Lijst = mongoose.model("Lijst", lijst);

module.exports = { Lijst };