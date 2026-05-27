const mongoose = require("mongoose");

const InventoryItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String },
  sku: { type: String },
  stock: { type: Number, default: 0 },
  unitPrice: { type: Number, default: 0 },
  totalValue: { type: Number, default: 0 },
  supplier: { type: String },
  reorderLevel: { type: Number, default: 5 },
  status: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("InventoryItem", InventoryItemSchema);
