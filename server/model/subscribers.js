const mongoose = require("../utils/connection");

const subscribers = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  subscription: {
    type: [String],
    required: true,
  },
});

const unsubscribe = new mongoose.Schema({
  reason: {
    type: String,
    required: false,
  },
  count: {
    type: Number,
    required: true,
  },
});

const categories = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    required: true,
  },
});

const Subscriber = mongoose.model("Subscriber", subscribers);
const Unsubscriber = mongoose.model("Unsubscribe", unsubscribe);
const Category = mongoose.model("Category", categories);

// const sub = new Subscriber({
//   email: "Maaadddtt@jfc.nl",
//   name: "Beccrt",
//   subscription: ["ICT", "CMD", "Leden"],
// });

// sub.save();

const checkData = async (req, res, next) => {
  const count = await Category.countDocuments({});

  if (count === 0) {
    const updateICT = new Category({
      name: "ICT",
      count: 0,
    });

    const updateCMD = new Category({
      name: "CMD",
      count: 0,
    });

    const updateLeden = new Category({
      name: "Leden",
      count: 0,
    });

    const updateNieuwsbrief = new Category({
      name: "Nieuwsbrief",
      count: 0,
    });

    await updateICT.save();
    await updateCMD.save();
    await updateLeden.save();
    await updateNieuwsbrief.save();
  }
};

checkData();

module.exports = { Subscriber, Unsubscriber, Category };
