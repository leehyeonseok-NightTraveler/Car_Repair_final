import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Send, Bot, X, MessageCircle } from 'lucide-react';
import './App.css';

import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ChatWidget from './components/common/ChatWidget';   // 당신이 만든 위치 정확히!

// 실제 존재하는 메인 페이지
import MainPage from './pages/main/mainpage.jsx';   // mainpage.jsx → main.jsx로 변경!

// 나머지 페이지들 (기존에 있던 거 그대로)
import RecommendMap from './pages/Map/RecommendMap';

import NoticeList from './pages/Notice/notice_list';
import NoticeWrite from "./pages/Notice/notice_write.jsx";
import NoticeView from "./pages/Notice/notice_view.jsx";
import NoticeModify from "./pages/Notice/notice_modify.jsx";

import FaqList from "./pages/faq/faq_list";
import FaqView from "./pages/faq/faq_view";
import FaqWrite from "./pages/faq/faq_write";
import FaqModify from "./pages/faq/faq_modify";

import InquiryWrite from './pages/inquiry/inquiry_write.jsx';
import InquiryHistory from './pages/inquiry/Inquiry_history.jsx';
import InquiryView from './pages/inquiry/inquiry_view.jsx';
import InquiryManage from './pages/inquiry/inquiry_manage.jsx';
import ReplyWrite from './pages/Inquiry/reply_write.jsx';

import Register from './pages/Register/Register.jsx';
import RegisterStore from './pages/Register/RegisterStore.jsx';
import AdminMypage from './pages/Mypage/AdminMypage.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">

        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/recommend" element={<RecommendMap />} />

            <Route path="/notice_list" element={<NoticeList />} />
            <Route path="/notice_write" element={<NoticeWrite />} />
            <Route path="/notice_view/:notice_no" element={<NoticeView />} />
            <Route path="/notice_modify/:notice_no" element={<NoticeModify />} />

            <Route path="/faq" element={<FaqList />} />
            <Route path="/faq/view/:faqNo" element={<FaqView />} />
            <Route path="/faq/write" element={<FaqWrite />} />
            <Route path="/faq/modify/:faqNo" element={<FaqModify />} />

            <Route path="/inquiry_write" element={<InquiryWrite />} />
            <Route path="/inquiry_history" element={<InquiryHistory />} />
            <Route path="/inquiry_view/:inquiryNo" element={<InquiryView />} />
            <Route path="/inquiry_manage" element={<InquiryManage />} />
            <Route path="/reply_write/:inquiryNo" element={<ReplyWrite />} />

            <Route path="/register" element={<Register />} />
            <Route path="/registerstore" element={<RegisterStore />} />
            <Route path="/admin/mypage" element={<AdminMypage />} />
          </Routes>
        </main>

        <Footer />

        {/* 챗봇 위젯 — 모든 페이지에 항상 보임 */}
        <ChatWidget />

      </div>
    </Router>
  );
}

export default App;