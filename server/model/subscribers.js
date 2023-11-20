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
  subscription: {
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

// const sub = new Subscriber({
//   email: "befibu@jfc.nl",
//   naam: "Bert",
//   abonnement: ["Nieuwsbrief", "CMD"],
// });

// sub.save();

module.exports = { Subscriber, Unsubscriber };
