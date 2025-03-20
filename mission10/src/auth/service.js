import bcrypt from "bcrypt";
import prisma from "../../prisma/client.js";
import {
  generateToken,
  generateRefreshToken,
  verifyToken,
} from "../config/jwt.js";
import { AppError } from "../middleware/error.js";

const SALT_ROUNDS = 10;

export const AuthService = {
  /**
   * 회원가입을 처리합니다.
   * @param {Object} userData - 회원가입 정보 (이메일, 비밀번호, 닉네임)
   * @returns {Promise<Object>} 생성된 사용자 정보 (비밀번호 제외)
   */
  async signup(userData) {
    const { email, password, nickname } = userData;

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError("이미 사용 중인 이메일입니다.", 409);
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nickname,
      },
    });

    // 토큰 생성
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // 리프레시 토큰 저장
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // 민감한 정보 제외하고 반환
    const { password: _, refreshToken: __, ...userWithoutSensitiveInfo } = user;

    return {
      user: userWithoutSensitiveInfo,
      accessToken,
      refreshToken,
    };
  },

  /**
   * 로그인을 처리합니다.
   * @param {Object} credentials - 로그인 정보 (이메일, 비밀번호)
   * @returns {Promise<Object>} 사용자 정보와 토큰
   */
  async login(credentials) {
    const { email, password } = credentials;

    // 사용자 조회
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("이메일 또는 비밀번호가 올바르지 않습니다.", 401);
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError("이메일 또는 비밀번호가 올바르지 않습니다.", 401);
    }

    // 토큰 생성
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // 리프레시 토큰 저장
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // 민감한 정보 제외하고 반환
    const { password: _, refreshToken: __, ...userWithoutSensitiveInfo } = user;

    return {
      user: userWithoutSensitiveInfo,
      accessToken,
      refreshToken,
    };
  },

  /**
   * 토큰을 갱신합니다.
   * @param {string} refreshToken - 리프레시 토큰
   * @returns {Promise<Object>} 새로운 액세스 토큰과 리프레시 토큰
   */
  async refreshToken(token) {
    if (!token) {
      throw new AppError("리프레시 토큰이 필요합니다.", 401);
    }

    // 토큰 검증
    const decoded = verifyToken(token);
    if (!decoded) {
      throw new AppError("유효하지 않은 리프레시 토큰입니다.", 401);
    }

    // 사용자 조회
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.refreshToken !== token) {
      throw new AppError("유효하지 않은 리프레시 토큰입니다.", 401);
    }

    // 새로운 토큰 생성
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // 새로운 리프레시 토큰 저장
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return {
      accessToken,
      refreshToken,
    };
  },

  /**
   * 로그아웃 처리를 합니다.
   * @param {string} userId - 사용자 ID
   * @returns {Promise<void>}
   */
  async logout(userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  },
};
