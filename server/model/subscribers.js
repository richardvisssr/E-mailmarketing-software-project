const mongoose = require("../utils/connection");

const subscribers = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  naam: {
    type: String,
    required: false,
  },
  abonnement: {
    type: [String],
    required: true,
  },
});

const unsubscribe = new mongoose.Schema({
  reden: {
    type: String,
    required: false,
  },
});

const Subscriber = mongoose.model("Subscriber", subscribers);
const Unsubscriber = mongoose.model("Unsubscribe", unsubscribe);

// const mat = new Subscriber({
//   email: "Mat@mat.nl",
//   naam: "Mat",
//   abonnement: ["NRC", "Volkskrant"],
// });

// mat.save();

module.exports = { Subscriber, Unsubscriber };
