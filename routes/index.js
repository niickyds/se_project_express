const router = require("express").Router();
const clothingItem = require("./clothingItem");
const userRouter = require("./users");
const { NotFoundError } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");

router.post("/signin", login);
router.post("/signup", createUser);
router.use("/users", userRouter);
router.use("/items", clothingItem);

// router.use((req, res) => {
//   console.log("Default route hit");
//   res.status(404).json({ message: "Router not found" });
// });

router.use((req, res, next) => {
  console.log(req);
  next(new NotFoundError("User not found"));
  // res.status(NotFoundError).send({ message: "Router not found" });
});

module.exports = router;
