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

module.exports = { Subscriber, Unsubscriber };
