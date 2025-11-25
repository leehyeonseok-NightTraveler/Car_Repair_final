import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// 공통 컴포넌트
import Header from './components/common/Header';
import Footer from "./components/common/Footer";

// 기존 팀원 페이지들
import RecommendMap from './pages/Map/RecommendMap';

//공지사항
import NoticeList from './pages/Notice/notice_list';
import NoticeWrite from "./pages/Notice/notice_write.jsx";
import NoticeView from "./pages/Notice/notice_view.jsx";
import NoticeModify from "./pages/Notice/notice_modify.jsx";

// FAQ (너 작업)
import FaqList from "./pages/faq/faq_list";
import FaqView from "./pages/faq/faq_view";
import FaqWrite from "./pages/faq/faq_write";
import FaqModify from "./pages/faq/faq_modify";

// 회원가입
import Register from './Register/Register.jsx';
import RegisterStore from './Register/RegisterStore.jsx';

// 관리자 마이페이지
import AdminMypage from './pages/Mypage/AdminMypage.jsx';

import InquiryWrite from './pages/inquiry/inquiry_write.jsx';
import InquiryHistory from './pages/inquiry/Inquiry_history.jsx';
import InquiryView from './pages/inquiry/inquiry_view.jsx';
import InquiryManage from './pages/inquiry/inquiry_manage.jsx';
import ReplyWrite from './pages/Inquiry/reply_write.jsx';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />

                <main className="flex-grow">
                    <Routes>
                        {/* 기존 팀원 페이지들 */}
                        <Route path="/recommend" element={<RecommendMap />} />

                        {/* 공지사항 */}
                        <Route path="/notice_list" element={<NoticeList />} />
                        <Route path="/notice_write" element={<NoticeWrite />} />
                        <Route path="/notice_view/:notice_no" element={<NoticeView />} />
                        <Route path="/notice_modify/:notice_no" element={<NoticeModify />} />


                        {/* 1:1 문의 라우팅 추가 (기존 경로 그대로!) */}
                        <Route path="/inquiry_write" element={<InquiryWrite />} />
                        <Route path="/inquiry_history" element={<InquiryHistory />} />
                        <Route path="/inquiry_view" element={<InquiryView />} />
                        <Route path="/inquiry_manage" element={<InquiryManage />} />
                        <Route path="/reply_write" element={<ReplyWrite />} />

                        {/* FAQ */}
                        <Route path="/faq" element={<FaqList />} />
                        <Route path="/faq/view/:faqNo" element={<FaqView />} />
                        <Route path="/faq/write" element={<FaqWrite />} />
                        <Route path="/faq/modify/:faqNo" element={<FaqModify />} />

                        {/* 회원가입 */}
                        <Route path="/register" element={<Register />} />
                        <Route path="/registerstore" element={<RegisterStore />} />

                        {/* 관리자 마이페이지 */}
                        <Route path="/admin/mypage" element={<AdminMypage />} />

                        {/* 필요하면 메인 페이지 추가 */}
                        <Route path="/" element={<div>메인 페이지 준비 중...</div>} />
                    </Routes>
                </main>

                <Footer />
            </div>
        </Router>
    );
}

export default App;