const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  label: { type: String },
  party: { type: String },
  amount: { type: Number },
  type: { type: String }, // 'income' or 'expense'
  category: { type: String },
  date: { type: String },
  status: { type: String },
  paymentMethod: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", TransactionSchema);
