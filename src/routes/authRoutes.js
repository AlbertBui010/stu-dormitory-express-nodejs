const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");

const {
  register,
  login,
  refresh,
  logout,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.delete("/logout", verifyToken, logout);

module.exports = router;
