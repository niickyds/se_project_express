require("dotenv").config();

const { JWT_SECRET = "not secret" } = process.env;

module.exports = { JWT_SECRET };
