const jwt = require("jsonwebtoken");
const createHttpError = require("http-errors");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(
      createHttpError.Unauthorized("Authentication token is required.")
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(createHttpError.Unauthorized("Token has expired."));
    }
    if (error.name === "JsonWebTokenError") {
      return next(createHttpError.Unauthorized("Invalid token."));
    }
    next();
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ error: "Access denied. Admin rights required." });
  }
  next();
};

module.exports = { verifyToken, isAdmin };
