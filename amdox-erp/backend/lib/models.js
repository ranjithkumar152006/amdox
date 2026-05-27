const mongoose = require("mongoose");

function flexibleModel(name, collection) {
  if (mongoose.models[name]) return mongoose.models[name];
  const schema = new mongoose.Schema(
    { id: { type: String } },
    { strict: false, timestamps: true, collection }
  );
  schema.index({ id: 1 }, { unique: true, sparse: true });
  return mongoose.model(name, schema, collection);
}

module.exports = {
  User: require("../models/User"),
  Employee: require("../models/Employee"),
  InventoryItem: require("../models/InventoryItem"),
  Transaction: require("../models/Transaction"),
  Account: require("../models/Account"),
  Department: flexibleModel("Department", "departments"),
  Designation: flexibleModel("Designation", "designations"),
  Attendance: flexibleModel("Attendance", "attendance"),
  Leave: flexibleModel("Leave", "leaves"),
  Payroll: flexibleModel("Payroll", "payroll"),
  Invoice: flexibleModel("Invoice", "invoices"),
  Expense: flexibleModel("Expense", "expenses"),
  Income: flexibleModel("Income", "income"),
  Payment: flexibleModel("Payment", "payments"),
  Vendor: flexibleModel("Vendor", "vendors"),
  Asset: flexibleModel("Asset", "assets"),
  Budget: flexibleModel("Budget", "budgets"),
  TaxRecord: flexibleModel("TaxRecord", "tax_records"),
  Project: flexibleModel("Project", "projects"),
  Approval: flexibleModel("Approval", "approvals"),
  AuditLog: flexibleModel("AuditLog", "audit_logs"),
  Role: flexibleModel("Role", "roles"),
  Dashboard: flexibleModel("Dashboard", "dashboard"),
};
