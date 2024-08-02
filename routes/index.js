const router = require("express").Router();
const clothingItem = require("./clothingItem");
const userRouter = require("./users");
const NotFoundError = require("../errors/NotFoundError");
const { login, createUser } = require("../controllers/users");
const signRouter = require("./sign");

router.post("/signin", login);
router.post("/signup", createUser);
router.use("/users", userRouter);
router.use("/items", clothingItem);

router.use("/", signRouter);

// router.use((req, res) => {
//   console.log("Default route hit");
//   res.status(404).json({ message: "Router not found" });
// });

router.use((req, res, next) => {
  console.log(req);
  next(new NotFoundError("Router not found"));
});

module.exports = router;
