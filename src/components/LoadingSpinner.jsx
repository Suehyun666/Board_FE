/**
 * ============================================
 * LoadingSpinner.jsx - 로딩 표시 컴포넌트
 * ============================================
 *
 * 📌 역할:
 *  - 데이터를 불러오는 동안 사용자에게 로딩 중임을 표시
 *  - API 호출 중, 페이지 로딩 중 등에 사용
 *
 * 💡 사용법:
 *  {loading && <LoadingSpinner />}
 *  {loading ? <LoadingSpinner /> : <YourContent />}
 *
 * 💡 사용 시나리오:
 *  - 게시글 목록을 서버에서 가져오는 동안
 *  - 파일 업로드 중
 *  - 로그인 처리 중
 */

import './LoadingSpinner.css'

function LoadingSpinner({ message = '로딩 중...' }) {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  )
}

export default LoadingSpinner

/**
 * 💡 사용 예시:
 *
 * import { useState, useEffect } from 'react'
 * import LoadingSpinner from './components/LoadingSpinner'
 *
 * function BoardList() {
 *   const [loading, setLoading] = useState(true)
 *   const [posts, setPosts] = useState([])
 *
 *   useEffect(() => {
 *     // 데이터 가져오기
 *     fetchPosts().then(data => {
 *       setPosts(data)
 *       setLoading(false)  // 로딩 완료
 *     })
 *   }, [])
 *
 *   if (loading) {
 *     return <LoadingSpinner message="게시글을 불러오는 중..." />
 *   }
 *
 *   return <div>{posts.map(...)}</div>
 * }
 */
