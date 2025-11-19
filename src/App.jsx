import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import BoardList from './pages/BoardList'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/boards" element={<BoardList />} />
          {/* 나중에 추가할 라우트들 */}
          {/* <Route path="/boards/:id" element={<BoardDetail />} /> */}
          {/* <Route path="/write" element={<BoardWrite />} /> */}
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
