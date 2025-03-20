import { body, validationResult, param, query } from "express-validator";

// 유효성 검증 결과 처리 미들웨어
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "입력값 검증에 실패했습니다.",
      errors: errors.array(),
    });
  }
  next();
};

// 회원가입 유효성 검증
export const validateSignup = [
  body("email")
    .isEmail()
    .withMessage("유효한 이메일 주소를 입력해주세요.")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("비밀번호는 최소 6자 이상이어야 합니다."),
  body("nickname")
    .isLength({ min: 2, max: 30 })
    .withMessage("닉네임은 2자 이상 30자 이하여야 합니다."),
  validate,
];

// 로그인 유효성 검증
export const validateLogin = [
  body("email")
    .isEmail()
    .withMessage("유효한 이메일 주소를 입력해주세요.")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("비밀번호를 입력해주세요."),
  validate,
];

// 상품 생성 유효성 검증
export const validateProduct = [
  body("name")
    .isLength({ min: 2, max: 255 })
    .withMessage("상품명은 2자 이상 255자 이하여야 합니다."),
  body("description")
    .isLength({ min: 10 })
    .withMessage("상품 설명은 최소 10자 이상이어야 합니다."),
  body("price")
    .isInt({ min: 0 })
    .withMessage("가격은 0 이상의 정수여야 합니다."),
  body("tags").isArray().withMessage("태그는 배열 형태여야 합니다."),
  validate,
];

// 게시글 생성 유효성 검증
export const validateArticle = [
  body("title")
    .isLength({ min: 2, max: 255 })
    .withMessage("제목은 2자 이상 255자 이하여야 합니다."),
  body("content")
    .isLength({ min: 10 })
    .withMessage("내용은 최소 10자 이상이어야 합니다."),
  validate,
];

// 댓글 생성 유효성 검증
export const validateComment = [
  body("content")
    .isLength({ min: 2 })
    .withMessage("댓글 내용은 최소 2자 이상이어야 합니다."),
  validate,
];

// ID 파라미터 유효성 검증
export const validateId = [
  param("id").isUUID().withMessage("유효한 ID 형식이 아닙니다."),
  validate,
];

// 페이지네이션 유효성 검증
export const validatePagination = [
  query("offset")
    .optional()
    .isInt({ min: 0 })
    .withMessage("offset은 0 이상의 정수여야 합니다."),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit은 1 이상 100 이하의 정수여야 합니다."),
  validate,
];
