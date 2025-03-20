import express from "express";
import { ArticleService } from "./service.js";
import { authenticate, authorizeArticle } from "../middleware/auth.js";
import {
  validateArticle,
  validateId,
  validatePagination,
} from "../middleware/validator.js";
import {
  uploadMultipleImages,
  handleUploadErrors,
} from "../middleware/upload.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: 게시글 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 게시글 고유 ID
 *         title:
 *           type: string
 *           description: 게시글 제목
 *         content:
 *           type: string
 *           description: 게시글 내용
 *         imageUrl:
 *           type: string
 *           description: 게시글 대표 이미지 URL (레거시)
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: 게시글 이미지 URL 배열
 *         likes:
 *           type: integer
 *           description: 좋아요 수
 *         isLiked:
 *           type: boolean
 *           description: 현재 사용자가 좋아요 했는지 여부
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 작성 일시
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 수정 일시
 *         author:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             nickname:
 *               type: string
 */

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: 게시글 목록 조회
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: 건너뛸 게시글 수
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: 가져올 게시글 수
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 검색어 (제목, 내용)
 *     responses:
 *       200:
 *         description: 게시글 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */
router.get("/", validatePagination, ArticleService.getArticles);

/**
 * @swagger
 * /api/articles/best:
 *   get:
 *     summary: 베스트 게시글 목록 조회 (좋아요 많은 순)
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: a
 *           maximum: 20
 *         description: 가져올 게시글 수
 *     responses:
 *       200:
 *         description: 베스트 게시글 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 */
router.get("/best", ArticleService.getBestArticles);

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: 게시글 상세 조회
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 게시글 ID
 *     responses:
 *       200:
 *         description: 게시글 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: 게시글을 찾을 수 없음
 */
router.get("/:id", validateId, ArticleService.getArticleById);

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: 게시글 작성
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: 게시글 제목
 *               content:
 *                 type: string
 *                 description: 게시글 내용
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: 게시글 이미지 (최대 3개)
 *     responses:
 *       201:
 *         description: 게시글 작성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       400:
 *         description: 유효하지 않은 입력값
 *       401:
 *         description: 인증 필요
 */
router.post(
  "/",
  authenticate,
  uploadMultipleImages,
  handleUploadErrors,
  validateArticle,
  ArticleService.createArticle
);

/**
 * @swagger
 * /api/articles/{id}:
 *   patch:
 *     summary: 게시글 수정
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 수정할 게시글 ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 게시글 제목
 *               content:
 *                 type: string
 *                 description: 게시글 내용
 *               keepImages:
 *                 type: string
 *                 description: 유지할 기존 이미지 URL (콤마로 구분)
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: 게시글 이미지 (최대 3개)
 *     responses:
 *       200:
 *         description: 게시글 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 게시글을 찾을 수 없음
 */
router.patch(
  "/:id",
  authenticate,
  authorizeArticle,
  uploadMultipleImages,
  handleUploadErrors,
  validateId,
  ArticleService.updateArticle
);

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: 게시글 삭제
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 삭제할 게시글 ID
 *     responses:
 *       204:
 *         description: 게시글 삭제 성공
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 게시글을 찾을 수 없음
 */
router.delete(
  "/:id",
  authenticate,
  authorizeArticle,
  validateId,
  ArticleService.deleteArticle
);

/**
 * @swagger
 * /api/articles/{id}/like:
 *   post:
 *     summary: 게시글 좋아요 토글
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 좋아요 토글할 게시글 ID
 *     responses:
 *       200:
 *         description: 좋아요 토글 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       401:
 *         description: 인증 필요
 *       404:
 *         description: 게시글을 찾을 수 없음
 */
router.post(
  "/:id/like",
  authenticate,
  validateId,
  ArticleService.toggleArticleLike
);

export default router;
