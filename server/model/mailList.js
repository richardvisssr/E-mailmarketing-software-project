const mongoose = require("../utils/connection");

const mailListSchema = new mongoose.Schema({
  mailList: {
    type: [String],
    required: true,
  },
});

const mailList = mongoose.model("mailList", mailListSchema);

const defaultMailList = ["Nieuwsbrief", "CMD", "ICT", "Leden"];

const checkMailList = async () => {
  try {
    const count = await mailList.countDocuments({});

    if (count === 0) {
      const newMailList = new mailList({
        mailList: defaultMailList,
      });

      await newMailList.save();
    }
  } catch (err) {
    console.log(err);
  }
};

checkMailList();

module.exports = mailList;
