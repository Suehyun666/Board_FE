import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import { userApi } from '../../api'
import './MyPosts.css'

function MyPosts() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }

    fetchMyPosts(userId, page)
  }, [page, navigate])

  const fetchMyPosts = async (userId, currentPage) => {
    try {
      setLoading(true)
      const response = await userApi.getMyPosts(userId, currentPage, 20)

      // 응답 형식에 따라 조정
      if (response.content) {
        setPosts(response.content)
        setTotalPages(response.totalPages || 0)
      } else if (Array.isArray(response)) {
        setPosts(response)
      } else {
        setPosts([])
      }
    } catch (err) {
      console.error('내 게시글 조회 실패:', err)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const handlePostClick = (postId) => {
    navigate(`/boards/${postId}`)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage)
    }
  }

  if (loading) {
    return <div className="loading">로딩 중...</div>
  }

  return (
    <div className="my-posts-container">
        <div className="my-posts-header">
          <h2 className="my-posts-title">내가 쓴 글</h2>
          <Button onClick={() => navigate('/mypage')} variant="secondary">
            뒤로 가기
          </Button>
        </div>

        {posts.length === 0 ? (
          <div className="no-posts">
            <p>작성한 게시글이 없습니다.</p>
            <Button onClick={() => navigate('/write')}>글쓰기</Button>
          </div>
        ) : (
          <>
            <div className="posts-list">
              {posts.map(post => (
                <div
                  key={post.id}
                  className="post-item"
                  onClick={() => handlePostClick(post.id)}
                >
                  <div className="post-header">
                    <h3 className="post-title">{post.title}</h3>
                    <span className="post-date">
                      {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <p className="post-content-preview">
                    {post.content?.substring(0, 100)}
                    {post.content?.length > 100 ? '...' : ''}
                  </p>
                  <div className="post-meta">
                    <span>조회수: {post.viewCount || 0}</span>
                    {post.files && post.files.length > 0 && (
                      <span>첨부파일: {post.files.length}개</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <Button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                  variant="secondary"
                >
                  이전
                </Button>
                <span className="page-info">
                  {page + 1} / {totalPages}
                </span>
                <Button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages - 1}
                  variant="secondary"
                >
                  다음
                </Button>
              </div>
            )}
          </>
        )}
      </div>
  )
}

export default MyPosts
