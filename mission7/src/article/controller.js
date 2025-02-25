import express from "express";
import { ArticleService } from "./service.js";

const router = express.Router();

// 게시글 관련 엔드포인트
router.get("/", ArticleService.getArticles); // 게시글 목록 조회
router.get("/best", ArticleService.getBestArticles); // 베스트 게시글 목록 조회
router.get("/:id", ArticleService.getArticleById); // 게시글 상세 조회
router.post("/", ArticleService.createArticle); // 게시글 생성
router.patch("/:id", ArticleService.updateArticle); // 게시글 수정
router.delete("/:id", ArticleService.deleteArticle); // 게시글 삭제
router.post("/:id/like", ArticleService.toggleArticleLike); // 게시글 좋아요 토글

export default router;
