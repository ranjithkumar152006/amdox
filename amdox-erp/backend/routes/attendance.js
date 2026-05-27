const router = require("express").Router();
const repo = require("../lib/repository");
const asyncHandler = require("../lib/asyncHandler");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", auth, asyncHandler(async (req, res) => {
  const { date, status, search } = req.query;
  let data = await repo.findAll("attendance");
  if (date)   data = data.filter((a) => a.date === date);
  if (status) data = data.filter((a) => a.status === status);
  if (search) {
    const q = search.toLowerCase();
    data = data.filter((a) => a.name?.toLowerCase().includes(q));
  }
  const stats = {
    present: data.filter((a) => a.status === "Present").length,
    absent: data.filter((a) => a.status === "Absent").length,
    late: data.filter((a) => a.status === "Late").length,
    onLeave: data.filter((a) => a.status === "On Leave").length,
  };
  res.json({ success: true, total: data.length, stats, data });
}));

router.get("/:id", auth, asyncHandler(async (req, res) => {
  const record = await repo.findById("attendance", req.params.id);
  if (!record) return res.status(404).json({ success: false, message: "Record not found." });
  res.json({ success: true, data: record });
}));

router.post("/", auth, requireRole("admin", "hr"), asyncHandler(async (req, res) => {
  const { employeeId, name, date, checkIn, checkOut, status } = req.body;
  if (!employeeId || !date || !status)
    return res.status(400).json({ success: false, message: "employeeId, date, and status are required." });
  const record = await repo.create("attendance", {
    id: await repo.nextId("attendance", "ATT"),
    employeeId, name: name || employeeId, date,
    checkIn: checkIn || "—",
    checkOut: checkOut || "—",
    hours: checkIn && checkOut ? "Calculated" : "—",
    status,
  });
  res.status(201).json({ success: true, message: "Attendance marked.", data: record });
}));

router.put("/:id", auth, requireRole("admin", "hr"), asyncHandler(async (req, res) => {
  const existing = await repo.findById("attendance", req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: "Record not found." });
  const updated = await repo.replaceById("attendance", req.params.id, { ...existing, ...req.body, id: existing.id });
  res.json({ success: true, message: "Attendance updated.", data: updated });
}));

module.exports = router;
