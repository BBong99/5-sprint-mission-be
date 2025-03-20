import { verifyToken } from "../config/jwt.js";
import prisma from "../../prisma/client.js";

// 인증 확인 미들웨어
export const authenticate = async (req, res, next) => {
  try {
    // 헤더에서 토큰 추출
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "인증 토큰이 필요합니다." });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "유효한 토큰 형식이 아닙니다." });
    }

    // 토큰 검증
    const decoded = verifyToken(token);
    if (!decoded) {
      return res
        .status(401)
        .json({ message: "토큰이 유효하지 않거나 만료되었습니다." });
    }

    // 사용자 정보 조회
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "해당 사용자를 찾을 수 없습니다." });
    }

    // 요청 객체에 사용자 정보 추가
    req.user = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    };

    next();
  } catch (error) {
    console.error("인증 에러:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 리소스 소유자 확인 미들웨어 (상품)
export const authorizeProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }

    if (product.authorId !== userId) {
      return res
        .status(403)
        .json({ message: "해당 작업을 수행할 권한이 없습니다." });
    }

    next();
  } catch (error) {
    console.error("권한 확인 에러:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 리소스 소유자 확인 미들웨어 (게시글)
export const authorizeArticle = async (req, res, next) => {
  try {
    const articleId = req.params.id;
    const userId = req.user.id;

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
    }

    if (article.authorId !== userId) {
      return res
        .status(403)
        .json({ message: "해당 작업을 수행할 권한이 없습니다." });
    }

    next();
  } catch (error) {
    console.error("권한 확인 에러:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

// 리소스 소유자 확인 미들웨어 (댓글)
export const authorizeComment = async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    if (comment.authorId !== userId) {
      return res
        .status(403)
        .json({ message: "해당 작업을 수행할 권한이 없습니다." });
    }

    next();
  } catch (error) {
    console.error("권한 확인 에러:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};
