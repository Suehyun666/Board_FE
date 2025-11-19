import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="home">
      <h2>게시판에 오신 것을 환영합니다</h2>
      <p>자유롭게 글을 작성하고 공유해보세요.</p>

      <div className="quick-links">
        <Link to="/boards" className="btn btn-primary">게시글 보기</Link>
        <Link to="/write" className="btn btn-secondary">글 작성하기</Link>
      </div>
    </div>
  )
}

export default Home
