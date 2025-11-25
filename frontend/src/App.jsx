import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// 1. 공통 컴포넌트
import Header from './components/common/Header';
import Footer from "./components/common/Footer";

// 2. [팀원] 지도 및 메인 관련 컴포넌트
import RecommendMap from './pages/Map/RecommendMap';
import MainPage from './pages/main/mainpage'; // 메인 페이지

// 3. [공지사항]
import NoticeList from './pages/Notice/notice_list';
import NoticeWrite from "./pages/Notice/notice_write.jsx";
import NoticeView from "./pages/Notice/notice_view.jsx";
import NoticeModify from "./pages/Notice/notice_modify.jsx";

// 4. [FAQ]
import FaqList from "./pages/faq/faq_list";
import FaqView from "./pages/faq/faq_view";
import FaqWrite from "./pages/faq/faq_write";
import FaqModify from "./pages/faq/faq_modify";

// 5. [1:1 문의] (새로 추가된 항목)
import InquiryWrite from './pages/inquiry/inquiry_write.jsx';
import InquiryHistory from './pages/inquiry/Inquiry_history.jsx';
import InquiryView from './pages/inquiry/inquiry_view.jsx';
import InquiryManage from './pages/inquiry/inquiry_manage.jsx';
import ReplyWrite from './pages/Inquiry/reply_write.jsx';

// 6. 회원/관리
import Register from './pages/Register/Register.jsx';
import RegisterStore from './pages/Register/RegisterStore.jsx';
import AdminMypage from './pages/Mypage/AdminMypage.jsx';


function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">

                {/* 헤더 */}
                <Header />

                {/* 본문 영역 */}
                <main className="flex-grow">
                    <Routes>

                        {/* --- [메인 페이지] --- */}
                        <Route path="/" element={<MainPage />} />

                        {/* --- [지도] --- */}
                        <Route path="/recommend" element={<RecommendMap />} />

                        {/* --- [공지사항] --- */}
                        <Route path="/notice_list" element={<NoticeList />} />
                        <Route path="/notice_write" element={<NoticeWrite />} />
                        <Route path="/notice_view/:notice_no" element={<NoticeView />} />
                        <Route path="/notice_modify/:notice_no" element={<NoticeModify />} />

                        {/* --- [FAQ 기능] --- */}
                        <Route path="/faq" element={<FaqList />} />
                        <Route path="/faq/view/:faqNo" element={<FaqView />} />
                        <Route path="/faq/write" element={<FaqWrite />} />
                        <Route path="/faq/modify/:faqNo" element={<FaqModify />} />

                        {/* --- [1:1 문의 기능] --- */}
                        <Route path="/inquiry_write" element={<InquiryWrite />} />
                        <Route path="/inquiry_history" element={<InquiryHistory />} />
                        {/* 참고: 상세보기와 답변 작성은 파라미터를 받을 수 있도록 수정하는 것을 권장합니다. */}
                        <Route path="/inquiry_view/:inquiryNo" element={<InquiryView />} />
                        <Route path="/inquiry_manage" element={<InquiryManage />} />
                        <Route path="/reply_write/:inquiryNo" element={<ReplyWrite />} />

                        {/* --- [회원/관리] --- */}
                        <Route path="/register" element={<Register />} />
                        <Route path="/registerstore" element={<RegisterStore />} />
                        <Route path="/admin/mypage" element={<AdminMypage />} />

                    </Routes>
                </main>

                {/* 푸터 */}
                <Footer />

            </div>
        </Router>
    );
}

export default App;