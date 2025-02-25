import express from "express";
import { CommentService } from "../services/commentService.js";

const router = express.Router();

// 댓글 관련 엔드포인트
router.get("/", CommentService.getComments); // 댓글 목록 조회
router.get("/article/:articleId", CommentService.getCommentsByArticleId); // 게시글별 댓글 목록
router.get("/product/:productId", CommentService.getCommentsByProductId); // 상품별 댓글 목록
router.get("/:id", CommentService.getCommentById); // 댓글 상세 조회
router.post("/", CommentService.createComment); // 댓글 생성
router.patch("/:id", CommentService.updateComment); // 댓글 수정
router.delete("/:id", CommentService.deleteComment); // 댓글 삭제

export default router;
