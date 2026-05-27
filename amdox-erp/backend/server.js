// ============================================================
//  Amdox ERP – Express Backend Server
//  Port: 5000 (matches frontend API baseURL)
// ============================================================

const express = require("express");
const cors    = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const seedDatabase = require("./lib/seedDatabase");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Global Middleware ─────────────────────────────────────
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logger (dev)
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const status   = res.statusCode;
    const color    = status >= 400 ? "\x1b[31m" : status >= 300 ? "\x1b[33m" : "\x1b[32m";
    console.log(`${color}${req.method}\x1b[0m ${req.originalUrl} → ${status} (${duration}ms)`);
  });
  next();
});

// ── Health Check ──────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Amdox ERP API is running",
    version: "1.0.0",
    storage: "mongodb",
    uptime:  process.uptime().toFixed(0) + "s",
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────
app.use("/api/auth",         require("./routes/auth"));
app.use("/api/dashboard",    require("./routes/dashboard"));
app.use("/api/employees",    require("./routes/employees"));
app.use("/api/departments",  require("./routes/departments"));
app.use("/api/designations", require("./routes/designations"));
app.use("/api/attendance",   require("./routes/attendance"));
app.use("/api/leaves",       require("./routes/leaves"));
app.use("/api/payroll",      require("./routes/payroll"));
app.use("/api/inventory",    require("./routes/inventory"));
app.use("/api/transactions", require("./routes/transactions"));
app.use("/api/invoices",     require("./routes/invoices"));
app.use("/api/expenses",     require("./routes/expenses"));
app.use("/api/income",       require("./routes/income"));
app.use("/api/accounts",     require("./routes/accounts"));
app.use("/api/payments",     require("./routes/payments"));
app.use("/api/vendors",      require("./routes/vendors"));
app.use("/api/assets",       require("./routes/assets"));
app.use("/api/budgets",      require("./routes/budgets"));
app.use("/api/tax",          require("./routes/tax"));
app.use("/api/projects",     require("./routes/projects"));
app.use("/api/approvals",    require("./routes/approvals"));
app.use("/api/audit-logs",   require("./routes/auditLogs"));
app.use("/api/users",        require("./routes/users"));
app.use("/api/roles",        require("./routes/roles"));
app.use("/api/reports",      require("./routes/reports"));
app.use("/api/profile",      require("./routes/profile"));
app.use("/api/settings",     require("./routes/settings"));
app.use("/api/backup",       require("./routes/backup"));

// ── 404 Handler ───────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ── Global Error Handler ──────────────────────────────────
app.use((err, req, res, next) => {
  console.error("\x1b[31m[ERROR]\x1b[0m", err.message);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV !== "production" && { error: err.message }),
  });
});

// ── Start Server (after MongoDB connects + seed) ───────────
async function start() {
  try {
    await connectDB();
    await seedDatabase();
    app.listen(PORT, () => {
      console.log("");
      console.log("  ╔═══════════════════════════════════════════════╗");
      console.log("  ║                                               ║");
      console.log("  ║   \x1b[36m🚀 Amdox ERP Backend API\x1b[0m                   ║");
      console.log(`  ║   \x1b[32m✓ Server running on port ${PORT}\x1b[0m              ║`);
      console.log(`  ║   \x1b[32m✓ API Base: http://localhost:${PORT}/api\x1b[0m      ║`);
      console.log("  ║   \x1b[32m✓ Storage:  MongoDB (persistent)\x1b[0m         ║");
      console.log("  ║   \x1b[32m✓ Health:   /api/health\x1b[0m                  ║");
      console.log("  ║                                               ║");
      console.log("  ╚═══════════════════════════════════════════════╝");
      console.log("");
    });
  } catch (err) {
    console.error("\x1b[31m[FATAL]\x1b[0m Failed to start server:", err.message);
    process.exit(1);
  }
}

start();

module.exports = app;
