import express from "express";
import { CommentService } from "./service.js";
import { authenticate, authorizeComment } from "../middleware/auth.js";
import { validateComment, validateId } from "../middleware/validator.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: 댓글 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 댓글 고유 ID
 *         content:
 *           type: string
 *           description: 댓글 내용
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 작성 일시
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 수정 일시
 *         articleId:
 *           type: string
 *           format: uuid
 *           description: 연결된 게시글 ID (게시글 댓글인 경우)
 *         productId:
 *           type: string
 *           format: uuid
 *           description: 연결된 상품 ID (상품 댓글인 경우)
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
 * /api/comments:
 *   get:
 *     summary: 전체 댓글 목록 조회
 *     tags: [Comments]
 *     responses:
 *       200:
 *         description: 댓글 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
router.get("/", CommentService.getComments);

/**
 * @swagger
 * /api/comments/article/{articleId}:
 *   get:
 *     summary: 특정 게시글의 댓글 목록 조회
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 게시글 ID
 *     responses:
 *       200:
 *         description: 댓글 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       404:
 *         description: 게시글을 찾을 수 없음
 */
router.get(
  "/article/:articleId",
  validateId,
  CommentService.getCommentsByArticleId
);

/**
 * @swagger
 * /api/comments/product/{productId}:
 *   get:
 *     summary: 특정 상품의 댓글 목록 조회
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 상품 ID
 *     responses:
 *       200:
 *         description: 댓글 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       404:
 *         description: 상품을 찾을 수 없음
 */
router.get(
  "/product/:productId",
  validateId,
  CommentService.getCommentsByProductId
);

/**
 * @swagger
 * /api/comments/{id}:
 *   get:
 *     summary: 특정 댓글 조회
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 댓글 ID
 *     responses:
 *       200:
 *         description: 댓글 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: 댓글을 찾을 수 없음
 */
router.get("/:id", validateId, CommentService.getCommentById);

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: 댓글 작성
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: 댓글 내용
 *               articleId:
 *                 type: string
 *                 format: uuid
 *                 description: 게시글 ID (게시글 댓글인 경우)
 *               productId:
 *                 type: string
 *                 format: uuid
 *                 description: 상품 ID (상품 댓글인 경우)
 *     responses:
 *       201:
 *         description: 댓글 작성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: 유효하지 않은 입력값
 *       401:
 *         description: 인증 필요
 *       404:
 *         description: 게시글 또는 상품을 찾을 수 없음
 */
router.post("/", authenticate, validateComment, CommentService.createComment);

/**
 * @swagger
 * /api/comments/{id}:
 *   patch:
 *     summary: 댓글 수정
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 수정할 댓글 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: 수정할 댓글 내용
 *     responses:
 *       200:
 *         description: 댓글 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 댓글을 찾을 수 없음
 */
router.patch(
  "/:id",
  authenticate,
  authorizeComment,
  validateId,
  validateComment,
  CommentService.updateComment
);

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: 댓글 삭제
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 삭제할 댓글 ID
 *     responses:
 *       204:
 *         description: 댓글 삭제 성공
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 댓글을 찾을 수 없음
 */
router.delete(
  "/:id",
  authenticate,
  authorizeComment,
  validateId,
  CommentService.deleteComment
);

export default router;
