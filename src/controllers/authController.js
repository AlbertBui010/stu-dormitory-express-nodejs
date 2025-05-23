const authService = require("../services/authService");
const {
  studentRegisterValidate,
  studentLoginValidate,
} = require("../utils/validation");
const createError = require("http-errors");
const { NewResponse, mess } = require("../utils/response");

const register = async (req, res) => {
  try {
    const { error } = studentRegisterValidate(req.body);
    if (error) {
      throw createError(error.details[0].message);
    }

    await authService.register(req.body);

    res.status(201).json(NewResponse(mess.REGISTER_SUCCESS, []));
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
      return res.status(400).json(NewResponse(error.details[0].message, []));
    }
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await authService.login(
      email,
      password
    );

    const dataResponse = {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        phone: user.phone,
        gender: user.gender,
        dob: user.dob,
        major: user.major,
        year: user.year,
      },
    };
    return res.status(200).json(NewResponse(mess.LOGIN_SUCCESS, dataResponse));
  } catch (error) {
    res.status(401).json(NewResponse(error.message, []));
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({
        status: 400,
        message: "Refresh token is required",
      });
    }
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
