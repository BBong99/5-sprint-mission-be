import prisma from "../../prisma/client.js";
import { AppError } from "../middleware/error.js";
import { getFileUrl } from "../middleware/upload.js";

/**
 * 상품 관련 에러를 처리하기 위한 커스텀 에러 클래스
 */
class ProductError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * 상품 관련 서비스
 */
export const ProductService = {
  /**
   * HTTP 요청 핸들러 (라우트 핸들러)
   * 클라이언트의 요청을 처리하고 응답을 반환하는 메서드들
   */

  /**
   * 상품 목록을 조회합니다.
   * @param {Object} req - Express 요청 객체 (offset, limit, search, sort 쿼리 파라미터 포함)
   * @param {Object} res - Express 응답 객체
   */
  async getProducts(req, res) {
    try {
      const offset = parseInt(req.query.offset) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || "";
      const sort = req.query.sort || "recent"; // recent(최신순) 또는 favorites(찜하기순)

      const products = await ProductService.findAll(
        offset,
        limit,
        search,
        sort
      );
      res.json(products);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  },

  /**
   * 베스트 상품 목록을 조회합니다.
   * @param {Object} req - Express 요청 객체 (limit 쿼리 파라미터 포함)
   * @param {Object} res - Express 응답 객체
   */
  async getBestProducts(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 4;
      const products = await ProductService.findBest(limit);
      res.json(products);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  },

  /**
   * 특정 상품의 상세 정보를 조회합니다.
   * @param {Object} req - Express 요청 객체 (id 파라미터 포함)
   * @param {Object} res - Express 응답 객체
   */
  async getProductById(req, res) {
    try {
      const userId = req.user?.id;
      const product = await ProductService.findById(req.params.id, userId);
      res.json(product);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  },

  /**
   * 새로운 상품을 생성합니다.
   * @param {Object} req - Express 요청 객체 (이름, 설명, 가격, 태그 포함)
   * @param {Object} res - Express 응답 객체
   */
  async createProduct(req, res) {
    try {
      // 파일 업로드 처리
      const images = req.files?.map((file) => getFileUrl(file.filename)) || [];

      const productData = {
        ...req.body,
        price: parseInt(req.body.price),
        tags: req.body.tags?.split(",").map((tag) => tag.trim()) || [],
        images,
      };

      const product = await ProductService.create(productData, req.user.id);
      res.status(201).json(product);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  },

  /**
   * 기존 상품을 수정합니다.
   * @param {Object} req - Express 요청 객체 (상품 ID, 수정할 내용 포함)
   * @param {Object} res - Express 응답 객체
   */
  async updateProduct(req, res) {
    try {
      // 파일 업로드 처리
      const newImages =
        req.files?.map((file) => getFileUrl(file.filename)) || [];
      const keepImages = req.body.keepImages?.split(",").filter(Boolean) || [];

      const productData = {
        ...req.body,
        price: req.body.price ? parseInt(req.body.price) : undefined,
        tags: req.body.tags
          ? req.body.tags.split(",").map((tag) => tag.trim())
          : undefined,
        images: [...keepImages, ...newImages],
      };

      const updatedProduct = await ProductService.update(
        req.params.id,
        productData,
        req.user.id
      );
      res.json(updatedProduct);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  },

  /**
   * 상품을 삭제합니다.
   * @param {Object} req - Express 요청 객체 (상품 ID 포함)
   * @param {Object} res - Express 응답 객체
   */
  async deleteProduct(req, res) {
    try {
      await ProductService.delete(req.params.id, req.user.id);
      res.status(204).end();
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  },

  /**
   * 상품 찜하기를 처리합니다.
   * @param {Object} req - Express 요청 객체 (상품 ID 포함)
   * @param {Object} res - Express 응답 객체
   */
  async favoriteProduct(req, res) {
    try {
      const result = await ProductService.addFavorite(
        req.params.id,
        req.user.id
      );
      res.json(result);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  },

  /**
   * 상품 찜하기 취소를 처리합니다.
   * @param {Object} req - Express 요청 객체 (상품 ID 포함)
   * @param {Object} res - Express 응답 객체
   */
  async unfavoriteProduct(req, res) {
    try {
      const result = await ProductService.removeFavorite(
        req.params.id,
        req.user.id
      );
      res.json(result);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  },

  /**
   * 내부 비즈니스 로직
   * 실제 데이터베이스 작업을 수행하는 메서드들
   */

  /**
   * 상품 목록을 조회하는 내부 메서드
   * @param {number} offset - 건너뛸 상품 수
   * @param {number} limit - 가져올 상품 수
   * @param {string} search - 검색어 (이름, 설명에서 검색)
   * @param {string} sort - 정렬 방식 (recent: 최신순, favorites: 찜하기순)
   * @returns {Promise<Array>} 상품 목록
   * @throws {AppError} 조회 실패시 에러
   */
  async findAll(offset = 0, limit = 10, search = "", sort = "recent") {
    try {
      // 정렬 방식 설정
      const orderBy =
        sort === "favorites"
          ? [{ favorites: "desc" }, { createdAt: "desc" }]
          : { createdAt: "desc" };

      return await prisma.product.findMany({
        where: search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : undefined,
        orderBy,
        skip: offset,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              nickname: true,
            },
          },
        },
      });
    } catch (error) {
      throw new AppError("상품 목록을 불러오는데 실패했습니다.", 500);
    }
  },

  /**
   * 특정 상품을 ID로 조회하는 내부 메서드
   * @param {string} id - 상품 ID
   * @param {string} userId - 요청한 사용자 ID (찜하기 상태 확인용, 선택적)
   * @returns {Promise<Object>} 상품 정보
   * @throws {AppError} 상품이 없거나 조회 실패시 에러
   */
  async findById(id, userId = null) {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              nickname: true,
            },
          },
          comments: {
            include: {
              author: {
                select: {
                  id: true,
                  nickname: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (!product) {
        throw new AppError("상품을 찾을 수 없습니다.", 404);
      }

      // 사용자의 찜하기 상태 확인
      let isFavorited = false;
      if (userId) {
        const favorite = await prisma.productFavorite.findUnique({
          where: {
            userId_productId: {
              userId,
              productId: id,
            },
          },
        });
        isFavorited = !!favorite;
      }

      return { ...product, isFavorited };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("상품을 불러오는데 실패했습니다.", 500);
    }
  },

  /**
   * 새로운 상품을 생성하는 내부 메서드
   * @param {Object} productData - 상품 데이터 (이름, 설명, 가격, 태그, 이미지)
   * @param {string} authorId - 작성자 ID
   * @returns {Promise<Object>} 생성된 상품 정보
   * @throws {AppError} 생성 실패시 에러
   */
  async create(productData, authorId) {
    try {
      const { name, description, price, tags, images } = productData;

      return await prisma.product.create({
        data: {
          name,
          description,
          price,
          tags,
          images,
          author: {
            connect: { id: authorId },
          },
        },
        include: {
          author: {
            select: {
              id: true,
              nickname: true,
            },
          },
        },
      });
    } catch (error) {
      throw new AppError("상품 생성에 실패했습니다.", 500);
    }
  },

  /**
   * 상품을 수정하는 내부 메서드
   * @param {string} id - 상품 ID
   * @param {Object} productData - 수정할 상품 데이터
   * @param {string} authorId - 작성자 ID (권한 확인용)
   * @returns {Promise<Object>} 수정된 상품 정보
   * @throws {AppError} 수정 권한이 없거나 실패시 에러
   */
  async update(id, productData, authorId) {
    try {
      // 상품 조회
      const product = await prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new AppError("상품을 찾을 수 없습니다.", 404);
      }

      // 권한 확인
      if (product.authorId !== authorId) {
        throw new AppError("해당 상품을 수정할 권한이 없습니다.", 403);
      }

      // 수정할 데이터 준비
      const updateData = {};
      if (productData.name) updateData.name = productData.name;
      if (productData.description)
        updateData.description = productData.description;
      if (productData.price !== undefined) updateData.price = productData.price;
      if (productData.tags) updateData.tags = productData.tags;
      if (productData.images) updateData.images = productData.images;

      // 상품 업데이트
      return await prisma.product.update({
        where: { id },
        data: updateData,
        include: {
          author: {
            select: {
              id: true,
              nickname: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("상품 수정에 실패했습니다.", 500);
    }
  },

  /**
   * 상품을 삭제하는 내부 메서드
   * @param {string} id - 상품 ID
   * @param {string} authorId - 작성자 ID (권한 확인용)
   * @returns {Promise<void>}
   * @throws {AppError} 삭제 권한이 없거나 실패시 에러
   */
  async delete(id, authorId) {
    try {
      // 상품 조회
      const product = await prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new AppError("상품을 찾을 수 없습니다.", 404);
      }

      // 권한 확인
      if (product.authorId !== authorId) {
        throw new AppError("해당 상품을 삭제할 권한이 없습니다.", 403);
      }

      // 상품 삭제
      await prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("상품 삭제에 실패했습니다.", 500);
    }
  },

  /**
   * 베스트 상품을 조회하는 내부 메서드
   * @param {number} limit - 가져올 상품 수
   * @returns {Promise<Array>} 찜하기 순으로 정렬된 상품 목록
   * @throws {AppError} 조회 실패시 에러
   */
  async findBest(limit = 4) {
    try {
      return await prisma.product.findMany({
        where: {
          favorites: { gt: 0 },
        },
        orderBy: [{ favorites: "desc" }, { createdAt: "desc" }],
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              nickname: true,
            },
          },
        },
      });
    } catch (error) {
      throw new AppError("베스트 상품 목록을 불러오는데 실패했습니다.", 500);
    }
  },

  /**
   * 상품에 찜하기를 추가하는 메서드
   * @param {string} productId - 상품 ID
   * @param {string} userId - 사용자 ID
   * @returns {Promise<Object>} 업데이트된 상품 정보
   * @throws {AppError} 찜하기 추가 실패시 에러
   */
  async addFavorite(productId, userId) {
    try {
      // 트랜잭션으로 처리
      return await prisma.$transaction(async (tx) => {
        // 이미 찜하기가 있는지 확인
        const existingFavorite = await tx.productFavorite.findUnique({
          where: {
            userId_productId: {
              userId,
              productId,
            },
          },
        });

        if (existingFavorite) {
          throw new AppError("이미 찜한 상품입니다.", 400);
        }

        // 찜하기 생성
        await tx.productFavorite.create({
          data: {
            user: { connect: { id: userId } },
            product: { connect: { id: productId } },
          },
        });

        // 상품의 찜하기 수 증가
        const updatedProduct = await tx.product.update({
          where: { id: productId },
          data: { favorites: { increment: 1 } },
          include: {
            author: {
              select: {
                id: true,
                nickname: true,
              },
            },
          },
        });

        return { ...updatedProduct, isFavorited: true };
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("찜하기 추가에 실패했습니다.", 500);
    }
  },

  /**
   * 상품의 찜하기를 취소하는 메서드
   * @param {string} productId - 상품 ID
   * @param {string} userId - 사용자 ID
   * @returns {Promise<Object>} 업데이트된 상품 정보
   * @throws {AppError} 찜하기 취소 실패시 에러
   */
  async removeFavorite(productId, userId) {
    try {
      // 트랜잭션으로 처리
      return await prisma.$transaction(async (tx) => {
        // 찜하기 확인
        const existingFavorite = await tx.productFavorite.findUnique({
          where: {
            userId_productId: {
              userId,
              productId,
            },
          },
        });

        if (!existingFavorite) {
          throw new AppError("찜하지 않은 상품입니다.", 400);
        }

        // 찜하기 삭제
        await tx.productFavorite.delete({
          where: {
            userId_productId: {
              userId,
              productId,
            },
          },
        });

        // 상품의 찜하기 수 감소
        const updatedProduct = await tx.product.update({
          where: { id: productId },
          data: { favorites: { decrement: 1 } },
          include: {
            author: {
              select: {
                id: true,
                nickname: true,
              },
            },
          },
        });

        return { ...updatedProduct, isFavorited: false };
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("찜하기 취소에 실패했습니다.", 500);
    }
  },
};
