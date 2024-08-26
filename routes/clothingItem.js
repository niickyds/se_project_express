const router = require("express").Router();
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");
const { validateItemCreate, validateId } = require("../middlewares/validation");

router.get("/", getItems);

router.post("/", validateItemCreate, createItem);

router.delete("/:itemId", validateId, deleteItem);

router.put("/:itemId/likes", validateId, likeItem);

router.delete("/:itemId/likes", validateId, dislikeItem);

module.exports = router;
