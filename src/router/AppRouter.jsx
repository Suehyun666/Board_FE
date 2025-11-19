import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from '../layout/MainLayout'

// 📄 페이지 컴포넌트 import
import Home from '../pages/home/Home'
import BoardList from '../pages/list/BoardList'
import BoardDetail from '../pages/detail/BoardDetail' 
import BoardWrite from '../pages/write/BoardWrite'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

function AppRouter() {
  return (
    <BrowserRouter>
      {/* 모든 페이지에 공통으로 적용되는 레이아웃 */}
      <MainLayout>
        {/* 경로별 페이지 정의 */}
        <Routes>
          {/* 홈 페이지 */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/boards" element={<BoardList />} />
          <Route path="/boards/:id" element={<BoardDetail />} />
          <Route path="/write" element={<BoardWrite />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default AppRouter