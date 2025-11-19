import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { boardApi, commentApi } from '../../api'
import Button from '../../components/Button'
import './BoardDetail.css'

function BoardDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 댓글 상태
  const [comments, setComments] = useState([])
  const [commentContent, setCommentContent] = useState('')
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingContent, setEditingContent] = useState('')

  // 현재 로그인한 사용자 ID 가져오기
  const currentUserId = localStorage.getItem('userId')

  useEffect(() => {
    if (id) fetchPost()
  }, [id])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const postData = await boardApi.getPost(id)

      // 🔍 디버깅: 데이터 확인
      console.log('📌 Post Data:', postData)
      console.log('📌 isAuthor:', postData.isAuthor)
      console.log('📌 Current userId:', localStorage.getItem('userId'))

      setPost(postData)
      // 백엔드에서 댓글도 함께 리턴
      if (postData.comments) {
        setComments(postData.comments)
      }
      setError(null)
    } catch (err) {
      setError('게시글을 불러오는데 실패했습니다.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 댓글 작성
  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!currentUserId) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }
    if (!commentContent.trim()) {
      alert('댓글 내용을 입력해주세요.')
      return
    }

    try {
      await commentApi.createComment(id, { content: commentContent })
      setCommentContent('')
      // 댓글 목록 새로고침
      await fetchPost()
    } catch (err) {
      console.error('댓글 작성 실패:', err)
    }
  }

  // 댓글 수정
  const handleCommentEdit = (comment) => {
    setEditingCommentId(comment.id)
    setEditingContent(comment.content)
  }

  const handleCommentUpdate = async (commentId) => {
    if (!editingContent.trim()) {
      alert('댓글 내용을 입력해주세요.')
      return
    }

    try {
      await commentApi.updateComment(id, commentId, { content: editingContent })
      setEditingCommentId(null)
      setEditingContent('')
      await fetchPost()
    } catch (err) {
      console.error('댓글 수정 실패:', err)
    }
  }

  const handleCommentCancelEdit = () => {
    setEditingCommentId(null)
    setEditingContent('')
  }

  // 댓글 삭제
  const handleCommentDelete = async (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return

    try {
      await commentApi.deleteComment(id, commentId)
      await fetchPost()
    } catch (err) {
      console.error('댓글 삭제 실패:', err)
    }
  }

  const handleEdit = () => {
    if (!currentUserId) return alert('로그인이 필요합니다.')
    navigate(`/write?id=${id}`)
  }

  const handleDelete = async () => {
    if (!currentUserId) return alert('로그인이 필요합니다.')

    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await boardApi.deletePost(id)
        alert('삭제되었습니다.')
        navigate('/boards')
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handleBack = () => {
    navigate('/boards')
  }

  // 이미지 확인 헬퍼
  const isImage = (filename) => /\.(jpg|jpeg|png|gif|webp)$/i.test(filename)

  // URL 생성 헬퍼 - 파일 다운로드 엔드포인트 사용
  const getFileUrl = (fileUrl) => {
    if (!fileUrl) return ''
    if (fileUrl.startsWith('http')) return fileUrl

    const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || ''

    // /uploads/filename.jpg → /boards/files/filename.jpg
    if (fileUrl.startsWith('/uploads/')) {
      const fileName = fileUrl.replace('/uploads/', '')
      return `${baseUrl}/boards/files/${fileName}`
    }

    // 그 외의 경우
    const cleanPath = fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`
    return `${baseUrl}${cleanPath}`
  }

  if (loading) return <div className="loading">로딩 중...</div>
  if (error) return <div className="error">{error}</div>
  if (!post) return <div className="error">게시글을 찾을 수 없습니다.</div>

  // [핵심] 본인 확인 로직 - 백엔드에서 계산해서 리턴
  const isAuthor = post.isAuthor === true

  return (
    <div className="board-detail">
      <div className="detail-header">
        <h2 className="detail-title">{post.title}</h2>
        <div className="detail-meta">
          {/* [수정] nickname 우선, 없으면 author, 그래도 없으면 익명 */}
          <span className="detail-author">{post.authorNickname || post.author || '익명'}</span>
          <span className="detail-date">
            {new Date(post.createdAt).toLocaleString('ko-KR')}
          </span>
        </div>
      </div>

      <div className="detail-content">
        {post.content}

        {/* 이미지 미리보기 */}
        {post.files && post.files.length > 0 && (
          <div className="post-images">
            {post.files
              .filter(file => isImage(file.originalName))
              .map(file => (
                <div key={file.id} className="image-wrapper">
                  <img 
                    src={getFileUrl(file.fileUrl)} 
                    alt={file.originalName} 
                    className="content-image"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
          </div>
        )}
      </div>
      
      {/* 파일 다운로드 */}
      {post.files && post.files.length > 0 && (
        <div className="file-list">
          <h4>첨부파일 ({post.files.length})</h4>
          <ul>
            {post.files.map(file => (
              <li key={file.id}>
                 <a href={getFileUrl(file.fileUrl)} target="_blank" rel="noopener noreferrer" download>
                   📄 {file.originalName} ({(file.fileSize / 1024).toFixed(1)} KB)
                 </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="detail-actions">
        <Button onClick={handleBack} variant="secondary">목록</Button>
        <div className="action-right">
          {/* [핵심] isAuthor가 true일 때만 수정/삭제 버튼 렌더링 */}
          {isAuthor && (
            <>
              <Button onClick={handleEdit} variant="secondary">수정</Button>
              <Button onClick={handleDelete} variant="danger">삭제</Button>
            </>
          )}
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="comments-section">
        <h3 className="comments-title">댓글 ({comments.length})</h3>

        {/* 댓글 작성 폼 */}
        {currentUserId ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="댓글을 입력하세요..."
              rows="3"
              className="comment-input"
            />
            <div className="comment-form-actions">
              <Button type="submit">댓글 작성</Button>
            </div>
          </form>
        ) : (
          <div className="comment-login-notice">
            댓글을 작성하려면 <a href="/login">로그인</a>이 필요합니다.
          </div>
        )}

        {/* 댓글 목록 */}
        <div className="comments-list">
          {comments.length === 0 ? (
            <div className="no-comments">첫 댓글을 작성해보세요!</div>
          ) : (
            comments.map((comment) => {
              // 백엔드에서 계산해서 리턴
              const isCommentAuthor = comment.isAuthor === true

              return (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <span className="comment-author">{comment.authorNickname || '익명'}</span>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleString('ko-KR')}
                    </span>
                  </div>

                  {editingCommentId === comment.id ? (
                    // 수정 모드
                    <div className="comment-edit-form">
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        rows="3"
                        className="comment-input"
                      />
                      <div className="comment-edit-actions">
                        <Button onClick={() => handleCommentUpdate(comment.id)}>저장</Button>
                        <Button onClick={handleCommentCancelEdit} variant="secondary">취소</Button>
                      </div>
                    </div>
                  ) : (
                    // 일반 모드
                    <>
                      <p className="comment-content">{comment.content}</p>
                      {isCommentAuthor && (
                        <div className="comment-actions">
                          <button
                            onClick={() => handleCommentEdit(comment)}
                            className="comment-action-btn"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleCommentDelete(comment.id)}
                            className="comment-action-btn delete"
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default BoardDetail