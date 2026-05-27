const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String },
  department: { type: String },
  status: { type: String },
  salary: { type: Number },
  joinDate: { type: String },
  phone: { type: String },
  avatar: { type: String },
  type: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Employee", EmployeeSchema);
