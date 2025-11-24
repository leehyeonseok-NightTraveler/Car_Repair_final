import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import NoticeList from './Notice/notice_list.jsx'

function App() {
    return (
        <Router>
            <div>
                <h1>React Frontend Ready 🚀</h1>
                {/* 네비게이션 */}
                <nav>
                    <Link to="/notice_list">공지사항 목록</Link>
                </nav>

                {/* 라우팅 */}
                <Routes>
                    <Route path="/notice_list" element={<NoticeList />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
