/**
 * 댓글 API
 * 댓글 CRUD 기능 제공
 */
import api from './axios'

export const commentApi = {
  /**
   * 특정 게시글의 댓글 목록 조회
   * @param {number} postId - 게시글 ID
   * @returns {Promise} 댓글 목록
   */
  getComments: (postId) => {
    return api.get(`/boards/${postId}/comments`)
  },

  /**
   * 댓글 작성
   * @param {number} postId - 게시글 ID
   * @param {Object} commentData - 댓글 데이터 { content, userId }
   * @returns {Promise} 생성된 댓글 ID
   */
  createComment: (postId, commentData) => {
    const { userId, ...bodyData } = commentData
    return api.post(`/boards/${postId}/comments?userId=${userId}`, bodyData)
  },

  /**
   * 댓글 수정
   * @param {number} postId - 게시글 ID
   * @param {number} commentId - 댓글 ID
   * @param {Object} commentData - 수정할 데이터 { content, userId }
   * @returns {Promise}
   */
  updateComment: (postId, commentId, commentData) => {
    const { userId, ...bodyData } = commentData
    return api.put(`/boards/${postId}/comments/${commentId}?userId=${userId}`, bodyData)
  },

  /**
   * 댓글 삭제
   * @param {number} postId - 게시글 ID
   * @param {number} commentId - 댓글 ID
   * @param {number} userId - 사용자 ID
   * @returns {Promise}
   */
  deleteComment: (postId, commentId, userId) => {
    return api.delete(`/boards/${postId}/comments/${commentId}?userId=${userId}`)
  }
}
