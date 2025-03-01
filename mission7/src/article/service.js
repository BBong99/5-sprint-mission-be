import prisma from "../../prisma/client.js";

/**
 * 게시글 관련 에러를 처리하기 위한 커스텀 에러 클래스
 */
class ArticleError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const ArticleService = {
  /**
   * HTTP 요청 핸들러 (라우트 핸들러)
   * 클라이언트의 요청을 처리하고 응답을 반환하는 메서드들
   */

  /**
   * 게시글 목록을 조회합니다.
   * @param {Object} req - Express 요청 객체 (page, limit, search, sort 쿼리 파라미터 포함)
   * @param {Object} res - Express 응답 객체
   */
  async getArticles(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const offset = (page - 1) * limit;
      const search = req.query.search || "";
      const sort = req.query.sort || "latest"; // 'latest' 또는 'likes'

      if (!["latest", "likes"].includes(sort)) {
        throw new ArticleError("유효하지 않은 정렬 기준입니다.", 400);
      }

      const result = await ArticleService.findAll(offset, limit, search, sort);
      res.json(result);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  },

  /**
   * 베스트 게시글 목록을 조회합니다.
   * @param {Object} req - Express 요청 객체 (limit 쿼리 파라미터 포함)
   * @param {Object} res - Express 응답 객체
   */
  async getBestArticles(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const articles = await ArticleService.findBest(limit);
      res.json(articles);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  },

  /**
   * 특정 게시글의 상세 정보를 조회합니다.
   * @param {Object} req - Express 요청 객체 (id 파라미터 포함)
   * @param {Object} res - Express 응답 객체
   */
  async getArticleById(req, res) {
    try {
      const article = await ArticleService.findById(req.params.id);
      res.json(article);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  },

  /**
   * 새로운 게시글을 생성합니다.
   * @param {Object} req - Express 요청 객체 (제목, 내용, 이미지URL 포함)
   * @param {Object} res - Express 응답 객체
   */
  async createArticle(req, res) {
    try {
      // 테스트 환경에서 authorId가 없는 경우 기본값 사용
      const authorId = req.user?.id || "2b1d9484-b7c9-4a45-84c1-9c9208df777a"; // 테스트유저2의 ID
      const article = await ArticleService.create(req.body, authorId);
      res.status(201).json(article);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  },

  /**
   * 기존 게시글을 수정합니다.
   * @param {Object} req - Express 요청 객체 (게시글 ID, 수정할 내용 포함)
   * @param {Object} res - Express 응답 객체
   */
  async updateArticle(req, res) {
    try {
      // 테스트 환경에서 authorId가 없는 경우 기본값 사용
      const authorId = req.user?.id || "2b1d9484-b7c9-4a45-84c1-9c9208df777a"; // 테스트유저2의 ID
      const updatedArticle = await ArticleService.update(
        req.params.id,
        req.body,
        authorId
      );
      res.json(updatedArticle);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  },

  /**
   * 게시글을 삭제합니다.
   * @param {Object} req - Express 요청 객체 (게시글 ID 포함)
   * @param {Object} res - Express 응답 객체
   */
  async deleteArticle(req, res) {
    try {
      // 테스트 환경에서 authorId가 없는 경우 기본값 사용
      const authorId = req.user?.id || "2b1d9484-b7c9-4a45-84c1-9c9208df777a"; // 테스트유저2의 ID
      await ArticleService.delete(req.params.id, authorId);
      res.status(204).end();
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  },

  /**
   * 게시글의 좋아요를 토글합니다.
   * @param {Object} req - Express 요청 객체 (게시글 ID 포함)
   * @param {Object} res - Express 응답 객체
   */
  async toggleArticleLike(req, res) {
    try {
      const article = await ArticleService.toggleLike(req.params.id);
      res.json(article);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  },

  /**
   * 내부 비즈니스 로직
   * 실제 데이터베이스 작업을 수행하는 메서드들
   */

  /**
   * 게시글 목록을 조회하는 내부 메서드
   * @param {number} offset - 건너뛸 게시글 수
   * @param {number} limit - 가져올 게시글 수
   * @param {string} search - 검색어 (제목, 내용에서 검색)
   * @param {string} sort - 정렬 기준 (latest, likes)
   * @returns {Promise<Object>} 게시글 목록과 페이지네이션 정보
   * @throws {ArticleError} 조회 실패시 에러
   */
  async findAll(offset = 0, limit = 5, search = "", sort = "latest") {
    try {
      const where = search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { content: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined;

      // 정렬 조건 설정
      const orderBy =
        sort === "likes"
          ? [{ likes: "desc" }, { createdAt: "desc" }]
          : [{ createdAt: "desc" }];

      // 전체 게시글 수 조회 (카운트 쿼리 분리)
      const total = await prisma.article.count({ where });

      // 페이지네이션된 게시글 조회
      const articles = await prisma.article.findMany({
        where,
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
          _count: {
            select: {
              comments: true,
            },
          },
        },
      });

      // 페이지네이션 정보 추가
      return {
        articles,
        pageInfo: {
          total,
          totalPages: Math.ceil(total / limit),
          currentPage: Math.floor(offset / limit) + 1,
          hasNext: offset + limit < total,
          hasPrev: offset > 0,
        },
      };
    } catch (error) {
      console.error("Database error:", error);
      throw new ArticleError(
        "게시글 목록을 불러오는데 실패했습니다. " + (error.message || ""),
        500
      );
    }
  },

  /**
   * 특정 게시글을 ID로 조회하는 내부 메서드
   * @param {string} id - 게시글 ID
   * @returns {Promise<Object>} 게시글 정보
   * @throws {ArticleError} 게시글이 없거나 조회 실패시 에러
   */
  async findById(id) {
    try {
      const article = await prisma.article.findUnique({
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

      if (!article) {
        throw new ArticleError("게시글을 찾을 수 없습니다.", 404);
      }

      return article;
    } catch (error) {
      if (error instanceof ArticleError) throw error;
      throw new ArticleError("게시글을 불러오는데 실패했습니다.", 500);
    }
  },

  /**
   * 새로운 게시글을 생성하는 내부 메서드
   * @param {Object} articleData - 게시글 데이터 (제목, 내용, 이미지URL)
   * @param {string} authorId - 작성자 ID
   * @returns {Promise<Object>} 생성된 게시글 정보
   * @throws {ArticleError} 생성 실패시 에러
   */
  async create(articleData, authorId) {
    try {
      const { title, content, imageUrl } = articleData;
      const defaultImageUrl = "https://via.placeholder.com/800x400";

      return await prisma.article.create({
        data: {
          title,
          content,
          imageUrl: imageUrl || defaultImageUrl,
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
      throw new ArticleError("게시글 생성에 실패했습니다.", 500);
    }
  },

  /**
   * 게시글을 수정하는 내부 메서드
   * @param {string} id - 게시글 ID
   * @param {Object} articleData - 수정할 게시글 데이터
   * @param {string} authorId - 작성자 ID (권한 확인용)
   * @returns {Promise<Object>} 수정된 게시글 정보
   * @throws {ArticleError} 수정 권한이 없거나 실패시 에러
   */
  async update(id, articleData, authorId) {
    try {
      const article = await this.findById(id);

      if (article.authorId !== authorId) {
        throw new ArticleError("게시글을 수정할 권한이 없습니다.", 403);
      }

      const { title, content, imageUrl } = articleData;
      return await prisma.article.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(content && { content }),
          ...(imageUrl && { imageUrl }),
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
      if (error instanceof ArticleError) throw error;
      throw new ArticleError("게시글 수정에 실패했습니다.", 500);
    }
  },

  /**
   * 게시글을 삭제하는 내부 메서드
   * @param {string} id - 게시글 ID
   * @param {string} authorId - 작성자 ID (권한 확인용)
   * @throws {ArticleError} 삭제 권한이 없거나 실패시 에러
   */
  async delete(id, authorId) {
    try {
      const article = await this.findById(id);

      if (article.authorId !== authorId) {
        throw new ArticleError("게시글을 삭제할 권한이 없습니다.", 403);
      }

      await prisma.article.delete({ where: { id } });
    } catch (error) {
      if (error instanceof ArticleError) throw error;
      throw new ArticleError("게시글 삭제에 실패했습니다.", 500);
    }
  },

  /**
   * 게시글 좋아요를 토글하는 내부 메서드
   * @param {string} id - 게시글 ID
   * @returns {Promise<Object>} 수정된 게시글 정보
   * @throws {ArticleError} 토글 실패시 에러
   */
  async toggleLike(id) {
    try {
      const article = await this.findById(id);

      return await prisma.article.update({
        where: { id },
        data: {
          likes: article.likes > 0 ? article.likes - 1 : article.likes + 1,
        },
      });
    } catch (error) {
      if (error instanceof ArticleError) throw error;
      throw new ArticleError("좋아요 처리에 실패했습니다.", 500);
    }
  },

  /**
   * 베스트 게시글을 조회하는 내부 메서드
   * @param {number} limit - 가져올 게시글 수
   * @returns {Promise<Array>} 좋아요 순으로 정렬된 게시글 목록
   * @throws {ArticleError} 조회 실패시 에러
   */
  async findBest(limit = 5) {
    try {
      return await prisma.article.findMany({
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
      throw new ArticleError(
        "베스트 게시글 목록을 불러오는데 실패했습니다.",
        500
      );
    }
  },
};
