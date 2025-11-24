import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NoticeList from './pages/Notice/notice_list.jsx'
import AdminMypage from './pages/Mypage/AdminMypage.jsx'

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    {/* 공지사항 리스트 */}
                    <Route path="/notice_list" element={<NoticeList />} />

                    {/* 관리자 마이페이지 */}
                    <Route path="/admin/mypage" element={<AdminMypage />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
