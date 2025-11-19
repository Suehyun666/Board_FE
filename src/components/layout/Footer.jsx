import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          &copy; {new Date().getFullYear()} 게시판 프로젝트. All rights reserved.
        </p>
        <div className="footer-links">
          <a href="/about" className="footer-link">소개</a>
          <a href="/contact" className="footer-link">문의</a>
          <a href="/privacy" className="footer-link">개인정보처리방침</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
