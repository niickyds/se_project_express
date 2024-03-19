const router = require("express").Router();
const clothingItem = require("./clothingItem");
const userRouter = require("./users");
const { NotFoundError } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");
const { auth } = require("../middlewares/auth");

router.post("/signin", login);
router.post("/signup", createUser);
router.use("/users", userRouter);
router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(NotFoundError).send({ message: "Router not found" });
});

module.exports = router;
