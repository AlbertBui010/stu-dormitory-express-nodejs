const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { STUDENT, DEFAULT } = require("../const/type");
require("dotenv").config();
const ms = require("ms");
const { Student } = require("../models");
const createHttpError = require("http-errors");
const redis = require("../config/connections_redis");

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
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
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );

  return { accessToken, refreshToken };
};

const register = async (studentData) => {
  try {
    const { id, name, email, password, phone, gender, dob, major, year } =
      studentData;

    // Check if student already exists
    const existingStudent = await Student.findOne({
      where: {
        [Op.or]: [{ id }, { email }, { phone }],
      },
    });

    if (existingStudent) {
      throw createHttpError.BadRequest(
        "Student with this ID, email or phone number already exists"
      );
    }

    // Create new student
    const student = await Student.create({
      id,
      name,
      email,
      role: STUDENT,
      password,
      phone,
      gender,
      dob,
      major,
      year,
      created_by: DEFAULT,
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(student);

    // Store refresh token
    await storeRefreshToken(student.id, refreshToken);

    // Return success response
    return {
      accessToken,
      refreshToken,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
      },
    };
  } catch (error) {
    throw createHttpError.InternalServerError(
      "Registration failed: " + error.message
    );
  }
};

const login = async (email, password) => {
  const user = await Student.findOne({ where: { email } });
  // Check student exists
  if (!user) {
    throw createHttpError.NotFound("Student not found");
  }

  // Check password is correct
  const isValidPassword = await user.comparePassword(password);
  if (!isValidPassword) {
    throw createHttpError.Unauthorized("Password is incorrect");
  }

  // Gen tokens
  const { accessToken, refreshToken } = generateTokens(user);

  // Store refresh token in Redis
  await storeRefreshToken(user.id, refreshToken);

  return { accessToken, refreshToken, user };
};

const refreshToken = async (oldRefreshToken) => {
  try {
    console.log("Refreshing token...");
    // Verify token first
    const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);

    // Use safe Redis operation to get stored token
    const storedRefreshToken = await redis.safeGet(decoded.id);

    // If Redis is connected but token doesn't match or doesn't exist
    if (
      redis.isConnected() &&
      (!storedRefreshToken || storedRefreshToken !== oldRefreshToken)
    ) {
      throw createHttpError.Unauthorized("Invalid refresh token");
    }

    // Find user
    const user = await Student.findByPk(decoded.id);
    if (!user) {
      throw createHttpError.NotFound("User not found");
    }

    // Generate new tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Store new refresh token
    await redis.safeSet(user.id, refreshToken, {
      EX: Math.floor(ms(process.env.JWT_REFRESH_EXPIRES_IN || "1h") / 1000),
    });

    return { accessToken, refreshToken };
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      throw createHttpError.Unauthorized("Invalid or expired token");
    }
    if (error.status) throw error;
    throw createHttpError.InternalServerError(
      `Token refresh failed: ${error.message}`
    );
  }
};

const storeRefreshToken = async (studentID, refreshToken) => {
  try {
    // Parse the expiration time from environment variable
    const refreshExpiry = process.env.JWT_REFRESH_EXPIRES_IN || "1h";

    // Convert to seconds (ms returns milliseconds)
    const expiresInSeconds = Math.floor(ms(refreshExpiry) / 1000);

    // Store token with expiration
    const reply = await redis.safeSet(studentID, refreshToken, {
      EX: expiresInSeconds,
    });

    console.log(
      `Token stored with expiration: ${refreshExpiry} (${expiresInSeconds} seconds)`
    );

    // If Redis is down, we still return success but log it
    if (!reply && !redis.isConnected()) {
      console.log(
        `Token not stored in Redis (Redis unavailable) for user: ${studentID}`
      );
    } else {
      console.log(
        `Token stored with expiration: ${refreshExpiry} (${expiresInSeconds} seconds)`
      );
    }
    return true;
  } catch (error) {
    console.error("Error parsing expiration time:", error);
    return true; // Return true to indicate success even if parsing fails
  }
};

const logout = async (studentID) => {
  try {
    // Delete refresh token from Redis
    const result = await redis.safeDel(studentID);

    if (result !== 1) {
      throw createHttpError.InternalServerError("Failed to logout user");
    }

    return { message: "Logged out successfully" };
  } catch (error) {
    throw createHttpError.InternalServerError(
      `Logout failed: ${error.message}`
    );
  }
};

module.exports = {
  generateTokens,
  register,
  login,
  refreshToken,
  storeRefreshToken,
  logout,
};
