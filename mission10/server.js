// Express 서버 메인 설정 파일
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/config/swagger.js";
import productRouter from "./src/product/controller.js";
import articleRouter from "./src/article/controller.js";
import commentRouter from "./src/comment/controller.js";
import authRouter from "./src/auth/controller.js";
import { notFoundHandler, globalErrorHandler } from "./src/middleware/error.js";

// ES 모듈에서 __dirname 가져오기
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 정적 파일 제공 (업로드된 이미지)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Swagger API 문서
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 라우터 연결
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/articles", articleRouter);
app.use("/api/comments", commentRouter);

// 404 에러 처리 미들웨어
app.use(notFoundHandler);

// 글로벌 에러 핸들러
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
  console.log(`API 문서: http://localhost:${PORT}/api-docs`);
});

// 프로세스 종료 시 정리
process.on("SIGTERM", () => {
  console.info("SIGTERM signal received.");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

// 예기치 않은 에러 처리
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  server.close(() => {
    process.exit(1);
  });
});
