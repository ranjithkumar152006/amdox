const router = require("express").Router();
const repo = require("../lib/repository");
const asyncHandler = require("../lib/asyncHandler");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", auth, requireRole("admin", "hr"), asyncHandler(async (req, res) => {
  const { month, status } = req.query;
  let data = await repo.findAll("payroll");
  if (month)  data = data.filter((p) => p.month === month);
  if (status) data = data.filter((p) => p.status === status);
  res.json({
    success: true, total: data.length,
    summary: {
      totalGross: data.reduce((s, p) => s + (p.basicSalary || 0) + (p.hra || 0) + (p.allowances || 0), 0),
      totalNet: data.reduce((s, p) => s + (p.netPay || 0), 0),
      totalDeduc: data.reduce((s, p) => s + (p.deductions || 0), 0),
    },
    data,
  });
}));

router.get("/:id", auth, requireRole("admin", "hr"), asyncHandler(async (req, res) => {
  const record = await repo.findById("payroll", req.params.id);
  if (!record) return res.status(404).json({ success: false, message: "Payroll record not found." });
  res.json({ success: true, data: record });
}));

router.post("/", auth, requireRole("admin", "hr"), asyncHandler(async (req, res) => {
  const { employeeId, name, month, basicSalary, hra, allowances, deductions } = req.body;
  if (!employeeId || !month || basicSalary == null)
    return res.status(400).json({ success: false, message: "employeeId, month, and basicSalary are required." });
  const record = await repo.create("payroll", {
    id: await repo.nextId("payroll", "PAY"),
    employeeId, name: name || employeeId, month,
    basicSalary: Number(basicSalary),
    hra: Number(hra) || 0,
    allowances: Number(allowances) || 0,
    deductions: Number(deductions) || 0,
    netPay: Number(basicSalary) + Number(hra || 0) + Number(allowances || 0) - Number(deductions || 0),
    status: "Pending",
  });
  res.status(201).json({ success: true, message: "Payroll record created.", data: record });
}));

router.put("/:id/process", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const existing = await repo.findById("payroll", req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: "Record not found." });
  const updated = await repo.replaceById("payroll", req.params.id, { ...existing, status: "Processed" });
  res.json({ success: true, message: "Payroll processed.", data: updated });
}));

module.exports = router;
