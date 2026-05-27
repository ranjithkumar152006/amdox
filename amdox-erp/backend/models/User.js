const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String },
  phone: { type: String },
  status: { type: String, default: "Active" },
  lastLogin: { type: String },
  avatar: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
