const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { getCurrentUser, updateUserData } = require("../controllers/users");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUserData);

module.exports = router;
