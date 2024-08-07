const router = require("express").Router();
const clothingItem = require("./clothingItem");
const userRouter = require("./users");
const NotFoundError = require("../errors/NotFoundError");
const { login, createUser } = require("../controllers/users");
const { auth } = require("../middlewares/auth");
const {
  validateReturningUser,
  validateNewUser,
} = require("../middlewares/validation");

router.post("/signin", validateReturningUser, login);
router.post("/signup", validateNewUser, createUser);
router.use("/users", userRouter);
router.use("/items", clothingItem);

router.use((req, res, next) => {
  console.log(req);
  next(new NotFoundError("Router not found"));
});

module.exports = router;
