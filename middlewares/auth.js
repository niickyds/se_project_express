const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../utils/errors");

const extractToken = (header) => header.replace("Bearer ", "");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    console.error("Authorization header is missing");
    return res.status(UnauthorizedError).send({ message: "User Unauthorized" });
  }
  const token = extractToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    return res
      .status(UnauthorizedError)
      .send({ message: "Authorization Required" });
  }
  req.user = payload;
  return next();
};

module.exports = auth;
