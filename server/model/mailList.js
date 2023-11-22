const mongoose = require("../utils/connection");

const mailListSchema = new mongoose.Schema({
  mailList: {
    type: [String],
    required: true,
  },
});

// const mailList = mongoose.model("mailList", mailListSchema);

// const addMailList = new mailList({
//   mailList: ["Nieuwsbrief", "CMD", "ICT", "Leden"],
// });

// addMailList.save();

module.exports = mailList;
