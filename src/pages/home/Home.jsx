import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home">
      <h2>게시판에 오신 것을 환영합니다</h2>
      <p>자유롭게 글을 작성하고 공유해보세요.</p>

      <div className="quick-links">
        <Button onClick={() => navigate('/boards')}>
          게시글 보기
        </Button>
        <Button onClick={() => navigate('/write')} variant="secondary">
          글 작성하기
        </Button>
      </div>
    </div>
  )
}

export default Home
