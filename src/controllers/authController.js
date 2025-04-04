const authService = require("../services/authService");
const {
  studentRegisterValidate,
  studentLoginValidate,
} = require("../utils/validation");
const createError = require("http-errors");

const register = async (req, res) => {
  try {
    // Validate input
    const { error } = studentRegisterValidate(req.body);
    if (error) {
      throw createError(error.details[0].message);
    }

    // Call service layer to handle registration
    const result = await authService.register(req.body);

    res.status(201).json({
      message: "Registration successful",
      ...result,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      error: error.message || "An error occurred during registration",
    });
  }
};

const login = async (req, res) => {
  try {
    const { error } = studentLoginValidate(req.body);
    if (error) {
      throw createError(error.details[0].message);
    }
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await authService.login(
      email,
      password
    );

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshToken(refreshToken);
    res.json(tokens);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const { message } = await authService.logout(req.user.id);
    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
};
