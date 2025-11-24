import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'; // 전역 스타일

// 1. 공통 컴포넌트 (헤더, 푸터)
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

// 2. [본인] FAQ 관련 페이지들 (경로: src/faq/...)
import FaqList from "./pages/faq/faq_list";
import FaqView from "./pages/faq/faq_view";
import FaqWrite from "./pages/faq/faq_write";
import FaqModify from "./pages/faq/faq_modify";

import NoticeList from "./pages/Notice/notice_list"; 

function App() {
  return (
    /* [수정] Header가 useLocation을 쓰려면 BrowserRouter 안에 있어야 합니다. */
    <Router>
      {/* 1. 헤더 (모든 페이지 공통) */}
      <Header />

      {/* 2. 본문 영역 */}
      {/* <main> 태그로 감싸야 푸터가 바닥에 예쁘게 붙습니다 (App.css 효과) */}
      <main>
        <Routes>
          <Route path="/" element={<FaqList />} />
          {/* --- [팀원] 공지사항 기능 --- */}
          <Route path="/notice_list" element={<NoticeList />} />

          {/* --- [본인] FAQ 기능 --- */}
          <Route path="/faq" element={<FaqList />} />
          <Route path="/faq/view/:faqNo" element={<FaqView />} />
          <Route path="/faq/write" element={<FaqWrite />} />
          <Route path="/faq/modify/:faqNo" element={<FaqModify />} />
        </Routes>
      </main>

      {/* 3. 푸터 (모든 페이지 공통) */}
      <Footer />
    </Router>
  );
}

export default App;