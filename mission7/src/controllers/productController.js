import express from "express";
import { ProductService } from "../services/productService.js";

const router = express.Router();

// 상품 관련 엔드포인트
router.get("/", ProductService.getProducts); // 상품 목록 조회
router.get("/best", ProductService.getBestProducts); // 베스트 상품 목록 조회
router.get("/:id", ProductService.getProductById); // 상품 상세 조회
router.post("/", ProductService.createProduct); // 상품 생성
router.patch("/:id", ProductService.updateProduct); // 상품 수정
router.delete("/:id", ProductService.deleteProduct); // 상품 삭제
router.post("/:id/like", ProductService.toggleProductLike); // 상품 좋아요 토글

export default router;
