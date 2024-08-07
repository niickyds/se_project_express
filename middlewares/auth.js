const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/UnauthorizedError");

const auth = (req, res, next) => {
  console.log("auth test");
  const { authorization } = req.headers;
  console.log(authorization);

  if (!authorization || !authorization.startsWith("Bearer")) {
    console.error("Authorization header is missing", authorization);
    return next(new UnauthorizedError("Authorization Required"));
  }

  const token = authorization.replace("Bearer", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError("Authorization Required"));
  }

  console.log(payload);
  req.user = payload;
  return next();
};

module.exports = { auth };
