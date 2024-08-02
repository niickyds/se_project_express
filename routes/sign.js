const router = require("express").Router();
const { createUser, login } = require("../controllers/users");
const {
  validateReturningUser,
  validateNewUser,
} = require("../middlewares/validation");

router.post("/signin", validateReturningUser, login);
router.post("/signup", validateNewUser, createUser);

module.exports = router;
