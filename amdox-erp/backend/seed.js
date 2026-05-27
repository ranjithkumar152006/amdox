require("dotenv").config();
const connectDB = require("./config/db");
const seedDatabase = require("./lib/seedDatabase");
const repo = require("./lib/repository");
const seed = require("./data/mockData");

const SEED_MAP = [
  { key: "users", data: seed.USERS },
  { key: "employees", data: seed.EMPLOYEES },
  { key: "departments", data: seed.DEPARTMENTS },
  { key: "designations", data: seed.DESIGNATIONS },
  { key: "attendance", data: seed.ATTENDANCE },
  { key: "leaves", data: seed.LEAVES },
  { key: "payroll", data: seed.PAYROLL },
  { key: "inventory", data: seed.INVENTORY },
  { key: "transactions", data: seed.TRANSACTIONS },
  { key: "invoices", data: seed.INVOICES },
  { key: "expenses", data: seed.EXPENSES },
  { key: "income", data: seed.INCOME },
  { key: "accounts", data: seed.ACCOUNTS },
  { key: "payments", data: seed.PAYMENTS },
  { key: "vendors", data: seed.VENDORS },
  { key: "assets", data: seed.ASSETS },
  { key: "budgets", data: seed.BUDGETS },
  { key: "tax", data: seed.TAX_RECORDS },
  { key: "projects", data: seed.PROJECTS },
  { key: "approvals", data: seed.APPROVALS },
  { key: "auditLogs", data: seed.AUDIT_LOGS },
  { key: "roles", data: seed.ROLES },
];

async function resetAndSeed() {
  try {
    await connectDB();
    console.log("Clearing all collections...");
    for (const { key } of SEED_MAP) {
      const Model = repo.MODEL_KEYS[key];
      await Model.deleteMany({});
    }
    const models = require("./lib/models");
    await models.Dashboard.deleteMany({});
    for (const { key, data } of SEED_MAP) {
      if (data?.length) await repo.insertMany(key, data);
      console.log(`Seeded ${data?.length || 0} ${key}`);
    }
    await repo.saveDashboard(seed.DASHBOARD);
    console.log("Database reset and seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
}

resetAndSeed();
