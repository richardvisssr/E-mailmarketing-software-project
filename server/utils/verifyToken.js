const { Token } = require("../model/activityModel");

const jwt = require("jsonwebtoken");
const secretKey = "z576lkp4tMzGqP0KOINOE+De3ajsPJChBk+bhJ9XoxF9VJG4E0Da+g==";

async function verifyToken(req, res, next) {
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
    res.status(401).send({ message: "Unauthorized: invalid token format" });
    return;
  }

  const token = tokenHeader.split(" ")[1];
  const dbToken = await Token.findOne({ token: token });

  if (!token) {
    res.status(401).send({ message: "Unauthorized: token missing" });
    return;
  }

  if (!dbToken) {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        res.status(401).send({ message: "Unauthorized: invalid token" });
        return;
      }

      req.userId = decoded.sub;
      next();
    });
  } else {
    jwt.verify(token, dbToken.secret, (err, decoded) => {
      if (err) {
        res.status(401).send({ message: "Unauthorized: invalid token" });
        return;
      }

      req.userId = decoded.sub;
      next();
    });
  }
}

module.exports = verifyToken;
