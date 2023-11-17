const mongoose = require("mongoose");

const subscribers = new mongoose.schema({
  email: {
    type: String,
    required: true,
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

const unsubscribe = new mongoose.schema({
  reden: {
    type: String,
    required: false,
  },
});

const Subscriber = mongoose.model("Subscriber", subscribers);
const Unsubscribe = mongoose.model("Unsubscribe", unsubscribe);

module.exports = { Subscriber, Unsubscribe };
