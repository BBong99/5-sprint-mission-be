// 기본 에러 클래스
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 404 에러 처리 미들웨어
export const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    `요청한 리소스를 찾을 수 없습니다: ${req.originalUrl}`,
    404
  );
  next(error);
};

// 글로벌 에러 핸들러
export const globalErrorHandler = (err, req, res, next) => {
  // 기본 에러 정보
  let statusCode = err.statusCode || 500;
  let message = err.message || "서버 오류가 발생했습니다.";
  let stack = process.env.NODE_ENV === "production" ? undefined : err.stack;

  // 에러 유형에 따른 처리
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "입력값 검증에 실패했습니다.";
  } else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "유효하지 않은 토큰입니다.";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "토큰이 만료되었습니다.";
  } else if (err.code === "P2002") {
    statusCode = 409;
    message = "중복된 값이 존재합니다.";
  } else if (err.code === "P2025") {
    statusCode = 404;
    message = "요청한 리소스를 찾을 수 없습니다.";
  }

  // 에러 응답
  res.status(statusCode).json({
    status: "error",
    message,
    stack,
    ...(err.data && { data: err.data }),
  });
};
