import prisma from "../../prisma/client.js";

/**
 * 상품 관련 에러를 처리하기 위한 커스텀 에러 클래스
 */
class ProductError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const ProductService = {
  /**
   * HTTP 요청 핸들러 (라우트 핸들러)
   * 클라이언트의 요청을 처리하고 응답을 반환하는 메서드들
   */

  /**
   * 상품 목록을 조회합니다.
   * @param {Object} req - Express 요청 객체 (offset, limit, search 쿼리 파라미터 포함)
   * @param {Object} res - Express 응답 객체
   */
  async getProducts(req, res) {
    try {
      const { offset, limit, search } = req.query;
      const products = await ProductService.findAll(
        Number(offset),
        Number(limit),
        search
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
      const products = await ProductService.findBest(Number(req.query.limit));
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
      const product = await ProductService.findById(req.params.id);
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
      const product = await ProductService.create(req.body, req.user.id);
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
      const updatedProduct = await ProductService.update(
        req.params.id,
        req.body,
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
   * 상품의 좋아요를 토글합니다.
   * @param {Object} req - Express 요청 객체 (상품 ID 포함)
   * @param {Object} res - Express 응답 객체
   */
  async toggleProductLike(req, res) {
    try {
      const product = await ProductService.toggleLike(req.params.id);
      res.json(product);
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
   * @returns {Promise<Array>} 상품 목록
   * @throws {ProductError} 조회 실패시 에러
   */
  async findAll(offset = 0, limit = 10, search = "") {
    try {
      return await prisma.product.findMany({
        where: search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : undefined,
        orderBy: { createdAt: "desc" },
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
      throw new ProductError("상품 목록을 불러오는데 실패했습니다.", 500);
    }
  },

  /**
   * 특정 상품을 ID로 조회하는 내부 메서드
   * @param {string} id - 상품 ID
   * @returns {Promise<Object>} 상품 정보
   * @throws {ProductError} 상품이 없거나 조회 실패시 에러
   */
  async findById(id) {
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
          },
        },
      });

      if (!product) {
        throw new ProductError("상품을 찾을 수 없습니다.", 404);
      }

      return product;
    } catch (error) {
      if (error instanceof ProductError) throw error;
      throw new ProductError("상품을 불러오는데 실패했습니다.", 500);
    }
  },

  /**
   * 새로운 상품을 생성하는 내부 메서드
   * @param {Object} productData - 상품 데이터 (이름, 설명, 가격, 태그)
   * @param {string} authorId - 작성자 ID
   * @returns {Promise<Object>} 생성된 상품 정보
   * @throws {ProductError} 생성 실패시 에러
   */
  async create(productData, authorId) {
    try {
      const { name, description, price, tags } = productData;

      return await prisma.product.create({
        data: {
          name,
          description,
          price,
          tags,
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
      throw new ProductError("상품 생성에 실패했습니다.", 500);
    }
  },

  /**
   * 상품을 수정하는 내부 메서드
   * @param {string} id - 상품 ID
   * @param {Object} productData - 수정할 상품 데이터
   * @param {string} authorId - 작성자 ID (권한 확인용)
   * @returns {Promise<Object>} 수정된 상품 정보
   * @throws {ProductError} 수정 권한이 없거나 실패시 에러
   */
  async update(id, productData, authorId) {
    try {
      const product = await this.findById(id);

      if (product.authorId !== authorId) {
        throw new ProductError("상품을 수정할 권한이 없습니다.", 403);
      }

      const { name, description, price, tags } = productData;
      return await prisma.product.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(description && { description }),
          ...(price && { price }),
          ...(tags && { tags }),
          updatedAt: new Date(),
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
      if (error instanceof ProductError) throw error;
      throw new ProductError("상품 수정에 실패했습니다.", 500);
    }
  },

  /**
   * 상품을 삭제하는 내부 메서드
   * @param {string} id - 상품 ID
   * @param {string} authorId - 작성자 ID (권한 확인용)
   * @throws {ProductError} 삭제 권한이 없거나 실패시 에러
   */
  async delete(id, authorId) {
    try {
      const product = await this.findById(id);

      if (product.authorId !== authorId) {
        throw new ProductError("상품을 삭제할 권한이 없습니다.", 403);
      }

      await prisma.product.delete({ where: { id } });
    } catch (error) {
      if (error instanceof ProductError) throw error;
      throw new ProductError("상품 삭제에 실패했습니다.", 500);
    }
  },

  /**
   * 상품 좋아요를 토글하는 내부 메서드
   * @param {string} id - 상품 ID
   * @returns {Promise<Object>} 수정된 상품 정보
   * @throws {ProductError} 토글 실패시 에러
   */
  async toggleLike(id) {
    try {
      const product = await this.findById(id);

      return await prisma.product.update({
        where: { id },
        data: {
          likes: product.likes > 0 ? product.likes - 1 : product.likes + 1,
        },
      });
    } catch (error) {
      if (error instanceof ProductError) throw error;
      throw new ProductError("좋아요 처리에 실패했습니다.", 500);
    }
  },

  /**
   * 베스트 상품을 조회하는 내부 메서드
   * @param {number} limit - 가져올 상품 수
   * @returns {Promise<Array>} 좋아요 순으로 정렬된 상품 목록
   * @throws {ProductError} 조회 실패시 에러
   */
  async findBest(limit = 5) {
    try {
      return await prisma.product.findMany({
        where: {
          likes: { gt: 0 },
        },
        orderBy: [{ likes: "desc" }, { createdAt: "desc" }],
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
      throw new ProductError(
        "베스트 상품 목록을 불러오는데 실패했습니다.",
        500
      );
    }
  },
};
