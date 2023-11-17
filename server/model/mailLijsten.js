const mongoose = require("../utils/connection");

const mailLijstSchema = new mongoose.Schema({
  mailLijst: {
    type: [String],
    required: true,
  },
});

const mailLijst = mongoose.model("mailLijst", mailLijstSchema);

// const addMailLijst = new mailLijst({
//   mailLijst: ["Nieuwsbrief", "CMD", "ICT", "Leden"],
// });

// addMailLijst.save();

module.exports = mailLijst;
