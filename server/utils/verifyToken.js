const { Token } = require("../model/activityModel");

const jwt = require("jsonwebtoken");
const secretKey = "z576lkp4tMzGqP0KOINOE+De3ajsPJChBk+bhJ9XoxF9VJG4E0Da+g==";

async function verifyToken(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  const dbToken = await Token.findOne({ token: token });
  if (!token && !dbToken) {
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
