const User = require("../models/user");
const {
  BadRequestError,
  NotFoundError,
  ServerError,
} = require("../utils/errors");

// get users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.log(err);
      return res
        .status(ServerError)
        .send({ message: "An error has occurred on the server." });
    });
};

// create user

const createUser = (req, res) => {
  const { name, avatar } = req.body; // has the info that's sent in body of req

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      // catch if validation fails (ex. name requires 2 => put 1)
      if (err.name === "ValidationError") {
        return res.status(BadRequestError).send({ message: "Invalid data" });
      }
      return res
        .status(ServerError)
        .send({ message: "An error has occurred on the server." });
    });
};

// get user by id

const getUser = (req, res) => {
  const { userId } = req.params; // userId is loaded in params; not body (/routes/users)

  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NotFoundError)
          .send({ message: "Cannot find item with that id" });
      }
      if (err.name === "CastError") {
        return res.status(BadRequestError).send({ message: "Bad request" });
      }
      return res
        .status(ServerError)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = { getUsers, createUser, getUser };
