const models = require("./models");

const MODEL_KEYS = {
  users: models.User,
  employees: models.Employee,
  departments: models.Department,
  designations: models.Designation,
  attendance: models.Attendance,
  leaves: models.Leave,
  payroll: models.Payroll,
  inventory: models.InventoryItem,
  transactions: models.Transaction,
  invoices: models.Invoice,
  expenses: models.Expense,
  income: models.Income,
  accounts: models.Account,
  payments: models.Payment,
  vendors: models.Vendor,
  assets: models.Asset,
  budgets: models.Budget,
  tax: models.TaxRecord,
  projects: models.Project,
  approvals: models.Approval,
  auditLogs: models.AuditLog,
  roles: models.Role,
};

function clean(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  delete obj._id;
  delete obj.__v;
  return obj;
}

function cleanMany(docs) {
  return docs.map(clean);
}

function getModel(key) {
  const Model = MODEL_KEYS[key];
  if (!Model) throw new Error(`Unknown collection: ${key}`);
  return Model;
}

async function findAll(key, filter = {}) {
  const docs = await getModel(key).find(filter).lean();
  return cleanMany(docs);
}

async function findOne(key, filter) {
  return clean(await getModel(key).findOne(filter).lean());
}

async function findById(key, id) {
  return findOne(key, { id });
}

async function findByEmail(key, email) {
  return findOne(key, { email: { $regex: new RegExp(`^${email}$`, "i") } });
}

async function count(key, filter = {}) {
  return getModel(key).countDocuments(filter);
}

async function create(key, doc) {
  const created = await getModel(key).create(doc);
  return clean(created);
}

async function insertMany(key, docs) {
  if (!docs.length) return [];
  await getModel(key).insertMany(docs, { ordered: false }).catch((err) => {
    if (err.code !== 11000) throw err;
  });
  return docs;
}

async function updateById(key, id, updates) {
  const updated = await getModel(key)
    .findOneAndUpdate({ id }, { $set: updates }, { new: true })
    .lean();
  return clean(updated);
}

async function replaceById(key, id, doc) {
  const merged = { ...doc, id };
  const updated = await getModel(key)
    .findOneAndUpdate({ id }, merged, { new: true, upsert: true, setDefaultsOnInsert: true })
    .lean();
  return clean(updated);
}

async function deleteById(key, id) {
  const removed = await getModel(key).findOneAndDelete({ id }).lean();
  return clean(removed);
}

async function nextId(key, prefix) {
  const total = await count(key);
  return `${prefix}-${String(total + 1).padStart(3, "0")}`;
}

async function getDashboard() {
  let doc = await models.Dashboard.findOne({ id: "main" }).lean();
  if (!doc) return null;
  const { _id, __v, ...rest } = doc;
  return rest;
}

async function saveDashboard(data) {
  const payload = { id: "main", ...data };
  const doc = await models.Dashboard.findOneAndUpdate(
    { id: "main" },
    payload,
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();
  const { _id, __v, ...rest } = doc;
  return rest;
}

module.exports = {
  findAll,
  findOne,
  findById,
  findByEmail,
  count,
  create,
  insertMany,
  updateById,
  replaceById,
  deleteById,
  nextId,
  getDashboard,
  saveDashboard,
  MODEL_KEYS,
};
