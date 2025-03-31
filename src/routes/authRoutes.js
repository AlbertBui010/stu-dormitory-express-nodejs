const express = require("express");
const router = express.Router();
const {
  register,
  login,
  refresh,
  logout,
} = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.delete("/logout", verifyToken, logout);

module.exports = router;
