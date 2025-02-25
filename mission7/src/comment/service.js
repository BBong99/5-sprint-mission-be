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
      const { offset, limit } = req.query;
      const comments = await CommentService.findAll(
        Number(offset),
        Number(limit)
      );
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
      const comment = await CommentService.create(req.body, req.user.id);
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
      const updatedComment = await CommentService.update(
        req.params.id,
        req.body,
        req.user.id
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
      await CommentService.delete(req.params.id, req.user.id);
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
   * @param {string} authorId - 작성자 ID (권한 확인용)
   * @returns {Promise<Object>} 수정된 댓글 정보
   * @throws {CommentError} 수정 권한이 없거나 실패시 에러
   */
  async update(id, commentData, authorId) {
    try {
      const comment = await this.findById(id);

      if (comment.authorId !== authorId) {
        throw new CommentError("댓글을 수정할 권한이 없습니다.", 403);
      }

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
   * @param {string} authorId - 작성자 ID (권한 확인용)
   * @throws {CommentError} 삭제 권한이 없거나 실패시 에러
   */
  async delete(id, authorId) {
    try {
      const comment = await this.findById(id);

      if (comment.authorId !== authorId) {
        throw new CommentError("댓글을 삭제할 권한이 없습니다.", 403);
      }

      await prisma.comment.delete({ where: { id } });
    } catch (error) {
      if (error instanceof CommentError) throw error;
      throw new CommentError("댓글 삭제에 실패했습니다.", 500);
    }
  },
};
