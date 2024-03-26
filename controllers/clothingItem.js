const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  ServerError,
  ForbiddenError,
} = require("../utils/errors");

const createItem = (req, res) => {
  const userId = req.user._id;
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: userId })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError") {
        return res.status(BadRequestError).send({ message: "Invalid Data" });
      }
      return res
        .status(ServerError)
        .send({ message: "An error has occurred on the server." });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(() =>
      res
        .status(ServerError)
        .send({ message: "An error has occurred on the server." }),
    );
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        return res
          .status(ForbiddenError)
          .send({ message: "Unauthorized Request" });
      }
      return item.deleteOne(req.params.itemId).then((user) => {
        res.send(user);
      });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "CastError") {
        return res.status(BadRequestError).send({ message: "Invalid Data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NotFoundError).send({ message: "Not Found" });
      }
      return res
        .status(ServerError)
        .send({ message: "An error has occurred on the server." });
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
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BadRequestError).send({ message: "Invalid Data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NotFoundError).send({ message: "Not Found" });
      }
      return res
        .status(ServerError)
        .send({ message: "An error has occurred on the server." });
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
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BadRequestError).send({ message: "Invalid Data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NotFoundError).send({ message: "Not Found" });
      }
      return res
        .status(ServerError)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
