import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // 전역 스타일

// 1. 공통 컴포넌트
import Header from "./components/common/Header.jsx";
import Footer from "./components/common/Footer.jsx";

// 2. 페이지 컴포넌트들
import MainPage from './pages/main/mainpage';
import NoticeList from './pages/Notice/notice_list';
import RecommendMap from './pages/Map/RecommendMap';

// 3. FAQ
import FaqList from "./pages/faq/faq_list";
import FaqView from "./pages/faq/faq_view";
import FaqWrite from "./pages/faq/faq_write";
import FaqModify from "./pages/faq/faq_modify";

// 4. 회원가입 (폴더명 소문자 register 주의!)
import Register from './Register/Register.jsx';
import RegisterStore from './Register/RegisterStore.jsx';

// 5. 꿀팁 가이드
import Guide from './Gaide/Gaide.jsx';
import Guide1 from './Gaide/Gaide-1.jsx';
import Guide2 from './Gaide/Gaide-2.jsx';
import Guide3 from './Gaide/Gaide-3.jsx';
import Guide4 from './Gaide/Gaide-4.jsx';

// 6. 마이페이지
import AdminMypage from './pages/Mypage/AdminMypage.jsx';

function App() {
  return (
    <Router>
      {/* 전체 레이아웃 (Tailwind CSS) */}
      <div className="min-h-screen bg-gray-50 flex flex-col">
        
        {/* 헤더 (고정) */}
        <Header />

        {/* 본문 영역 (내용물) */}
        <main className="flex-grow">
          <Routes>
            {/* 메인 페이지 */}
            <Route path="/" element={<MainPage />} /> 

            {/* 공지사항 */}
            <Route path="/notice_list" element={<NoticeList />} />

            {/* 지도 */}
            <Route path="/recommend" element={<RecommendMap />} />

            {/* 회원가입 */}
            <Route path="/register" element={<Register />} />
            <Route path="/registerstore" element={<RegisterStore />} />

            {/* 꿀팁 가이드 */}
            <Route path="/guide" element={<Guide />} />   
            <Route path="/guide-1" element={<Guide1 />} />   
            <Route path="/guide-2" element={<Guide2 />} />
            <Route path="/guide-3" element={<Guide3 />} />
            <Route path="/guide-4" element={<Guide4 />} />

            {/* FAQ */}
            <Route path="/faq" element={<FaqList />} />
            <Route path="/faq/view/:faqNo" element={<FaqView />} />
            <Route path="/faq/write" element={<FaqWrite />} />
            <Route path="/faq/modify/:faqNo" element={<FaqModify />} />

            {/* 관리자 마이페이지 */}
            <Route path="/admin/mypage" element={<AdminMypage />} />
          </Routes>
        </main>

        {/* 푸터 (고정) */}
        <Footer />
        
      </div>
    </Router>
  );
}

export default App;