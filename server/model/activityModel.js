const mongoose = require("../utils/connection");

const activitySchema = new mongoose.Schema({
    device: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    ip: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
});

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    secret: {
        type: String,
        required: true,
    },
});

const Token = mongoose.model("token", tokenSchema);

const Activity = mongoose.model("activity", activitySchema);

module.exports = { Activity, Token };