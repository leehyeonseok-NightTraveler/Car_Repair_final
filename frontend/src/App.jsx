import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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

// 5. [1:1 문의]
import InquiryWrite from './pages/inquiry/inquiry_write.jsx';
import InquiryHistory from './pages/inquiry/Inquiry_history.jsx';
import InquiryView from './pages/inquiry/inquiry_view.jsx';
import InquiryManage from './pages/inquiry/inquiry_manage.jsx';
import ReplyWrite from './pages/Inquiry/reply_write.jsx';

// 6. [회원/관리]
import Register from './pages/Register/Register.jsx';
import RegisterStore from './pages/Register/RegisterStore.jsx';
import AdminMypage from './pages/Mypage/AdminMypage.jsx';

// 7. [꿀팁 가이드] (SCRUM-27 추가)
import Guide from './pages/Gaide/Gaide.jsx'; // 폴더명 Gaide로 수정했습니다.
import Guide1 from './pages/Gaide/Gaide-1.jsx';
import Guide2 from './pages/Gaide/Gaide-2.jsx';
import Guide3 from './pages/Gaide/Gaide-3.jsx';
import Guide4 from './pages/Gaide/Gaide-4.jsx';

// 8. [로그인/계정 찾기]
import Login from './pages/Login/login.jsx';
import StoreLogin from './pages/Login/storeLogin.jsx';
import FindAccount from './pages/FindAccount/findAccount.jsx';
import FindPW from './pages/FindAccount/findPW.jsx';
import FindOK from './pages/FindAccount/findOK.jsx';

import UserMypage from "./pages/Mypage/UserMypage.jsx";
import UserEdit from "./pages/Mypage/UserEdit.jsx";

import StoreMypage from "./pages/Mypage/StoreMypage.jsx";
import StoreEdit from "./pages/Mypage/StoreEdit.jsx";


function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">

                {/* 헤더 */}
                <Header />

                {/* 본문 영역 */}
                    <Routes>

                        {/* --- [메인 페이지] --- */}
                        <Route path="/" element={<MainPage />} />
                        <Route path="/recommend" element={<RecommendMap />} />

                        {/* --- [공지사항] --- */}
                        <Route path="/notice_list" element={<NoticeList />} />
                        <Route path="/notice_write" element={<NoticeWrite />} />
                        <Route path="/notice_view/:notice_no" element={<NoticeView />} />
                        <Route path="/notice_modify/:notice_no" element={<NoticeModify />} />

                        {/* --- [꿀팁 가이드] (SCRUM-27) --- */}
                        <Route path="/guide" element={<Guide />} />    
                        <Route path="/guide-1" element={<Guide1 />} />    
                        <Route path="/guide-2" element={<Guide2 />} />
                        <Route path="/guide-3" element={<Guide3 />} />
                        <Route path="/guide-4" element={<Guide4 />} />
                        
                        {/* --- [FAQ 기능] --- */}
                        <Route path="/faq" element={<FaqList />} />
                        <Route path="/faq/view/:faqNo" element={<FaqView />} />
                        <Route path="/faq/write" element={<FaqWrite />} />
                        <Route path="/faq/modify/:faqNo" element={<FaqModify />} />

                        {/* --- [1:1 문의 기능] --- */}
                        <Route path="/inquiry_write" element={<InquiryWrite />} />
                        <Route path="/inquiry_history" element={<InquiryHistory />} />
                        <Route path="/inquiry_view/:inquiryNo" element={<InquiryView />} />
                        <Route path="/inquiry_manage" element={<InquiryManage />} />
                        <Route path="/reply_write/:inquiryNo" element={<ReplyWrite />} />

                        {/* --- [회원가입/관리] --- */}
                        <Route path="/register" element={<Register />} />
                        <Route path="/registerstore" element={<RegisterStore />} />
                        <Route path="/admin/mypage" element={<AdminMypage />} />
                        
                        {/* --- [로그인/계정찾기] --- */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/storeLogin" element={<StoreLogin />} />
                        <Route path="/findAccount" element={<FindAccount />} />
                        <Route path="/findPW" element={<FindPW />} />
                        <Route path="/findOK" element={<FindOK />} />
                        
                        {/* 관리자 마이페이지 */}
                        <Route path="/admin/mypage" element={<AdminMypage />} />
			
                        {/* 유저 마이페이지 */}
                        <Route path="/mypage/user" element={<UserMypage />} />
                        <Route path="/mypage/user/edit" element={<UserEdit />} />

                        {/* 업체 마이페이지 */}
                        <Route path="/mypage/store" element={<StoreMypage />} />
                        <Route path="/mypage/store/edit" element={<StoreEdit />} />
                    </Routes>
                {/* 푸터 */}
                <Footer />

                  
              {/* 챗봇 위젯 — 모든 페이지에 항상 보임 */}
              <ChatWidget />

                  
            </div>
        </Router>
    );
}

export default App;