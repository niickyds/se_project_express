const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to database");
  })
  .catch(console.error);

app.unsubscribe(express.json());
app.use("/", mainRouter); // from index.js; acts as baseline route for routes/users.js

app.listen(PORT, () => {
  console.log(`server workin ${PORT}`);
});
