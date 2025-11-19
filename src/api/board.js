import api from './axios'

export const boardAPI = {
  // 게시글 목록 조회
  getPosts: (page = 1, size = 10) => {
    return api.get(`/posts?page=${page}&size=${size}`)
  },

  // 게시글 상세 조회
  getPost: (id) => {
    return api.get(`/posts/${id}`)
  },

  // 게시글 작성
  createPost: (data) => {
    return api.post('/posts', data)
  },

  // 게시글 수정
  updatePost: (id, data) => {
    return api.put(`/posts/${id}`, data)
  },

  // 게시글 삭제
  deletePost: (id) => {
    return api.delete(`/posts/${id}`)
  },
}
