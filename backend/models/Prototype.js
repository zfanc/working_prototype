const mongoose = require("mongoose");

const prototypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, "Please provide a price"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
  },
});

const Prototype = mongoose.model("Prototype", prototypeSchema);

module.exports = Prototype;
