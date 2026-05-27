const router = require("express").Router();
const repo = require("../lib/repository");
const asyncHandler = require("../lib/asyncHandler");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", auth, asyncHandler(async (req, res) => {
  const { status, priority, search } = req.query;
  const all = await repo.findAll("projects");
  let data = [...all];
  if (status)   data = data.filter((p) => p.status === status);
  if (priority) data = data.filter((p) => p.priority === priority);
  if (search) {
    const q = search.toLowerCase();
    data = data.filter((p) => p.name?.toLowerCase().includes(q) || p.client?.toLowerCase().includes(q));
  }
  const stats = {
    total: all.length,
    healthy: all.filter((p) => p.status === "Healthy").length,
    atRisk: all.filter((p) => p.status === "At Risk").length,
    excellent: all.filter((p) => p.status === "Excellent").length,
    totalBudget: all.reduce((s, p) => s + (p.budget || 0), 0),
    totalSpent: all.reduce((s, p) => s + (p.spent || 0), 0),
  };
  res.json({ success: true, total: data.length, stats, data });
}));

router.get("/:id", auth, asyncHandler(async (req, res) => {
  const project = await repo.findById("projects", req.params.id);
  if (!project) return res.status(404).json({ success: false, message: "Project not found." });
  res.json({ success: true, data: project });
}));

router.post("/", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const { name, client, manager, team, budget, start, end, priority } = req.body;
  if (!name || !budget)
    return res.status(400).json({ success: false, message: "name and budget are required." });

  const project = await repo.create("projects", {
    id: await repo.nextId("projects", "PRJ"),
    name, client: client || "Internal",
    manager: manager || "TBD",
    team: Number(team) || 1,
    budget: Number(budget),
    spent: 0,
    start: start || new Date().toISOString().slice(0, 10),
    end: end || "",
    progress: 0,
    status: "Healthy",
    priority: priority || "Medium",
  });
  res.status(201).json({ success: true, message: "Project created.", data: project });
}));

router.put("/:id", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const existing = await repo.findById("projects", req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: "Project not found." });
  const updated = await repo.replaceById("projects", req.params.id, { ...existing, ...req.body, id: existing.id });
  res.json({ success: true, message: "Project updated.", data: updated });
}));

router.delete("/:id", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const removed = await repo.deleteById("projects", req.params.id);
  if (!removed) return res.status(404).json({ success: false, message: "Project not found." });
  res.json({ success: true, message: "Project removed.", data: removed });
}));

module.exports = router;
