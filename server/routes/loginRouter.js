const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const secretKey = "eyJzdWIiOiJ1c2VyMTIzNDUiLCJpYXQiOjE3MDI4ODczNjAsImV4cCI6MT";

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
    exp: Math.floor(Date.now() / 1000) + 60 * 5,
  };

  return jwt.sign(payload, secretKey);
}

router.post("/login", async (req, res) => {
  const token = generateAccessToken("user12345");
  // if (req.session.masterKey) {
  //   res.status(200).send({ success: true, masterKey: req.session.masterKey });
  //   return;
  // }

  // const masterKey = uid(20);
  // req.session.masterKey = masterKey;
  // res.cookie("masterKey", masterKey, { maxAge: 86400000, httpOnly: true });

  res.status(200).send({ success: true, token: token });
});

router.get("/tempAuth", (req, res) => {
    const token = generateTempAccessToken("user12345");
    res.status(200).send({ success: true, token: token });
});

module.exports = router;