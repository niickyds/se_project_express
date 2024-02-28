const express = require("express");

const app = express();
const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;
const mainRouter = require("./routes/index");

app.use((req, res, next) => {
  req.user = {
    _id: "65ce1d6d932064d3e16141ac", // paste the _id of the test user created in the previous step
  };
  next();
});

const routes = require("./routes");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to database");
  })
  .catch(console.error);

app.use(express.json());
app.use("/", mainRouter); // from index.js; acts as baseline route for routes/users.js

app.listen(PORT, () => {
  console.log(`server working ${PORT}`);
});
