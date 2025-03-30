const jwt = require("jsonwebtoken");
const { Student, Auth } = require("../models");
const createHttpError = require("http-errors");

class AuthService {
  generateTokens(user) {
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
  }

  async login(email, password) {
    const user = await Student.findOne({ where: { email } });
    if (!user) {
      throw createHttpError.NotFound("Student not found");
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw createHttpError.Unauthorized();
    }

    const { accessToken, refreshToken } = this.generateTokens(user);
    await this.storeRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken, user };
  }

  async refreshToken(oldRefreshToken) {
    try {
      const decoded = jwt.verify(
        oldRefreshToken,
        process.env.JWT_REFRESH_SECRET
      );
      const tokenRecord = await Auth.findOne({
        where: {
          student_id: decoded.id,
          refresh_token: oldRefreshToken,
        },
      });

      if (!tokenRecord) {
        throw new Error("Invalid refresh token");
      }

      const user = await Student.findByPk(decoded.id);
      const { accessToken, refreshToken } = this.generateTokens(user);

      // Update refresh token
      await Auth.update(
        {
          refresh_token: refreshToken,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
        { where: { id: tokenRecord.id } }
      );

      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }

  async storeRefreshToken(userId, refreshToken) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await Auth.create({
      student_id: userId,
      refresh_token: refreshToken,
      expires_at: expiresAt,
    });
  }

  async logout(userId) {
    await Auth.destroy({ where: { student_id: userId } });
  }
}

module.exports = new AuthService();
