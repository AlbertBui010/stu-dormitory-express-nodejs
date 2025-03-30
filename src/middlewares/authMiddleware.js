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
    return next(createHttpError.Unauthorized("Invalid authentication token."));
  }
};
// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   if (!authHeader) return res.sendStatus(401);
//   console.log(authHeader); // Bearer token
//   const token = authHeader.split(" ")[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//     if (err) return res.sendStatus(403); //invalid token
//     req.user = decoded.username;
//     next();
//   });
// };

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ error: "Access denied. Admin rights required." });
  }
  next();
};

module.exports = { verifyToken, isAdmin };
