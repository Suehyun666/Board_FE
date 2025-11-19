import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layout/MainLayout'
import Home from './pages/home/Home'
import BoardList from './pages/list/BoardList'
import BoardDetail from './pages/detail/BoardDetail' 
import BoardWrite from './pages/write/BoardWrite'
import LoginPage from './pages/login/LoginPage' 
import RegisterPage from './pages/register/RegisterPage'
import MyPage from './pages/user/Mypage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} /> 
          <Route path="/register" element={<RegisterPage />} /> 
          <Route path="/boards" element={<BoardList />} />
          <Route path="/boards/:id" element={<BoardDetail />} /> 
          <Route path="/write" element={<BoardWrite />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App