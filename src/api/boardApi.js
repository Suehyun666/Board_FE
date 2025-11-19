/**
 * 게시판 API
 * 백엔드의 @RequestParam Long userId 요구사항을 맞추기 위해
 * URL 뒤에 ?userId=${userId} 형태로 파라미터를 전달합니다.
 */
import api from './axios'

// 로그인된 사용자 ID 가져오기 헬퍼
const getUserId = () => {
  const userId = localStorage.getItem('userId')
  if (!userId) {
    throw new Error('로그인이 필요합니다.')
  }
  return userId
}

export const boardApi = {
  /**
   * 게시글 목록 조회
   */
  getPosts: (page = 1, size = 20, search = '') => {
    const params = new URLSearchParams({ page: page - 1, size })
    if (search.trim()) params.append('keyword', search.trim())
    return api.get(`/boards?${params.toString()}`)
  },

  /**
   * 게시글 상세 조회
   */
  getPost: (id) => {
    const userId = localStorage.getItem('userId')
    // userId가 있으면 쿼리 파라미터로 전달 (로그인한 경우)
    const params = userId ? `?userId=${userId}` : ''
    return api.get(`/boards/${id}${params}`)
  },

  /**
   * 게시글 작성
   * - RequestBody (JSON): post
   * - RequestParam (Query String): userId
   * - RequestPart (File): files
   */
  createPost: (postData, files = []) => {
    const userId = getUserId()
    const formData = new FormData()

    // 'post' 파트: JSON 데이터를 Blob으로 변환하여 추가
    // content-type을 application/json으로 명시해야 백엔드 @RequestPart가 인식함
    formData.append('post', new Blob([JSON.stringify(postData)], { type: 'application/json' }))

    // 'files' 파트: 파일이 있으면 추가
    if (files && files.length > 0) {
      files.forEach(file => {
        formData.append('files', file)
      })
    }

    // ★ 중요: userId는 쿼리 파라미터(?userId=...)로 보냄
    return api.post(`/boards?userId=${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /**
   * 게시글 수정
   */
  updatePost: (id, postData) => {
    const userId = getUserId()
    return api.put(`/boards/${id}?userId=${userId}`, postData)
  },

  /**
   * 게시글 삭제
   */
  deletePost: (id) => {
    const userId = getUserId()
    return api.delete(`/boards/${id}?userId=${userId}`)
  }
}