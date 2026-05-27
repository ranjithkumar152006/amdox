const router = require("express").Router();
const { auth, requireRole } = require("../middleware/auth");

// In-memory settings store
const SETTINGS = {
  general: {
    companyName:  "Amdox Technologies",
    tagline:      "AI-Powered Cloud ERP Suite",
    timezone:     "Asia/Kolkata",
    currency:     "USD",
    dateFormat:   "YYYY-MM-DD",
    language:     "English",
  },
  notifications: {
    emailAlerts:     true,
    smsAlerts:       false,
    pushNotifs:      true,
    dailyDigest:     true,
    weeklyReport:    true,
  },
  security: {
    twoFactor:       false,
    sessionTimeout:  30,
    passwordPolicy:  "strong",
    ipWhitelist:     [],
    loginAttempts:   5,
  },
  appearance: {
    theme:           "light",
    sidebarPosition: "left",
    accentColor:     "#2563EB",
    compactMode:     false,
  },
};

// GET /api/settings
router.get("/", auth, requireRole("admin"), (req, res) => {
  res.json({ success: true, data: SETTINGS });
});

// GET /api/settings/:section
router.get("/:section", auth, requireRole("admin"), (req, res) => {
  const section = SETTINGS[req.params.section];
  if (!section) return res.status(404).json({ success: false, message: "Settings section not found." });
  res.json({ success: true, data: section });
});

// PUT /api/settings/:section
router.put("/:section", auth, requireRole("admin"), (req, res) => {
  if (!SETTINGS[req.params.section])
    return res.status(404).json({ success: false, message: "Settings section not found." });

  SETTINGS[req.params.section] = { ...SETTINGS[req.params.section], ...req.body };
  res.json({ success: true, message: `${req.params.section} settings updated.`, data: SETTINGS[req.params.section] });
});

module.exports = router;
