import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import NoticeList from './pages/Notice/notice_list.jsx'

function App() {
    return (
        <Router>
            <div>
                {/* 라우팅 */}
                <Routes>
                    <Route path="/notice_list" element={<NoticeList />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
