const router = require("express").Router();
const repo = require("../lib/repository");
const asyncHandler = require("../lib/asyncHandler");
const { auth, requireRole } = require("../middleware/auth");

router.get("/", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const { module, severity, action, search } = req.query;
  const all = await repo.findAll("auditLogs");
  let data = [...all].sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""));
  if (module)   data = data.filter((l) => l.module?.toLowerCase() === module.toLowerCase());
  if (severity) data = data.filter((l) => l.severity === severity);
  if (action)   data = data.filter((l) => l.action === action);
  if (search) {
    const q = search.toLowerCase();
    data = data.filter((l) =>
      l.user?.toLowerCase().includes(q) ||
      l.description?.toLowerCase().includes(q) ||
      l.module?.toLowerCase().includes(q)
    );
  }
  res.json({
    success: true, total: data.length,
    severityCount: {
      Info: all.filter((l) => l.severity === "Info").length,
      Warning: all.filter((l) => l.severity === "Warning").length,
      Critical: all.filter((l) => l.severity === "Critical").length,
    },
    data,
  });
}));

router.get("/:id", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const log = await repo.findById("auditLogs", req.params.id);
  if (!log) return res.status(404).json({ success: false, message: "Log entry not found." });
  res.json({ success: true, data: log });
}));

router.post("/", auth, requireRole("admin"), asyncHandler(async (req, res) => {
  const { user, action, module, description, ip, severity } = req.body;
  const log = await repo.create("auditLogs", {
    id: await repo.nextId("auditLogs", "AUD"),
    user: user || req.user.name,
    action: action || "ACTION",
    module: module || "System",
    description: description || "",
    ip: ip || req.ip,
    timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
    severity: severity || "Info",
  });
  res.status(201).json({ success: true, message: "Log entry created.", data: log });
}));

module.exports = router;
