const mongoose = require("../utils/connection");

const subscribers = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: false,
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
});

const Subscriber = mongoose.model("Subscriber", subscribers);
const Unsubscriber = mongoose.model("Unsubscribe", unsubscribe);

// const sub = new Subscriber({
//   email: "Mattt@jfc.nl",
//   name: "Beccrt",
//   subscription: ["CMD", "Nieuwsbrief"],
// });

// sub.save();

module.exports = { Subscriber, Unsubscriber };
