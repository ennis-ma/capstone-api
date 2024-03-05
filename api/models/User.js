const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  name: String,
  password: String,
  email: String,
  createdAt: String,
  accessLevel: String,
  accessToken: String,
});

module.exports = model("User", userSchema);
