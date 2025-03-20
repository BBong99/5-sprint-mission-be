import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { AppError } from "./error.js";

// 업로드 디렉토리 확인 및 생성
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 스토리지 엔진 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 파일 이름 생성: 고유 ID + 원본 확장자
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueId}${ext}`);
  },
});

// 파일 필터 (이미지 파일만 허용)
const fileFilter = (req, file, cb) => {
  // 허용되는 이미지 MIME 타입
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "이미지 파일만 업로드 가능합니다. (JPG, PNG, GIF, WEBP)",
        400
      ),
      false
    );
  }
};

// 기본 업로드 설정
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB 제한
  },
});

// 단일 이미지 업로드 미들웨어
export const uploadSingleImage = upload.single("image");

// 최대 3개 이미지 업로드 미들웨어
export const uploadMultipleImages = upload.array("images", 3);

// 업로드 에러 처리 미들웨어
export const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer 관련 에러 처리
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "파일 크기가 너무 큽니다. 최대 5MB까지 업로드 가능합니다.",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        message: "최대 3개의 이미지만 업로드할 수 있습니다.",
      });
    }
    return res.status(400).json({
      message: `파일 업로드 에러: ${err.message}`,
    });
  }
  next(err);
};

// 파일 URL 생성 유틸리티 함수
export const getFileUrl = (filename) => {
  if (!filename) return null;
  return `${process.env.API_URL}/uploads/${filename}`;
};
