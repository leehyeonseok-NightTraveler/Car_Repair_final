import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import NoticeList from './pages/Notice/notice_list.jsx'
import Register from './Register/Register.jsx'
import RegisterStore from './Register/RegisterStore.jsx'
import Header from './components/common/Header.jsx' 
import Footer from './components/common/Footer.jsx'

function App() {
    return (
        <Router>
            <div className="App">
                
                {/* ★ 2. 헤더는 Routes 위에 적기 (고정) */}
                <Header />

                {/* 여기가 변하는 화면 (내용물) */}
                <Routes>
                    <Route path="/notice_list" element={<NoticeList />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/registerstore" element={<RegisterStore />} />
                </Routes>

                {/* ★ 3. 푸터는 Routes 아래에 적기 (고정) */}
                <Footer />
                
            </div>
        </Router>
    )
}

export default App
