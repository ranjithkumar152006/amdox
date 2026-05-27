const repo = require("./repository");
const seed = require("../data/mockData");

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

async function seedDatabase() {
  console.log("\x1b[36m[DB]\x1b[0m Checking database seed...");
  for (const { key, data } of SEED_MAP) {
    const existing = await repo.count(key);
    if (existing === 0 && data?.length) {
      await repo.insertMany(key, data);
      console.log(`\x1b[32m[DB]\x1b[0m Seeded ${data.length} ${key}`);
    }
  }
  const dash = await repo.getDashboard();
  if (!dash) {
    await repo.saveDashboard(seed.DASHBOARD);
    console.log("\x1b[32m[DB]\x1b[0m Seeded dashboard");
  }
  console.log("\x1b[32m[DB]\x1b[0m Database ready — data persists in MongoDB");
}

module.exports = seedDatabase;
