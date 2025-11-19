/**
 * Axios 인스턴스 설정
 * - baseURL: .env 파일의 VITE_API_BASE_URL 사용
 */
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 필요 시 토큰 추가 로직
    // const token = localStorage.getItem('token')
    // if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// 응답 인터셉터 (ApiResult 처리)
api.interceptors.response.use(
  (response) => {
    const apiResult = response.data
    if (apiResult.success) {
      return apiResult.data
    } else {
      const errorMsg = apiResult.data?.message || '알 수 없는 오류가 발생했습니다.'
      alert(errorMsg)
      return Promise.reject(new Error(errorMsg))
    }
  },
  (error) => {
    let errorMessage = '서버 통신 중 오류가 발생했습니다.'
    if (error.response && error.response.data) {
      const apiResult = error.response.data
      if (apiResult.data && apiResult.data.message) {
        errorMessage = apiResult.data.message
      } else if (apiResult.message) {
        errorMessage = apiResult.message
      }
    }
    alert(errorMessage)
    return Promise.reject(error)
  }
)

export default api