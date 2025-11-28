import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Send, Bot, X, MessageCircle } from 'lucide-react';

// 1. 공통 컴포넌트
import Header from './components/common/Header';
import Footer from "./components/common/Footer";
import ChatWidget from "./components/common/ChatWidget";

// 2. [메인/지도]
import RecommendMap from './pages/Map/RecommendMap';
import MainPage from './pages/main/mainpage';

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

// 5. [1:1 문의]
import InquiryWrite from './pages/inquiry/inquiry_write.jsx';
import InquiryHistory from './pages/inquiry/Inquiry_history.jsx';
import InquiryView from './pages/inquiry/inquiry_view.jsx';
import InquiryManage from './pages/inquiry/inquiry_manage.jsx';
import ReplyWrite from './pages/Inquiry/reply_write.jsx';

// 6. [회원/관리]
// (경로는 실제 파일 위치에 맞춰 수정 필요할 수 있음. src/pages/Register/Register.jsx 가정)
import Register from './pages/Register/Register.jsx';
import RegisterStore from './pages/Register/RegisterStore.jsx';

// 7. [꿀팁 가이드]
import Guide from './pages/Gaide/Gaide.jsx';
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

// 9. [마이페이지 관련]
import UserMypage from "./pages/Mypage/UserMypage.jsx";
import UserEdit from "./pages/Mypage/UserEdit.jsx";
import StoreMypage from "./pages/Mypage/StoreMypage.jsx";
import StoreEdit from "./pages/Mypage/StoreEdit.jsx";
import AdminMypage from './pages/Mypage/AdminMypage.jsx';

// 10. [관리자 권한 승급]
import AdminPromote from "./pages/promote_admin/AdminPromote.jsx";
;

// 11.[검색기능]
import AutoSearch from "./pages/AutoSearch/autoSearch.jsx";

// 13.[리뷰 페이지]
import Review from "./pages/Review/review.jsx";
import StarRating from "./pages/Review/starRating.jsx";
//13. [예약 페이지]
import Reservation from './pages/Reservation/Reservation.jsx';

// 14. [자동차 정비이력/관리]
import Maintenance from "./pages/maintenance/Maintenance.jsx";

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
                        <Route path="/recommend" element={<RecommendMap />} />

                        {/* --- [공지사항] --- */}
                        <Route path="/notice/list" element={<NoticeList />} />
                        <Route path="/notice/write" element={<NoticeWrite />} />
                        <Route path="/notice/view/:notice_no" element={<NoticeView />} />
                        <Route path="/notice/modify/:notice_no" element={<NoticeModify />} />

                        {/* --- [꿀팁 가이드] --- */}
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
                        <Route path="/inquiry/write" element={<InquiryWrite />} />
                        <Route path="/inquiry/history" element={<InquiryHistory />} />
                        <Route path="/inquiry/view/:inquiry_no" element={<InquiryView />} />
                        <Route path="/inquiry/manage" element={<InquiryManage />} />
                        <Route path="/inquiry/reply_write/:inquiry_no" element={<ReplyWrite />} />

                        {/* --- [회원가입] --- */}
                        <Route path="/register" element={<Register />} />
                        <Route path="/registerstore" element={<RegisterStore />} />
                        
                        {/* --- [로그인/계정찾기] --- */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/storeLogin" element={<StoreLogin />} />
                        <Route path="/findAccount" element={<FindAccount />} />
                        <Route path="/findPW" element={<FindPW />} />
                        <Route path="/findOK" element={<FindOK />} />
                        
                        {/* --- [마이페이지 - Header.jsx의 링크와 일치시킴] --- */}
                        {/* 유저 */}
                        <Route path="/mypage/user" element={<UserMypage />} />
                        <Route path="/mypage/user/edit" element={<UserEdit />} />

                        {/* 업체 */}
                        <Route path="/mypage_store" element={<StoreMypage />} />
                        <Route path="/mypage/store/edit" element={<StoreEdit />} />

                        {/* 관리자 */}
                        <Route path="/mypage_admin" element={<AdminMypage />} />

                        {/* --- [관리자 권한 승급] --- */}
                        {/* ★ [수정됨] Header.jsx의 링크와 일치하도록 주소를 /admin/promote 로 변경 */}
                        <Route path="/admin/promote" element={<AdminPromote />} />
						
                        {/* 자동검색 */}
                        <Route path="/autoSearch" element={<AutoSearch />} />
						
                        {/* 리뷰 */}
                        <Route path="/review" element={<Review />} />
                        <Route path="/starRating" element={<StarRating />} />
                        
                        {/* 예약 페이지 */} 
                        <Route path="/reservation" element={<Reservation />} />

                        <Route path="/maintenance" element={<Maintenance />} />
                    </Routes>
                </main>

                {/* 푸터 */}
                <Footer />
                <ChatWidget />
            </div>

        </Router>
    );
}

export default App;