const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String },
  bank: { type: String },
  accNo: { type: String },
  balance: { type: Number },
  type: { type: String },
  status: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Account", AccountSchema);
