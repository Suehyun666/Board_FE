import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import { userApi } from '../../api'
import './Mypage.css'

function MyPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

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
      setLoading(true)
      const userData = await userApi.getUserInfo(userId)
      setUser(userData)
    } catch (err) {
      console.error('사용자 정보 조회 실패:', err)
      // API가 없다면 로컬스토리지 사용
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return
    }

    const userId = localStorage.getItem('userId')
    if (!userId) {
      alert('사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.')
      return
    }

    try {
      await userApi.deleteAccount(userId)

      // 성공 시 처리
      localStorage.clear()
      alert('탈퇴가 완료되었습니다.')
      navigate('/')
    } catch (err) {
      console.error('탈퇴 처리 중 오류:', err)
    }
  }

  if (loading) {
    return <div className="loading">로딩 중...</div>
  }

  return (
    <div className="mypage-container">
        <div className="mypage-card">
          <h2 className="mypage-title">내 정보 관리</h2>

          <div className="user-info-summary">
            <p><strong>{user?.username || user?.nickname || '게스트'}</strong>님, 안녕하세요.</p>
            {user?.email && <p className="user-email">{user.email}</p>}
          </div>

          <div className="action-buttons">
            <Button
              className="btn-edit"
              onClick={() => navigate('/mypage/edit')}
            >
              정보 수정하기
            </Button>

            <Button
              className="btn-posts"
              onClick={() => navigate('/mypage/posts')}
            >
              내가 쓴 글 보기
            </Button>

            <Button
              className="btn-delete"
              onClick={handleDeleteAccount}
              style={{ backgroundColor: '#ff6b6b', color: 'white' }}
            >
              탈퇴 하기
            </Button>
          </div>
        </div>
      </div>
  )
}

export default MyPage