const jwt = require('jsonwebtoken');
require("dotenv").config();

const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization'); // Get token from headers

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = verified; // Add user info to request
        if (!req.user || req.user.role !== "admin") {  // ✅ Ensure role exists
            return res.status(403).json({ message: "Access Denied. Admins only." });
        }
        next(); // Continue if valid admin
    } catch (error) {
        console.error("JWT Verification Error:", error);  // 🔍 Debugging message
    res.status(400).json({ message: "Invalid token." });
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired. Please login again." });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(400).json({ message: "Invalid token." });
        } else {
            return res.status(400).json({ message: "Authentication failed." });
        }
    }
};

module.exports = authMiddleware;