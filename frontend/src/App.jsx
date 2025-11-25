import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import NoticeList from './pages/Notice/notice_list.jsx'
import Login from './pages/Login/login.jsx'
import StoreLogin from './pages/Login/storeLogin.jsx'
import FindAccount from './pages/FindAccount/findAccount.jsx'
import FindPW from './pages/FindAccount/findPW.jsx'
import FindOK from './pages/FindAccount/findOK.jsx'

function App() {
    return (
        <Router>
            <div>
                {/* 라우팅 */}
                <Routes>
                    <Route path="/notice_list" element={<NoticeList />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/storeLogin" element={<StoreLogin />} />
                    <Route path="/findAccount" element={<FindAccount />} />
                    <Route path="/findPW" element={<FindPW />} />
                    <Route path="/findOK" element={<FindOK />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
