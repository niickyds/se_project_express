const mongoose = require("mongoose");

const clothingSchema = new mongoose.Schema({});

module.exports = mongoose.model("item", clothingSchema);
