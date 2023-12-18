const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const secretKey = "z576lkp4tMzGqP0KOINOE+De3ajsPJChBk+bhJ9XoxF9VJG4E0Da+g==";
const config = require("../../config/config.json");

const { Activity } = require("../model/activityModel");

function generateAccessToken(id) {
  const payload = {
    sub: id,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  return jwt.sign(payload, secretKey);
}

function generateTempAccessToken(id) {
  const payload = {
    sub: id,
    iat: Math.floor(Date.now() / 1000),
    exp: JSON.parse(config.expireTime),
  };

  return jwt.sign(payload, secretKey);
}

router.post("/login", async (req, res) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        const newToken = generateAccessToken("user12345");

        if (JSON.parse(config.enableActivity)) {
          const loginActivity = new Activity({
            device: req.headers["user-agent"],
            location:
              req.headers["x-forwarded-for"] || req.connection.remoteAddress,
            ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
            time: new Date(),
          });

          try {
            loginActivity.save();
          } catch (error) {
            console.error(error);
          }
        }

        return res.status(200).send({ success: true, token: newToken });
      }

      return res.status(200).send({ success: true, token: token });
    });
  } else {
    const token = generateAccessToken("user12345");

    if (JSON.parse(config.enableActivity)) {
      const loginActivity = new Activity({
        device: req.headers["user-agent"],
        location:
          req.headers["x-forwarded-for"] || req.connection.remoteAddress,
        ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
        time: new Date(),
      });

      try {
        loginActivity.save();
      } catch (error) {
        console.error(error);
      }
    }
    return res.status(200).send({ success: true, token: token });
  }
});

router.get("/tempAuth", (req, res) => {
  const token = generateTempAccessToken("user12345");
  res.status(200).send({ success: true, token: token });
});

module.exports = router;
