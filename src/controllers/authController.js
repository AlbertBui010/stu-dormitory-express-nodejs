const authService = require("../services/authService");
const {
  studentRegisterValidate,
  studentLoginValidate,
} = require("../utils/validation");
const createError = require("http-errors");
const { Student } = require("../models");
const { Op } = require("sequelize");

const register = async (req, res) => {
  try {
    const { id, name, email, password, phone, gender, dob, major, year } =
      req.body;

    // Validate input
    const { error } = studentRegisterValidate(req.body);
    if (error) {
      throw createError(error.details[0].message);
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({
      where: {
        [Op.or]: [{ id: id }, { email: email }, { phone: phone }],
      },
    });

    if (existingStudent) {
      return res.status(400).json({
        error: "Student with this ID, email or phone number already exists",
      });
    }

    // Create new student
    const student = await Student.create({
      id,
      name,
      email,
      password,
      phone,
      gender,
      dob,
      major,
      year,
      created_by: "DEFAULT",
      // em created
    });

    // Generate tokens
    const { accessToken, refreshToken } = authService.generateTokens(student);

    // Store refresh token
    await authService.storeRefreshToken(student.id, refreshToken);

    res.status(201).json({
      message: "Registration successful",
      accessToken,
      refreshToken,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
      },
    });
  } catch (error) {
    res.status(500).json({
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
    await authService.logout(req.user.id);
    res.status(204).send();
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
