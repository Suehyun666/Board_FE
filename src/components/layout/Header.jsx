import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo-link">
          <h1 className="logo">게시판</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">홈</Link>
          <Link to="/boards" className="nav-link">게시글</Link>
          <Link to="/write" className="nav-link">글쓰기</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
