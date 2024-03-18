const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BadRequestError,
  NotFoundError,
  ServerError,
  DuplicateError,
  UnauthorizedError,
} = require("../utils/errors");

// get users

// const getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.send(users))
//     .catch((err) => {
//       console.log(err);
//       return res
//         .status(ServerError)
//         .send({ message: "An error has occurred on the server." });
//     });
// };

// get user by id

// const getUser = (req, res) => {
//   const { userId } = req.params; // userId is loaded in params; not body (/routes/users)

//   User.findById(userId)
//     .orFail()
//     .then((user) => res.send(user))
//     .catch((err) => {
//       console.error(err);
//       if (err.name === "DocumentNotFoundError") {
//         return res
//           .status(NotFoundError)
//           .send({ message: "Cannot find item with that id" });
//       }
//       if (err.name === "CastError") {
//         return res.status(BadRequestError).send({ message: "Bad request" });
//       }
//       return res
//         .status(ServerError)
//         .send({ message: "An error has occurred on the server." });
//     });
// };

// Create User

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body; // has the info that's sent in body of req

  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, avatar, email, password: hash })
      .then((user) => {
        res.send(user);
        if (!email) {
          throw new Error({ message: "Email has already been used" });
        }
      })
      .catch((err) => {
        console.error(err);
        // catch if validation fails (ex. name requires 2 => put 1)
        if (err.name === "ValidationError") {
          return res.status(BadRequestError).send({ message: "Invalid data" });
        }
        if (err.code === 11000) {
          return res
            .status(DuplicateError)
            .send({ message: "User already exists" });
        }
        return res
          .status(ServerError)
          .send({ message: "An error has occurred on the server." });
      });
  });
};

// Login

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send(token);
    })
    .catch((err) => {
      console.log(err);

      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NotFoundError)
          .send({ message: "Cannot find user with that id" });
      }
      if (err.code === "Incorrect email or password") {
        return res
          .status(UnauthorizedError)
          .send({ message: "User data not found" });
      }
      return res
        .status(ServerError)
        .send({ message: "An error has occurred on the server." });
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
      }
      return res
        .status(ServerError)
        .send({ message: "An error has occurred on the server." });
    });
};

const updateUserData = (req, res) => {
  const { name, avatar } = req.body;

  User.findOneAndUpdate(
    { _id: req.user._id },
    { name, avatar },
    { new: true, runValidators: true },
  )
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
      }
      return res
        .status(ServerError)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUserData,
};
