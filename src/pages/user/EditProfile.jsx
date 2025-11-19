import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import { userApi } from '../../api'
import './EditProfile.css'

function EditProfile() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    if (!userId) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }

    fetchUserInfo(userId)
  }, [navigate])

  const fetchUserInfo = async (userId) => {
    try {
      const userData = await userApi.getUserInfo(userId)
      setFormData({
        username: userData.username || '',
        nickname: userData.nickname || '',
        email: userData.email || '',
        password: '',
        confirmPassword: ''
      })
    } catch (err) {
      console.error('사용자 정보 조회 실패:', err)
      // API가 없다면 로컬스토리지 사용
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const user = JSON.parse(storedUser)
        setFormData(prev => ({
          ...prev,
          username: user.username || '',
          nickname: user.nickname || '',
          email: user.email || ''
        }))
      }
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 비밀번호 변경 시 확인
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }

    const userId = localStorage.getItem('userId')
    if (!userId) {
      alert('로그인 정보가 없습니다.')
      return
    }

    try {
      setLoading(true)

      // 비밀번호가 입력되지 않았으면 제외
      const updateData = {
        username: formData.username,
        nickname: formData.nickname,
        email: formData.email
      }

      if (formData.password) {
        updateData.password = formData.password
      }

      await userApi.updateUser(userId, updateData)

      // 로컬스토리지 업데이트
      const updatedUser = { ...updateData, id: userId }
      localStorage.setItem('user', JSON.stringify(updatedUser))

      alert('정보가 수정되었습니다.')
      navigate('/mypage')
    } catch (err) {
      console.error('정보 수정 실패:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="edit-profile-container">
        <div className="edit-profile-card">
          <h2 className="edit-profile-title">내 정보 수정</h2>

          <form onSubmit={handleSubmit} className="edit-profile-form">
            <div className="form-group">
              <label htmlFor="username">사용자 이름</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="사용자 이름"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="nickname">닉네임</label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="닉네임"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">새 비밀번호 (변경 시에만 입력)</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="새 비밀번호"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">새 비밀번호 확인</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="비밀번호 확인"
              />
            </div>

            <div className="form-actions">
              <Button
                type="button"
                onClick={() => navigate('/mypage')}
                variant="secondary"
              >
                취소
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? '저장 중...' : '저장'}
              </Button>
            </div>
          </form>
        </div>
      </div>
  )
}

export default EditProfile
