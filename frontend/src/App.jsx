import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 👇 컴포넌트 불러오기 (파일 경로가 맞는지 꼭 확인하세요!)
import Header from './components/common/Header.jsx';
import RecommendMap from './pages/Map/RecommendMap.jsx'; // 혹은 './map/RecommendMap.jsx'
import NoticeList from './pages/Notice/notice_list.jsx';

function App() {
  return (
    <Router>
      {/* 전체 레이아웃 스타일 적용 (회색 배경, 최소 높이) */}
      <div className="min-h-screen bg-gray-50">
        
        {/* 1. 헤더: 모든 페이지에서 항상 위에 보임 */}
        <Header />

        {/* 2. 라우팅: 주소에 따라 바뀌는 부분 */}
        <Routes>
          {/* 메인 주소(/)로 들어오면 지도(RecommendMap)를 보여줌 */}
          <Route path="/" element={<RecommendMap />} />
          
          {/* /recommend 주소로 들어와도 지도를 보여줌 (선택사항) */}
          <Route path="/recommend" element={<RecommendMap />} />

          {/* /notice_list 주소로 들어오면 공지사항을 보여줌 */}
          <Route path="/notice_list" element={<NoticeList />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;