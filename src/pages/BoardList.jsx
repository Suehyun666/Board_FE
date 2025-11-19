import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { boardAPI } from '../api/board'
import './BoardList.css'

function BoardList() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchPosts()
  }, [currentPage])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await boardAPI.getPosts(currentPage, 10)
      setPosts(response.data.content || response.data)
      setTotalPages(response.data.totalPages || 1)
      setError(null)
    } catch (err) {
      setError('게시글을 불러오는데 실패했습니다.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePostClick = (id) => {
    navigate(`/boards/${id}`)
  }

  const handleWriteClick = () => {
    navigate('/write')
  }

  if (loading) {
    return <div className="loading">로딩 중...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="board-list">
      <div className="board-header">
        <h2>게시글 목록</h2>
        <button onClick={handleWriteClick} className="btn btn-primary">
          글쓰기
        </button>
      </div>

      <div className="post-list">
        {posts.length === 0 ? (
          <div className="empty-message">아직 작성된 게시글이 없습니다.</div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="post-item"
              onClick={() => handlePostClick(post.id)}
            >
              <div className="post-main">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-content">{post.content}</p>
              </div>
              <div className="post-meta">
                <span className="post-author">{post.author || '익명'}</span>
                <span className="post-date">
                  {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="btn"
          >
            이전
          </button>
          <span className="page-info">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="btn"
          >
            다음
          </button>
        </div>
      )}
    </div>
  )
}

export default BoardList
