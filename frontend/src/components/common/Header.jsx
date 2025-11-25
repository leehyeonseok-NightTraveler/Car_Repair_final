import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, MapPin, FileText, LogOut, Wrench, 
  ChevronDown, Bell, Settings, CreditCard, Shield
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// ★★★ 팀원 주의! 아래 두 줄만 추가된 거예요 ★★★
// 1. 챗봇 위젯 (오른쪽 아래 둥둥 떠있는 거)
// 2. 구글 지도 (정비소 찾기 페이지용 - 추후 활성화 예정)
// 나머지는 기존 코드 그대로 건드리지 않았습니다!
// ─────────────────────────────────────────────────────────────────────────────

// 1. 챗봇 위젯 임포트 (기존 폴더 구조 유지)
import ChatWidget from '../common/ChatWidget.jsx';

// 2. 구글 지도 컴포넌트 (정비소 찾기 페이지에만 쓰일 예정 → 나중에 켜주세요!)
// 현재는 주석 처리돼 있어서 로드 안 됩니다. 필요할 때만 켜면 됨!
// import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';

export default function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const role = sessionStorage.getItem("ROLE") || ""; 

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. 챗봇 위젯 - 오른쪽 아래에 고정 (항상 보임) */}
      {/*    → ChatWidget.jsx 파일이 이미 완성되어 있음 */}
      {/*    → 서버 주소: http://localhost:8484/api/react/chat */}
      {/* ========================================================================= */}
      <ChatWidget />

      {/* ========================================================================= */}
      {/* 2. 구글 지도 영역 - 정비소 찾기 페이지에서만 쓸 거라서 주석 처리해둠 */}
      {/*    필요하면 아래 주석 풀고 사용하세요! (현재는 로드되지 않음) */}
      {/* ========================================================================= */}
      {/* 
      <div className="fixed inset-0 z-40 pointer-events-none">
        <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={{ lat: 37.5665, lng: 126.9780 }}
            zoom={11}
          >
            <Marker position={{ lat: 37.5665, lng: 126.9780 }} />
          </GoogleMap>
        </LoadScript>
      </div>
      */}

      {/* ========================================================================= */}
      {/* 기존 헤더 코드 시작 - 여긴 절대 건드리지 마세요! */}
      {/* ========================================================================= */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3 border-gray-200' : 'bg-white py-4 border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          
          {/* 로고 */}
          <Link to="/main" className="flex items-center gap-2 group">
            <div className="p-2 bg-teal-50 rounded-xl group-hover:bg-teal-100 transition-colors">
              <Wrench size={22} className="text-teal-600"/>
            </div>
            <span className="text-xl font-bold text-teal-600">Car Repair</span>
          </Link>

          {/* 검색 바 */}
          <div className="flex-1 max-w-xl mx-8 relative">
            <input
              type="text"
              placeholder="지역 검색"
              className="w-full bg-gray-50/50 border border-gray-200 rounded-full py-2.5 px-4 pl-10 pr-12 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-shadow shadow-sm"
            />
            <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
              <button className="text-teal-500 text-sm font-medium">전체 지역</button>
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>

          {/* 우측 메뉴들 */}
          <div className="flex items-center gap-6">
            <button className="text-gray-500 hover:text-teal-600 relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button className="text-gray-500 hover:text-teal-600">
              <Settings size={20} />
            </button>

            {/* 유저 메뉴 */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 hover:text-teal-600 transition"
              >
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                  <User size={18} className="text-teal-600" />
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* 드롭다운 메뉴 - 기존 그대로 */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="p-4 bg-teal-50/50 border-b border-gray-100">
                    <p className="font-bold text-gray-800">사용자 님</p>
                    <p className="text-xs text-gray-500 mt-0.5">{role || '게스트'}</p>
                  </div>
                  <div className="p-3 space-y-1">
                    {role !== 'ADMIN' && (
                      <MenuItem icon={<MapPin size={18}/>} text="정비소 찾기" sub="내 근처 전문 정비소" href="/search" highlight />
                    )}

                    <MenuItem icon={<Wrench size={18}/>} text="정비 히스토리" sub="과거 정비 기록" href="/history" />
                    {role === 'STORE' && (
                      <MenuItem icon={<CreditCard size={18}/>} text="업체 마이페이지" sub="정비소 정보 관리" href="/mypage_store" highlight />
                    )}
                    {role === 'ADMIN' && (
                      <>
                        <MenuItem icon={<Shield size={18}/>} text="관리자 페이지" sub="전체 시스템 관리" href="/mypage_admin" highlight />
                        <MenuItem icon={<LogOut size={18}/>} text="관리자 해제" sub="일반 모드로 전환" href="/admin/exit" />
                      </>
                    )}
                  </div>
                  <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                    <Link to="/logout" className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 py-2.5 rounded-xl transition-colors font-medium">
                      <LogOut size={16}/> 로그아웃
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {/* ========================================================================= */}
      {/* 기존 헤더 코드 끝 */}
      {/* ========================================================================= */}
    </>
  );
}

// 기존 MenuItem 컴포넌트 그대로
function MenuItem({ icon, text, sub, href, highlight }) {
  return (
    <Link to={href} className={`flex items-start gap-3 p-3 rounded-xl transition-colors group ${highlight ? 'bg-teal-50/60 hover:bg-teal-50' : 'hover:bg-gray-50'}`}>
      <div className={`mt-1 p-2 rounded-lg ${highlight ? 'bg-teal-100 text-teal-600' : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-teal-500 group-hover:shadow-sm'} transition-all`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
            <span className={`text-sm font-bold ${highlight ? 'text-teal-700' : 'text-gray-700'}`}>{text}</span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
      </div>
    </Link>
  );
}