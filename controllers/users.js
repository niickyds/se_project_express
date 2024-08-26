const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} = require("../utils/errors");

// Create User

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body; // has the info that's sent in body of req

  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, avatar, email, password: hash })
      .then((user) => {
        res.send({ name: user.name, avatar: user.avatar, email: user.email });
      })
      .catch((err) => {
        console.error(err);
        if (err.code === 11000) {
          return next(new ConflictError("Duplicate user"));
        }
        if (err.name === "ValidationError") {
          return next(new BadRequestError("Invalid data"));
        } else {
          next(err);
        }
      });
  });
};

// Login

const login = (req, res, next) => {
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
        return next(new UnauthorizedError("User data not found"));
      } else {
        next(err);
      }
    });
};

// Get Current User

const getCurrentUser = (req, res, next) => {
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
        return next(new BadRequestError("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Cannot find user with that id"));
      } else {
        next(err);
      }
    });
};

const updateUserData = (req, res, next) => {
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
        return next(new NotFoundError("Cannot find user with that id"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
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
