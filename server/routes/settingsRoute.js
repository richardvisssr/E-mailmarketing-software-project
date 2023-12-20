const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { Activity, Token } = require("../model/activityModel");

function transformToMiliseconds(minutes) {
  if (minutes === undefined || minutes === null) return null;
  return minutes * 60000;
}

const generateRandomSecret = (length) => {
  return crypto.randomBytes(length).toString("base64");
};

function generateApiKey(secretKey) {
  const payload = {
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 * 3,
  };

  return jwt.sign(payload, secretKey);
}

router.put("/settings", async (req, res) => {
  try {
    const configFilePath = path.join(__dirname, "../../config/config.json");
    const config = require.resolve(configFilePath);
    const currentConfig = require(config);

    const { intervalTime, expirationTime, activityLog } = req.body;
    currentConfig.updateInterval =
      transformToMiliseconds(intervalTime) || currentConfig.updateInterval;
    currentConfig.expireTime =
      transformToMiliseconds(expirationTime) || currentConfig.expireTime;
    currentConfig.enableActivity = activityLog;

    fs.writeFileSync(config, JSON.stringify(currentConfig, null, 2));

    res.status(200).send({ message: "Settings updated" });
  } catch (error) {
    res.status(500).send({ message: "Error updating settings" });
  }
});

router.get("/settings", async (req, res) => {
  try {
    const configFilePath = path.join(__dirname, "../../config/config.json");
    const config = require.resolve(configFilePath);
    const currentConfig = require(config);

    res.status(200).send({
      intervalTime: currentConfig.updateInterval / 60000,
      expirationTime: currentConfig.expireTime / 60000,
      activityLog: currentConfig.enableActivity,
    });
  } catch (error) {
    res.status(500).send({ message: "Error getting settings" });
  }
});

router.get("/activity", async (req, res) => {
  try {
    const activities = await Activity.find();
    res.status(200).send(activities);
  } catch (error) {
    res.status(500).send({ message: "Error getting activities" });
  }
});

router.post("/generateToken", async (req, res) => {
  try {
    const existingToken = await Token.findOne();

    const secret = generateRandomSecret(40);
    const token = generateApiKey(secret);

    if (existingToken) {
      existingToken.token = token;
      existingToken.secret = secret;
      await existingToken.save();
    } else {
      const newToken = new Token({
        token: token,
        secret: secret,
      });

      await newToken.save();
    }

    res.status(200).send({ token: token, secret: secret });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error generating token" });
  }
});

router.get("/generateToken", async (req, res) => {
  try {
    const existingToken = await Token.findOne();

    if (existingToken) {
      res
        .status(200)
        .send({ token: existingToken.token, secret: existingToken.secret });
    } else {
      res.status(200).send({ token: null, secret: null });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error generating token" });
  }
});

module.exports = router;
