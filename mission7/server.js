// Express 서버 메인 설정 파일
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRouter from "./src/product/controller.js";
import articleRouter from "./src/article/controller.js";
import commentRouter from "./src/comment/controller.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 라우터 연결
app.use("/api/products", productRouter);
app.use("/api/articles", articleRouter);
app.use("/api/comments", commentRouter);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
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
