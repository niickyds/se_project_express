const router = require("express").Router();

const userRouter = require("./users");

router.use("/users", userRouter);

module.exports = router;

// will use this in users.js to remove redundant "/users" links
