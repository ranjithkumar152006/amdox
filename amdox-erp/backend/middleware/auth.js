const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "amdox_erp_secret_key_2024";

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided. Access denied." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

// Role-based middleware factory
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
  if (!roles.includes(req.user.role) && req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: `Access denied. Required role: ${roles.join(" or ")}` });
  }
  next();
};

module.exports = { auth, requireRole };
