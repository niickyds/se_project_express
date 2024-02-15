const ClothingItem = require("../models/clothingItem");

const createItem = (res, req) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageURL } = req.body;

  ClothingItem.create({ name, weather, imageURL })
    .then((item) => {
      console.log(item);
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
      console.log(evt);
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
      console.log(evt);
      return res.status(500).send({ message: "Error from updateItem", evt });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send({}))
    .catch((evt) => {
      console.log(evt);
      return res.status(500).send({ message: "Error from deleteItem", evt });
    });
};

module.exports = { createItem, getItems, updateItem, deleteItem };
