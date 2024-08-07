const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  BadRequestError,
  NotFoundError,
  ServerError,
  ConflictError,
  UnauthorizedError,
} = require("../utils/errors");

// Create User

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body; // has the info that's sent in body of req

  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, avatar, email, password: hash })
      .then((user) => {
        res.send({ name: user.name, avatar: user.avatar, email: user.email });
        if (!email) {
          throw new Error({ message: "Duplicate email" });
        }
      })
      .catch((err) => {
        console.error(err);
        if (err.code === 11000) {
          return res.status(ConflictError).send({ message: "Duplicate user" });
        }
        if (err.name === "ValidationError") {
          return res.status(BadRequestError).send({ message: "Invalid data" });
        } else {
          next(err);
        }
      });
  });
};

// Login

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(BadRequestError).send({ message: "Invalid data" });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.log(err);
      if (err.message === "Incorrect email or password") {
        return res
          .status(UnauthorizedError)
          .send({ message: "User data not found" });
      } else {
        next(err);
      }
    });
};

// Get Current User

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => {
      console.log(user);
      res.send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "CastError") {
        return res.status(BadRequestError).send({ message: "Invalid data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NotFoundError)
          .send({ message: "Cannot find user with that id" });
      } else {
        next(err);
      }
    });
};

const updateUserData = (req, res) => {
  const { name, avatar } = req.body;

  User.findOneAndUpdate(
    { _id: req.user._id },
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NotFoundError).send({ message: "Cannot find user" });
      }
      if (err.name === "ValidationError") {
        return res.status(BadRequestError).send({ message: "Invalid data" });
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUserData,
};
