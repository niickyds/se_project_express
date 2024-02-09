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

module.exports = { createItem };
