const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { PORT = 3001 } = process.env;
const mainRouter = require("./routes/index");
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use("/", mainRouter); // from index.js; acts as baseline route for routes/users.js
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to database");
  })
  .catch(console.error);

app.listen(PORT, () => {
  console.log(`server working ${PORT}`);
});
