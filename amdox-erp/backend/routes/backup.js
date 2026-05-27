const router = require("express").Router();
const { auth, requireRole } = require("../middleware/auth");

// In-memory backup store
const BACKUPS = [
  { id: "BKP-001", name: "Full System Backup",    date: "2024-05-18 02:00:00", size: "2.4 GB", type: "Full",        status: "Completed", createdBy: "System (Auto)" },
  { id: "BKP-002", name: "Database Backup",        date: "2024-05-17 02:00:00", size: "1.8 GB", type: "Database",    status: "Completed", createdBy: "System (Auto)" },
  { id: "BKP-003", name: "File System Backup",     date: "2024-05-16 03:30:00", size: "850 MB", type: "Files",       status: "Completed", createdBy: "John Doe"      },
  { id: "BKP-004", name: "Configuration Backup",   date: "2024-05-15 01:00:00", size: "12 MB",  type: "Config",      status: "Completed", createdBy: "System (Auto)" },
];

const BACKUP_SCHEDULE = {
  enabled:    true,
  frequency:  "Daily",
  time:       "02:00",
  retention:  30,
  type:       "Full",
  lastRun:    "2024-05-18 02:00:00",
  nextRun:    "2024-05-19 02:00:00",
};

// GET /api/backup
router.get("/", auth, requireRole("admin"), (req, res) => {
  const totalSize = "5.06 GB";
  res.json({
    success: true,
    total:   BACKUPS.length,
    totalSize,
    schedule: BACKUP_SCHEDULE,
    data:    BACKUPS,
  });
});

// GET /api/backup/:id
router.get("/:id", auth, requireRole("admin"), (req, res) => {
  const backup = BACKUPS.find((b) => b.id === req.params.id);
  if (!backup) return res.status(404).json({ success: false, message: "Backup not found." });
  res.json({ success: true, data: backup });
});

// POST /api/backup  – trigger a manual backup
router.post("/", auth, requireRole("admin"), (req, res) => {
  const { name, type } = req.body;
  const backup = {
    id:        `BKP-${String(BACKUPS.length + 1).padStart(3, "0")}`,
    name:      name || "Manual Backup",
    date:      new Date().toISOString().replace("T", " ").slice(0, 19),
    size:      "Calculating...",
    type:      type || "Full",
    status:    "In Progress",
    createdBy: req.user.name,
  };
  BACKUPS.unshift(backup);

  // Simulate backup completion after 2 seconds
  setTimeout(() => {
    const idx = BACKUPS.findIndex((b) => b.id === backup.id);
    if (idx !== -1) {
      BACKUPS[idx].status = "Completed";
      BACKUPS[idx].size   = "1.2 GB";
    }
  }, 2000);

  res.status(201).json({ success: true, message: "Backup initiated.", data: backup });
});

// PUT /api/backup/schedule
router.put("/schedule", auth, requireRole("admin"), (req, res) => {
  Object.assign(BACKUP_SCHEDULE, req.body);
  res.json({ success: true, message: "Backup schedule updated.", data: BACKUP_SCHEDULE });
});

// DELETE /api/backup/:id
router.delete("/:id", auth, requireRole("admin"), (req, res) => {
  const idx = BACKUPS.findIndex((b) => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Backup not found." });
  const removed = BACKUPS.splice(idx, 1)[0];
  res.json({ success: true, message: "Backup deleted.", data: removed });
});

module.exports = router;
