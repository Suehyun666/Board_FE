import Header from './Header'
import Footer from './Footer'
import './Layout.css'

function MainLayout({ children }) {
  return (
    <div className="layout">
      {/* 상단 헤더 - 모든 페이지에 표시 */}
      <Header />

      {/* 메인 콘텐츠 영역 - 페이지별로 다른 내용 표시 */}
      <main className="main-content">
        {children}
      </main>

      {/* 하단 푸터 - 모든 페이지에 표시 */}
      <Footer />
    </div>
  )
}

export default MainLayout
