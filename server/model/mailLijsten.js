const mongoose = require("../utils/connection");

// Define schema for mailing list schedule
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
