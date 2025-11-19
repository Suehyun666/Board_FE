import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userApi } from '../../api'
import Button from '../../components/Button'
import './RegisterPage.css' 

function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nickname: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // 간단한 유효성 검사
    if (!formData.username || !formData.password || !formData.nickname) {
      alert('모든 필드를 입력해주세요.')
      return
    }

    try {
      setLoading(true)
      // 회원가입 요청 ({ username, password, nickname })
      await userApi.register(formData)
      
      alert('회원가입이 완료되었습니다. 로그인해주세요.')
      navigate('/login')
    } catch (error) {
      // axios 인터셉터가 이미 에러 메시지(예: "이미 존재하는 아이디입니다.")를 alert로 띄워줌
      console.error('Registration failed', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page"> {/* 스타일 재사용 */}
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>아이디</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="사용할 아이디"
            required
          />
        </div>

        <div className="form-group">
          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호"
            required
          />
        </div>

        <div className="form-group">
          <label>닉네임</label>
          <input
            type="text"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            placeholder="별명"
            required
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? '가입 중...' : '가입하기'}
        </Button>
      </form>

      <div className="signup-link-area">
        <p>이미 계정이 있으신가요?</p>
        <button 
          className="btn-link" 
          onClick={() => navigate('/login')}
        >
          로그인하기
        </button>
      </div>
    </div>
  )
}

export default RegisterPage