import express from "express";
import { ProductService } from "./service.js";
import { authenticate, authorizeProduct } from "../middleware/auth.js";
import {
  validateProduct,
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
 *   name: Products
 *   description: 상품 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - tags
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 상품 고유 ID
 *         name:
 *           type: string
 *           description: 상품명
 *         description:
 *           type: string
 *           description: 상품 설명
 *         price:
 *           type: integer
 *           description: 상품 가격
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 상품 태그
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: 상품 이미지 URL 배열
 *         favorites:
 *           type: integer
 *           description: 찜하기 수
 *         isFavorited:
 *           type: boolean
 *           description: 현재 사용자가 상품을 찜했는지 여부
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 생성 일시
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
 * /api/products:
 *   get:
 *     summary: 상품 목록 조회
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: 건너뛸 상품 수
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: 가져올 상품 수
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 검색어 (상품명, 설명)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [recent, favorites]
 *         description: 정렬 방식 (recent - 최신순, favorites - 찜하기순)
 *     responses:
 *       200:
 *         description: 상품 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/", validatePagination, ProductService.getProducts);

/**
 * @swagger
 * /api/products/best:
 *   get:
 *     summary: 베스트 상품 목록 조회 (찜하기 많은 순)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 20
 *         description: 가져올 상품 수 (기본값 4)
 *     responses:
 *       200:
 *         description: 베스트 상품 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/best", ProductService.getBestProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: 상품 상세 조회
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 상품 ID
 *     responses:
 *       200:
 *         description: 상품 상세 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: 상품을 찾을 수 없음
 */
router.get("/:id", validateId, ProductService.getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: 상품 등록
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - tags
 *             properties:
 *               name:
 *                 type: string
 *                 description: 상품명
 *               description:
 *                 type: string
 *                 description: 상품 설명
 *               price:
 *                 type: integer
 *                 description: 상품 가격
 *               tags:
 *                 type: string
 *                 description: 콤마(,)로 구분된 태그 목록
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: 상품 이미지 (최대 3개)
 *     responses:
 *       201:
 *         description: 상품 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
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
  validateProduct,
  ProductService.createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: 상품 수정
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 수정할 상품 ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 상품명
 *               description:
 *                 type: string
 *                 description: 상품 설명
 *               price:
 *                 type: integer
 *                 description: 상품 가격
 *               tags:
 *                 type: string
 *                 description: 콤마(,)로 구분된 태그 목록
 *               keepImages:
 *                 type: string
 *                 description: 유지할 기존 이미지 URL (콤마로 구분)
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: 상품 이미지 (최대 3개)
 *     responses:
 *       200:
 *         description: 상품 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 상품을 찾을 수 없음
 */
router.patch(
  "/:id",
  authenticate,
  authorizeProduct,
  uploadMultipleImages,
  handleUploadErrors,
  validateId,
  ProductService.updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: 상품 삭제
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 삭제할 상품 ID
 *     responses:
 *       204:
 *         description: 상품 삭제 성공
 *       401:
 *         description: 인증 필요
 *       403:
 *         description: 권한 없음
 *       404:
 *         description: 상품을 찾을 수 없음
 */
router.delete(
  "/:id",
  authenticate,
  authorizeProduct,
  validateId,
  ProductService.deleteProduct
);

/**
 * @swagger
 * /api/products/{id}/favorite:
 *   post:
 *     summary: 상품 찜하기
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 찜하기할 상품 ID
 *     responses:
 *       200:
 *         description: 찜하기 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: 이미 찜한 상품
 *       401:
 *         description: 인증 필요
 *       404:
 *         description: 상품을 찾을 수 없음
 */
router.post(
  "/:id/favorite",
  authenticate,
  validateId,
  ProductService.favoriteProduct
);

/**
 * @swagger
 * /api/products/{id}/favorite:
 *   delete:
 *     summary: 상품 찜하기 취소
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: 찜하기 취소할 상품 ID
 *     responses:
 *       200:
 *         description: 찜하기 취소 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: 찜하지 않은 상품
 *       401:
 *         description: 인증 필요
 *       404:
 *         description: 상품을 찾을 수 없음
 */
router.delete(
  "/:id/favorite",
  authenticate,
  validateId,
  ProductService.unfavoriteProduct
);

export default router;
