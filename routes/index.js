const router = require("express").Router();
const clothingItem = require("../routes/clothingItem");
const userRouter = require("../routes/users");

router.use("/users", userRouter);
router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(500).send({ message: "Router not found" });
});

module.exports = router;

// will use this in users.js to remove redundant "/users" links
