const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

// Create
router.post("/", createItem);

// Read
router.get("/", getItems);

// Update
router.put("/:itemId", updateItem);

// Delete
router.delete("/:itemId", deleteItem);

// Like
router.put("/:itemId/likes", likeItem);

// dislike
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
