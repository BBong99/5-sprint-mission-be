import prisma from "../../prisma/client.js";

/**
 * 댓글 관련 에러를 처리하기 위한 커스텀 에러 클래스
 */
class CommentError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const CommentService = {
  /**
   * HTTP 요청 핸들러 (라우트 핸들러)
   * 클라이언트의 요청을 처리하고 응답을 반환하는 메서드들
   */

  /**
   * 전체 댓글 목록을 조회합니다.
   * @param {Object} req - Express 요청 객체 (offset, limit 쿼리 파라미터 포함)
   * @param {Object} res - Express 응답 객체
   */
  async getComments(req, res) {
    try {
      const offset = parseInt(req.query.offset) || 0;
      const limit = parseInt(req.query.limit) || 10;

      const comments = await CommentService.findAll(offset, limit);
      res.json(comments);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  },

  /**
   * 특정 게시글의 댓글 목록을 조회합니다.
   * @param {Object} req - Express 요청 객체 (articleId 파라미터 포함)
   * @param {Object} res - Express 응답 객체
   */
  async getCommentsByArticleId(req, res) {
    try {
      const { articleId } = req.params;
      const comments = await CommentService.findByArticleId(articleId);
      res.json(comments);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  },

  /**
   * 특정 상품의 댓글 목록을 조회합니다.
   * @param {Object} req - Express 요청 객체 (productId 파라미터 포함)
   * @param {Object} res - Express 응답 객체
   */
  async getCommentsByProductId(req, res) {
    try {
      const { productId } = req.params;
      const comments = await CommentService.findByProductId(productId);
      res.json(comments);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  },

  /**
   * 특정 댓글의 상세 정보를 조회합니다.
   * @param {Object} req - Express 요청 객체 (id 파라미터 포함)
   * @param {Object} res - Express 응답 객체
   */
  async getCommentById(req, res) {
    try {
      const comment = await CommentService.findById(req.params.id);
      res.json(comment);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  },

  /**
   * 새로운 댓글을 생성합니다.
   * @param {Object} req - Express 요청 객체 (내용, 게시글ID 또는 상품ID 포함)
   * @param {Object} res - Express 응답 객체
   */
  async createComment(req, res) {
    try {
      // 테스트 환경에서 authorId를 랜덤으로 선택
      const testUserIds = [
        "2b1d9484-b7c9-4a45-84c1-9c9208df777a", // 테스트유저2
        "ff75456f-bae4-4b48-9439-9f58f7b83a20", // 테스트유저1
      ];
      const randomIndex = Math.floor(Math.random() * 2); // 0 또는 1 랜덤 선택
      const authorId = req.user?.id || testUserIds[randomIndex];

      const comment = await CommentService.create(req.body, authorId);
      res.status(201).json(comment);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  },

  /**
   * 기존 댓글을 수정합니다.
   * @param {Object} req - Express 요청 객체 (댓글 ID, 수정할 내용 포함)
   * @param {Object} res - Express 응답 객체
   */
  async updateComment(req, res) {
    try {
      // 테스트 환경에서 authorId를 랜덤으로 선택
      const testUserIds = [
        "2b1d9484-b7c9-4a45-84c1-9c9208df777a", // 테스트유저2
        "ff75456f-bae4-4b48-9439-9f58f7b83a20", // 테스트유저1
      ];
      const randomIndex = Math.floor(Math.random() * 2); // 0 또는 1 랜덤 선택
      const authorId = req.user?.id || testUserIds[randomIndex];

      const updatedComment = await CommentService.update(
        req.params.id,
        req.body,
        authorId
      );
      res.json(updatedComment);
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  },

  /**
   * 댓글을 삭제합니다.
   * @param {Object} req - Express 요청 객체 (댓글 ID 포함)
   * @param {Object} res - Express 응답 객체
   */
  async deleteComment(req, res) {
    try {
      // 테스트 환경에서 authorId를 랜덤으로 선택
      const testUserIds = [
        "2b1d9484-b7c9-4a45-84c1-9c9208df777a", // 테스트유저2
        "ff75456f-bae4-4b48-9439-9f58f7b83a20", // 테스트유저1
      ];
      const randomIndex = Math.floor(Math.random() * 2); // 0 또는 1 랜덤 선택
      const authorId = req.user?.id || testUserIds[randomIndex];

      await CommentService.delete(req.params.id, authorId);
      res.status(204).end();
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  },

  /**
   * 내부 비즈니스 로직
   * 실제 데이터베이스 작업을 수행하는 메서드들
   */

  /**
   * 전체 댓글 목록을 조회하는 내부 메서드
   * @param {number} offset - 건너뛸 댓글 수
   * @param {number} limit - 가져올 댓글 수
   * @returns {Promise<Array>} 댓글 목록
   * @throws {CommentError} 조회 실패시 에러
   */
  async findAll(offset = 0, limit = 10) {
    try {
      return await prisma.comment.findMany({
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
      throw new CommentError("댓글 목록을 불러오는데 실패했습니다.", 500);
    }
  },

  /**
   * 특정 게시글의 댓글 목록을 조회하는 내부 메서드
   * @param {string} articleId - 게시글 ID
   * @returns {Promise<Array>} 댓글 목록
   * @throws {CommentError} 조회 실패시 에러
   */
  async findByArticleId(articleId) {
    try {
      return await prisma.comment.findMany({
        where: { articleId },
        orderBy: { createdAt: "desc" },
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
      throw new CommentError(
        "게시글의 댓글 목록을 불러오는데 실패했습니다.",
        500
      );
    }
  },

  /**
   * 특정 상품의 댓글 목록을 조회하는 내부 메서드
   * @param {string} productId - 상품 ID
   * @returns {Promise<Array>} 댓글 목록
   * @throws {CommentError} 조회 실패시 에러
   */
  async findByProductId(productId) {
    try {
      return await prisma.comment.findMany({
        where: { productId },
        orderBy: { createdAt: "desc" },
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
      throw new CommentError(
        "상품의 댓글 목록을 불러오는데 실패했습니다.",
        500
      );
    }
  },

  /**
   * 특정 댓글을 ID로 조회하는 내부 메서드
   * @param {string} id - 댓글 ID
   * @returns {Promise<Object>} 댓글 정보
   * @throws {CommentError} 댓글이 없거나 조회 실패시 에러
   */
  async findById(id) {
    try {
      const comment = await prisma.comment.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              nickname: true,
            },
          },
        },
      });

      if (!comment) {
        throw new CommentError("댓글을 찾을 수 없습니다.", 404);
      }

      return comment;
    } catch (error) {
      if (error instanceof CommentError) throw error;
      throw new CommentError("댓글을 불러오는데 실패했습니다.", 500);
    }
  },

  /**
   * 새로운 댓글을 생성하는 내부 메서드
   * @param {Object} commentData - 댓글 데이터 (내용, 게시글ID 또는 상품ID)
   * @param {string} authorId - 작성자 ID
   * @returns {Promise<Object>} 생성된 댓글 정보
   * @throws {CommentError} 생성 실패시 에러
   */
  async create(commentData, authorId) {
    try {
      const { content, articleId, productId } = commentData;
      return await prisma.comment.create({
        data: {
          content,
          author: {
            connect: { id: authorId },
          },
          ...(articleId && { article: { connect: { id: articleId } } }),
          ...(productId && { product: { connect: { id: productId } } }),
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
      throw new CommentError("댓글 생성에 실패했습니다.", 500);
    }
  },

  /**
   * 댓글을 수정하는 내부 메서드
   * @param {string} id - 댓글 ID
   * @param {Object} commentData - 수정할 댓글 데이터
   * @param {string} authorId - 작성자 ID (사용되지 않음)
   * @returns {Promise<Object>} 수정된 댓글 정보
   * @throws {CommentError} 수정 실패시 에러
   */
  async update(id, commentData, authorId) {
    try {
      const comment = await this.findById(id);

      return await prisma.comment.update({
        where: { id },
        data: {
          content: commentData.content,
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
      if (error instanceof CommentError) throw error;
      throw new CommentError("댓글 수정에 실패했습니다.", 500);
    }
  },

  /**
   * 댓글을 삭제하는 내부 메서드
   * @param {string} id - 댓글 ID
   * @param {string} authorId - 작성자 ID (사용되지 않음)
   * @throws {CommentError} 삭제 실패시 에러
   */
  async delete(id, authorId) {
    try {
      const comment = await this.findById(id);

      await prisma.comment.delete({ where: { id } });
    } catch (error) {
      if (error instanceof CommentError) throw error;
      throw new CommentError("댓글 삭제에 실패했습니다.", 500);
    }
  },
};
