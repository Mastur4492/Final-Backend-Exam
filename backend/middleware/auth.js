const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    console.log("Auth Middleware: No token found in cookies or header");
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    req.role = decoded.role; // Store role for RBAC
    next();
  } catch (err) {
    console.error("Auth Middleware: Token verification failed:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = auth;
