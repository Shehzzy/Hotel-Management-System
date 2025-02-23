const mongoose = require("mongoose");
import bcrypt from "bcryptjs";

var userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  var salt = await bcrypt.genSalt(10);
  var hashPassword = await bcrypt.hash(salt, this.password);
  this.password = hashPassword;
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

var userModel = mongoose.model("Users", userSchema);

module.exports = userModel;
