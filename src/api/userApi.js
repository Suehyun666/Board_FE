import api from './axios'

export const userApi = {
  // 로그인
  login: (username, password) => {
    return api.post('/users/login', { username, password })
  },

  // 회원가입
  register: (userData) => {
    return api.post('/users/register', userData)
  },

  // 사용자 정보 조회
  getUserInfo: (userId) => {
    return api.get(`/users/${userId}`)
  },

  // 사용자 정보 수정
  updateUser: (userId, userData) => {
    return api.put(`/users/${userId}`, userData)
  },

  // 회원 탈퇴
  deleteAccount: (userId) => {
    return api.delete(`/users/${userId}`)
  },

  // 내가 작성한 게시글 목록 조회
  getMyPosts: (userId, page = 0, size = 20) => {
    return api.get(`/users/${userId}/posts?page=${page}&size=${size}`)
  }
}