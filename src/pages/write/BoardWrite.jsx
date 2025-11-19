import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { boardApi } from '../../api'
import Button from '../../components/Button'
import './BoardWrite.css'

function BoardWrite() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('id')

  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })
  // [추가] 파일 상태 관리
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      alert('로그인이 필요한 서비스입니다.')
      navigate('/login')
      return
    }

    if (editId) {
      fetchPost()
    }
  }, [editId, navigate])

  const fetchPost = async () => {
    try {
      const postData = await boardApi.getPost(editId)
      setFormData({
        title: postData.title || '',
        content: postData.content || ''
      })
      // 참고: 기존 파일 목록을 불러와서 보여주는 로직은 별도로 구현 필요
      // 여기서는 새 파일 업로드만 다룹니다.
    } catch (err) {
      navigate('/boards') 
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // [추가] 파일 선택 핸들러
  const handleFileChange = (e) => {
    // e.target.files는 FileList 객체이므로 배열로 변환
    const selectedFiles = Array.from(e.target.files)
    
    // 최대 10개 제한 (백엔드 설정 고려)
    if (selectedFiles.length > 10) {
      alert('파일은 최대 10개까지만 업로드 가능합니다.')
      e.target.value = '' // 선택 초기화
      return
    }

    setFiles(selectedFiles)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) return alert('제목을 입력해주세요.')
    if (!formData.content.trim()) return alert('내용을 입력해주세요.')

    try {
      setLoading(true)

      if (editId) {
        // 수정 시에는 현재 API 구조상 파일 수정 로직이 별도로 필요하거나, 
        // updatePost가 파일을 받도록 수정해야 합니다.
        // 일단 제목/내용 수정만 수행합니다.
        await boardApi.updatePost(editId, formData)
        alert('수정되었습니다.')
        navigate(`/boards/${editId}`)
      } else {
        // [수정] 작성 시 파일(files)도 함께 전달
        const result = await boardApi.createPost(formData, files)
        alert('작성되었습니다.')
        navigate(result.id ? `/boards/${result.id}` : '/boards')
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (window.confirm('작성을 취소하시겠습니까?')) {
      navigate(-1)
    }
  }

  return (
    <div className="board-write">
      <h2>{editId ? '게시글 수정' : '게시글 작성'}</h2>
      <form onSubmit={handleSubmit} className="write-form">
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="제목을 입력하세요"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="내용을 입력하세요"
            rows="15"
            required
          />
        </div>

        {/* [추가] 파일 업로드 입력 필드 */}
        <div className="form-group file-group">
          <label htmlFor="file">첨부파일 (이미지 등)</label>
          <input 
            type="file" 
            id="file" 
            multiple 
            onChange={handleFileChange}
            className="file-input"
            accept="image/*, .pdf, .txt" // 허용할 확장자 (선택사항)
          />
          <p className="file-help">최대 10개, 개당 5MB 이하의 파일만 업로드 가능합니다.</p>
          
          {/* 선택된 파일 목록 미리보기 */}
          {files.length > 0 && (
            <ul className="selected-files">
              {files.map((file, index) => (
                <li key={index}>{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-actions">
          <Button type="button" onClick={handleCancel} variant="secondary">취소</Button>
          <Button type="submit" disabled={loading}>
            {loading ? '저장 중...' : editId ? '수정' : '작성'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default BoardWrite