import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { userApi } from '../../api'
import Button from '../../components/Button'
import './LoginPage.css'

function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await userApi.login(formData.username, formData.password)
      
      const userId = response.id 
      const nickname = response.nickname

      localStorage.setItem('userId', userId)
      localStorage.setItem('nickname', nickname)

      alert(`${nickname}님 환영합니다!`)
      navigate('/') 
    } catch (error) {
      console.error('Login failed', error)
    }
  }

  return (
    <div className="login-page">
      <h2>로그인</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>아이디</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="아이디를 입력하세요"
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
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>
        <Button type="submit">로그인</Button>
      </form>

      {/* 회원가입 링크 영역 추가 */}
      <div className="signup-link-area">
        <p>계정이 없으신가요?</p>
        <button 
          className="btn-link" 
          onClick={() => navigate('/register')}
        >
          회원가입
        </button>
      </div>
    </div>
  )
}

export default LoginPage