const router = require("express").Router();
const repo = require("../lib/repository");
const asyncHandler = require("../lib/asyncHandler");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", auth, asyncHandler(async (req, res) => {
  const { status, type, search } = req.query;
  const all = await repo.findAll("approvals");
  let data = [...all];
  if (status) data = data.filter((a) => a.status === status);
  if (type)   data = data.filter((a) => a.type === type);
  if (search) {
    const q = search.toLowerCase();
    data = data.filter((a) =>
      a.requestedBy?.toLowerCase().includes(q) || a.description?.toLowerCase().includes(q)
    );
  }
  const pending  = all.filter((a) => a.status === "Pending").length;
  const approved = all.filter((a) => a.status === "Approved").length;
  const rejected = all.filter((a) => a.status === "Rejected").length;
  res.json({ success: true, total: data.length, summary: { pending, approved, rejected }, data });
}));

router.get("/:id", auth, asyncHandler(async (req, res) => {
  const apr = await repo.findById("approvals", req.params.id);
  if (!apr) return res.status(404).json({ success: false, message: "Approval not found." });
  res.json({ success: true, data: apr });
}));

router.post("/", auth, asyncHandler(async (req, res) => {
  const { type, department, amount, description, priority } = req.body;
  if (!type || !description)
    return res.status(400).json({ success: false, message: "type and description are required." });

  const apr = await repo.create("approvals", {
    id: await repo.nextId("approvals", "APR"),
    type,
    requestedBy: req.user.name,
    department: department || "General",
    amount: amount ? Number(amount) : null,
    description,
    date: new Date().toISOString().slice(0, 10),
    status: "Pending",
    priority: priority || "Normal",
  });
  res.status(201).json({ success: true, message: "Approval request submitted.", data: apr });
}));

router.put("/:id/action", auth, requireRole("admin", "finance", "hr"), asyncHandler(async (req, res) => {
  const { action, remarks } = req.body;
  if (!["Approved", "Rejected"].includes(action))
    return res.status(400).json({ success: false, message: "action must be Approved or Rejected." });

  const existing = await repo.findById("approvals", req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: "Approval not found." });

  const updated = await repo.replaceById("approvals", req.params.id, {
    ...existing,
    status: action,
    reviewedBy: req.user.name,
    remarks: remarks || "",
  });
  res.json({ success: true, message: `Request ${action.toLowerCase()}.`, data: updated });
}));

module.exports = router;
