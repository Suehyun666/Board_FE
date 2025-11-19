import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { boardApi } from '../../api'
import Button from '../../components/Button'
import './BoardList.css'

function BoardList() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  // error 상태는 UI에 표시할 때만 사용 (alert는 axios가 처리)
  
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isEmpty, setIsEmpty] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [currentPage, searchTerm])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      // axios 인터셉터가 data 알맹이(Page 객체)만 바로 줌
      const pageData = await boardApi.getPosts(currentPage, 20, searchTerm)

      if (pageData.empty || pageData.content?.length === 0) {
        setIsEmpty(true)
        setPosts([])
      } else {
        setIsEmpty(false)
        setPosts(pageData.content)
      }

      setTotalPages(pageData.totalPages || 1)
    } catch (err) {
      // axios에서 이미 alert를 띄웠으므로 여기선 로딩 해제만 해도 됨
      // UI에 에러 상태를 표시하고 싶다면 여기서 처리
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchTerm(searchInput)
    setCurrentPage(1)
  }

  const handleSearchReset = () => {
    setSearchInput('')
    setSearchTerm('')
    setCurrentPage(1)
  }

  const handlePostClick = (id) => {
    navigate(`/boards/${id}`)
  }

  const handleWriteClick = () => {
    navigate('/write')
  }

  const goToPage = (page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  if (loading) {
    return <div className="loading">로딩 중...</div>
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pageNumbers = []
    const showPages = 5
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2))
    let endPage = Math.min(totalPages, startPage + showPages - 1)

    if (endPage - startPage < showPages - 1) {
      startPage = Math.max(1, endPage - showPages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return (
      <div className="pagination">
        <Button
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
          variant="secondary"
        >
          ≪
        </Button>
        <Button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          variant="secondary"
        >
          ‹
        </Button>

        {pageNumbers.map(page => (
          <button
            key={page}
            onClick={() => goToPage(page)}
            className={`page-number ${currentPage === page ? 'active' : ''}`}
          >
            {page}
          </button>
        ))}

        <Button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="secondary"
        >
          ›
        </Button>
        <Button
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
          variant="secondary"
        >
          ≫
        </Button>
      </div>
    )
  }

  return (
    <div className="board-list">
      <div className="board-header">
        <h2>게시글 목록</h2>
        <Button onClick={handleWriteClick}>글쓰기</Button>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="제목 또는 내용 검색..."
          className="search-input"
        />
        <Button type="submit">검색</Button>
        {searchTerm && (
          <Button type="button" onClick={handleSearchReset} variant="secondary">
            초기화
          </Button>
        )}
      </form>

      {searchTerm && (
        <div className="search-info">
          "{searchTerm}" 검색 결과
        </div>
      )}

      {isEmpty ? (
        <div className="empty-message">게시물이 없습니다.</div>
      ) : (
        <>
          <div className="post-list">
            {posts.map((post) => (
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
                  <span className="post-author">{post.authorNickname || '익명'}</span>
                  <span className="post-date">
                    {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {renderPagination()}
        </>
      )}
    </div>
  )
}

export default BoardList