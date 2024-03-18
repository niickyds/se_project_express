const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { getCurrentUser } = require("../controllers/users");
// const { getUsers, createUser, getUser } = require("../controllers/users");

// router.get("/", getUsers);
// router.get("/:userId", getUser);
// router.post("/", createUser);
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateUserData);

module.exports = router;
