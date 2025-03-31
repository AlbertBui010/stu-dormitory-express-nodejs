const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { STUDENT, DEFAULT } = require("../const/type");
require("dotenv").config();
const ms = require("ms");
const { Student, Auth } = require("../models");
const createHttpError = require("http-errors");
const client = require("../config/connections_redis");

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
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
  return new Promise((resolve, reject) => {
    jwt.verify(
      oldRefreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, decoded) => {
        if (err) {
          return reject(err);
        }

        const storedRefreshToken = await client.get(decoded.id);
        if (!storedRefreshToken) {
          return reject(createHttpError.Unauthorized("Invalid refresh token"));
        }

        const user = await Student.findByPk(decoded.id);
        if (!user) {
          return reject(createHttpError.NotFound("User not found"));
        }

        const { accessToken, refreshToken } = generateTokens(user);
        await storeRefreshToken(user.id, refreshToken);

        resolve({ accessToken, refreshToken });
      }
    );
  });
};

const storeRefreshToken = async (studentID, refreshToken) => {
  try {
    // Parse the expiration time from environment variable
    const refreshExpiry = process.env.JWT_REFRESH_EXPIRES_IN;

    // Convert to seconds (ms returns milliseconds)
    const expiresInSeconds = Math.floor(ms(refreshExpiry) / 1000);

    // Store token with expiration
    const reply = await client.set(studentID, refreshToken, {
      EX: expiresInSeconds,
    });

    console.log(
      `Token stored with expiration: ${refreshExpiry} (${expiresInSeconds} seconds)`
    );
    return reply;
  } catch (error) {
    console.error("Error parsing expiration time:", error);
    throw createHttpError.InternalServerError(`Redis error: ${error.message}`);
  }
};

const logout = async (studentID) => {
  try {
    // Delete refresh token from Redis
    const result = await client.del(studentID);

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
