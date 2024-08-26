const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { getCurrentUser, updateUserData } = require("../controllers/users");
const { updateUser } = require("../middlewares/validation");

router.get("/me", auth, getCurrentUser);
router.patch("/me", updateUser, updateUserData);

module.exports = router;
