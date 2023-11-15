"use strict";

const express = require("express");

const router = express.Router();

const Subscriber = require("../model/Subscriber");

router.post("subscribers/add", async (req, res, next) => {
    try {
        const { email, lijst } = req.body;
        const subscriber = {
            email,
            lijst,
        }
        Subscriber.push(subscriber);
        Subscriber.save();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;