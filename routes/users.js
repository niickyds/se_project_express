const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { getCurrentUser, updateUserData } = require("../controllers/users");

router.use(auth);
router.get("/me", getCurrentUser);
router.patch("/me", auth, updateUserData);

module.exports = router;
