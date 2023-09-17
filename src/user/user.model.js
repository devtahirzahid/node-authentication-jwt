let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "email required"],
    unique: [true, "email already registered"],
  },
  name: String,
  password: String,
});

var userModel = mongoose.model("user", userSchema, "user");

module.exports = userModel;