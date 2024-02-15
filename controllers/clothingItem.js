const ClothingItem = require("../models/clothingItem");

const createItem = (res, req) => {
  const userId = req.user._id;
  const { name, weather, imageURL } = req.body;

  ClothingItem.create({ name, weather, imageURL, owner: userId })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: err.message });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((evt) => {
      return res.status(500).send({ message: "Error from getItems", evt });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((evt) => {
      return res.status(500).send({ message: "Error from updateItem", evt });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params._id;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send({}))
    .catch((evt) => {
      return res.status(500).send({ message: "Error from deleteItem", evt });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndUpdate(
    itemId,
    {
      $addToSet: { likes: req.user._id }, // add _id to the array if it's not there yet
    },
    { new: true },
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((evt) => {
      return res.status(500).send({ message: "Error from likeItem", evt });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true },
  )
    .orFail()
    .then((item) => res.status(201).send({ data: item }))
    .catch((evt) => {
      return res.status(500).send({ message: "Error from dislikeItem", evt });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
