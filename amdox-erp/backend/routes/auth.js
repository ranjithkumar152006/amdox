const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const repo = require("../lib/repository");
const asyncHandler = require("../lib/asyncHandler");

const JWT_SECRET = process.env.JWT_SECRET || "amdox_erp_secret_key_2024";

router.post("/login", asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: "Email and password are required." });

  const user = await repo.findByEmail("users", email);
  if (!user)
    return res.status(401).json({ success: false, message: "Invalid email or password." });

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch)
    return res.status(401).json({ success: false, message: "Invalid email or password." });

  await repo.updateById("users", user.id, { lastLogin: "Just now" });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  const { password: _pw, ...safeUser } = user;
  res.json({ success: true, message: "Login successful", token, user: safeUser });
}));

router.post("/logout", (req, res) => {
  res.json({ success: true, message: "Logged out successfully." });
});

router.get("/me", asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ success: false, message: "No token." });

  try {
    const decoded = jwt.verify(authHeader.split(" ")[1], JWT_SECRET);
    const user = await repo.findById("users", decoded.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    const { password: _pw, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch {
    res.status(401).json({ success: false, message: "Invalid token." });
  }
}));

module.exports = router;
