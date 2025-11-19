/**
 * ============================================
 * Footer.jsx - 하단 푸터
 * ============================================
 *
 * 📌 역할:
 *  - 모든 페이지 하단에 표시되는 푸터
 *  - 저작권 정보와 링크 표시
 *
 * 💡 수정 가이드:
 *  - 링크 추가/변경: <a href="/경로">텍스트</a> 수정
 *  - 저작권 문구 변경: <p> 태그 안 텍스트 수정
 *  - 스타일 변경: Footer.css 파일 수정
 */

import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* 저작권 정보 - 현재 연도 자동 표시 */}
        <p className="footer-text">
          &copy; {new Date().getFullYear()} 게시판 프로젝트. All rights reserved.
        </p>

        {/* 하단 링크들 */}
        <div className="footer-links">
          <a href="/about" className="footer-link">소개</a>
          <a href="/contact" className="footer-link">문의</a>
          <a href="/privacy" className="footer-link">개인정보처리방침</a>
          {/* 💡 링크 추가 예시: */}
          {/* <a href="/terms" className="footer-link">이용약관</a> */}
        </div>
      </div>
    </footer>
  )
}

export default Footer
