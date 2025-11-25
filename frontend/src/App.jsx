import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // 본인 작업: 전역 스타일

// 1. 공통 컴포넌트
import Header from './components/common/Header'; // 확장자(.jsx)는 자동 처리되므로 생략 가능
import Footer from "./components/common/Footer"; // 본인 작업: 푸터 추가

// 2. [팀원] 지도 및 메인 관련 컴포넌트
import RecommendMap from './pages/Map/RecommendMap'; 

// 3. [팀원] 공지사항
import NoticeList from './pages/Notice/notice_list';

// 4. [본인] FAQ 관련 페이지들
import FaqList from "./pages/faq/faq_list";
import FaqView from "./pages/faq/faq_view";
import FaqWrite from "./pages/faq/faq_write";
import FaqModify from "./pages/faq/faq_modify";

// 메인 페이지
import MainPage from './pages/main/mainpage';

function App() {
  return (
    <Router>
      {/* 팀원 작업: 전체 레이아웃 스타일 (Tailwind CSS) */}
      <div className="min-h-screen bg-gray-50 flex flex-col">
        
        {/* 헤더 */}
        <Header />

        {/* 본문 영역: flex-grow를 주면 내용이 적어도 푸터가 바닥에 붙습니다 */}
        <main className="flex-grow">
          <Routes>
          
            {/* [메인 페이지 추가] */}
            <Route path="/" element={<MainPage />} /> 

            {/* 지도는 '/recommend'를 입력해야 접근 가능 */}
            <Route path="/recommend" element={<RecommendMap />} />

            {/* --- [공지사항] --- */}
            <Route path="/notice_list" element={<NoticeList />} />

            {/* --- [FAQ 기능 (본인 작업)] --- */}
            <Route path="/faq" element={<FaqList />} />
            <Route path="/faq/view/:faqNo" element={<FaqView />} />
            <Route path="/faq/write" element={<FaqWrite />} />
            <Route path="/faq/modify/:faqNo" element={<FaqModify />} />
          </Routes>
        </main>

        {/* 푸터 (본인 작업) */}
        <Footer />
        
      </div>
    </Router>
  );
}

export default App;