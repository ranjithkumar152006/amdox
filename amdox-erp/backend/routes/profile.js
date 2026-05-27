const router = require("express").Router();
const repo = require("../lib/repository");
const asyncHandler = require("../lib/asyncHandler");
const { auth } = require("../middleware/auth");
const bcrypt = require("bcryptjs");

const roleLabels = {
  admin: "Administrator",
  hr: "HR Manager",
  finance: "Finance Manager",
  employee: "Employee",
  it: "IT Support",
};

async function buildProfile(user) {
  const projects = await repo.findAll("projects");
  const approvals = await repo.findAll("approvals");
  const attendance = await repo.findAll("attendance");
  const auditLogs = await repo.findAll("auditLogs");

  const activeProjects = projects.filter(
    (p) => !["Completed", "Cancelled"].includes(p.status)
  ).length;

  const tasksCompleted = approvals.filter(
    (a) => a.status === "Approved" &&
      (a.requestedBy === user.name || a.reviewedBy === user.name)
  ).length;

  const hoursLogged = attendance.filter(
    (a) => a.name === user.name || a.employeeId === user.id
  ).length * 8;

  const activity = auditLogs
    .filter((l) => l.user === user.name)
    .sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""))
    .slice(0, 8)
    .map((l) => ({
      id: l.id,
      action: l.description,
      time: l.timestamp,
      location: "—",
      ip: l.ip,
      type: l.action,
    }));

  const { password: _pw, ...safeUser } = user;

  return {
    ...safeUser,
    roleLabel: roleLabels[user.role] || user.role,
    location: user.location || "—",
    bio: user.bio || "",
    skills: user.skills || [],
    timezone: user.timezone || "(UTC-05:00) Eastern Time (US & Canada)",
    language: user.language || "English",
    dateOfBirth: user.dateOfBirth || "—",
    gender: user.gender || "—",
    joinedDate: user.joinedDate || "15 Jan 2023",
    emailVerified: user.emailVerified !== false,
    phoneVerified: user.phoneVerified !== false,
    twoFactorEnabled: user.twoFactorEnabled === true,
    stats: {
      projects: activeProjects || projects.length,
      tasksCompleted: tasksCompleted || approvals.filter((a) => a.status === "Approved").length,
      hoursLogged: hoursLogged || attendance.length * 8,
      achievements: user.achievements || Math.min(8, tasksCompleted + 3),
    },
    activity,
  };
}

router.get("/", auth, asyncHandler(async (req, res) => {
  const user = await repo.findById("users", req.user.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found." });
  res.json({ success: true, data: await buildProfile(user) });
}));

router.put("/", auth, asyncHandler(async (req, res) => {
  const existing = await repo.findById("users", req.user.id);
  if (!existing) return res.status(404).json({ success: false, message: "User not found." });

  const fields = [
    "name", "phone", "department", "bio", "location",
    "timezone", "language", "dateOfBirth", "gender", "skills",
  ];
  const updates = {};
  fields.forEach((key) => {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  });
  updates.lastLogin = new Date().toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

  const updated = await repo.replaceById("users", req.user.id, { ...existing, ...updates });
  res.json({ success: true, message: "Profile updated.", data: await buildProfile(updated) });
}));

router.put("/password", auth, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return res.status(400).json({ success: false, message: "currentPassword and newPassword are required." });

  const user = await repo.findById("users", req.user.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found." });

  if (!bcrypt.compareSync(currentPassword, user.password))
    return res.status(401).json({ success: false, message: "Current password is incorrect." });

  await repo.updateById("users", user.id, {
    password: bcrypt.hashSync(newPassword, 10),
  });
  res.json({ success: true, message: "Password changed successfully." });
}));

module.exports = router;
