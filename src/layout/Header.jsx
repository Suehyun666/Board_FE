import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import './Header.css'

function Header() {
  const navigate = useNavigate()
  const location = useLocation() // 페이지 이동 감지
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // 페이지가 바뀔 때마다 로그인 상태 체크
  useEffect(() => {
    const userId = localStorage.getItem('userId')
    setIsLoggedIn(!!userId) // userId가 있으면 true, 없으면 false
  }, [location])

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      localStorage.removeItem('userId')
      localStorage.removeItem('nickname')
      setIsLoggedIn(false)
      alert('로그아웃 되었습니다.')
      navigate('/') // 홈으로 이동
    }
  }

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo-link">
          <h1 className="logo">게시판</h1>
        </Link>

        <nav className="nav">
          {/* 공통 메뉴 */}
          <Link to="/boards" className="nav-link">게시글</Link>

          {/* 로그인 상태에 따른 메뉴 분기 */}
          {isLoggedIn ? (
            <>
              <Link to="/write" className="nav-link">글쓰기</Link>
              <Link to="/mypage" className="nav-link">마이페이지</Link>
              <button onClick={handleLogout} className="nav-link logout-btn">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">로그인</Link>
              <Link to="/register" className="nav-link highlight">회원가입</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header