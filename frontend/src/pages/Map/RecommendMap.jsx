import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { MapPin, Search, Phone, Navigation, Filter } from 'lucide-react';
import './RecommendMap.css'; // 위에서 만든 CSS 파일 연결

export default function RecommendMap() {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [recommendList, setRecommendList] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const mapContainer = useRef(null);
  const infoWindowRef = useRef(null);

  // 1. 지도 초기화 (JSP의 initMap 대체)
  useEffect(() => {
    const container = mapContainer.current;
    
    // 카카오맵 로드 대기 (네트워크 속도 고려하여 0.1초마다 체크)
    const waitForKakao = setInterval(() => {
      if (window.kakao && window.kakao.maps) {
        clearInterval(waitForKakao);
        
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 11
        };
        const kakaoMap = new window.kakao.maps.Map(container, options);
        setMap(kakaoMap);
        
        // 초기 데이터 로드
        loadMarkers(""); 
      }
    }, 100);

    return () => clearInterval(waitForKakao);
  }, []);

  // 2. 데이터 불러오기 (Spring Boot API 호출)
  const loadMarkers = async (region) => {
    try {
      // React 전용 API 주소로 요청 (포트 8484)
      const response = await axios.get('http://localhost:8484/api/react/recommend', {
        params: { region: region }
      });
      const data = response.data;
      setRecommendList(data);
      drawMarkers(data);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    }
  };

// 3. 마커 그리기
const drawMarkers = (list) => {
  if (!map) return;
  const { kakao } = window;

  // 1. 커스텀 마커 이미지 설정 (새로 추가)
  // 정비소 핀 아이콘을 사용합니다.
  const imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; // Kakao 기본 아이콘
  const imageSize = new kakao.maps.Size(24, 35); 
  const imageOption = { offset: new kakao.maps.Point(12, 35) };
  
  const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

  // 기존 마커 삭제 및 새 배열 초기화
  markers.forEach(m => m.setMap(null));
  const newMarkers = [];
  const bounds = new kakao.maps.LatLngBounds();

  list.forEach(loc => {
      if (!loc.latitude || !loc.longitude) return;

      const position = new kakao.maps.LatLng(loc.latitude, loc.longitude);
      
      // 2. 마커 생성 시 커스텀 이미지 적용
      const marker = new kakao.maps.Marker({ 
          position: position, 
          map: map,
          image: markerImage // 이미지 적용
      });

      // 마커 클릭 이벤트 (인포윈도우 열기)
      kakao.maps.event.addListener(marker, 'click', () => {
          openInfoWindow(marker, loc);
      });

      newMarkers.push(marker);
      bounds.extend(position);
  });

  setMarkers(newMarkers);
  
  // 3. 검색 결과에 따라 지도 범위 조정
  if (list.length > 0) {
      map.setBounds(bounds);
  } else {
      // 결과가 없으면 서울 중심으로 돌아감
      map.setCenter(new kakao.maps.LatLng(37.5665, 126.9780));
      map.setLevel(11);
  }
};

  // 인포윈도우 열기
  const openInfoWindow = (marker, loc) => {
      const { kakao } = window;
      
      // 기존에 열린 인포윈도우가 있으면 닫기
      if (infoWindowRef.current) {
          infoWindowRef.current.close();
      }

      // 인포윈도우 내용 (HTML)
      const content = `
          <div style="padding:16px; min-width:220px; border-radius:12px; background:white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
              <h4 style="margin:0 0 8px; font-weight:700; font-size:16px; color:#111827; display:flex; align-items:center; gap:6px;">
                  <span style="color:#0d9488;">📍</span> ${loc.storeId}
              </h4>
              <p style="margin:0 0 6px; color:#4b5563; font-size:13px;">${loc.address}</p>
              <p style="margin:0; color:#0d9488; font-weight:600; font-size:13px;">📞 ${loc.phoneNumber || '전화번호 없음'}</p>
          </div>
      `;

      const iw = new kakao.maps.InfoWindow({ content, removable: true });
      iw.open(map, marker);
      infoWindowRef.current = iw;
  };

  // 리스트 클릭 시 해당 위치로 지도 이동
  const handleListClick = (loc) => {
      if(!map) return;
      const { kakao } = window;
      const pos = new kakao.maps.LatLng(loc.latitude, loc.longitude);
      map.setLevel(4);
      map.panTo(pos);
  };

  return (
    <div className="map-page-container">
      <div className="content-wrapper">

        {/* 1. 히어로 배너 */}
        <div className="hero-banner group"
             style={{
                 backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1543363363-c69e0303f83d?q=80&w=2070')`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center 40%'
             }}>
            <div className="hero-overlay"></div>
            <div className="hero-text-container">
                <h2 className="hero-title">신뢰할 수 있는 정비소 찾기</h2>
                <p className="hero-subtitle">
                    MY CAR 정비소가 검증한 전국 정비소 위치를<br className="md:hidden"/> 한눈에 확인하세요.
                </p>
            </div>
        </div>

        {/* 2. 필터 영역 */}
        <div className="filter-section">
            <div className="filter-label">
                <Filter size={20} className="text-teal-500"/>
                <span>지역 검색</span>
            </div>
            <div className="filter-controls">
                <select 
                    className="region-select"
                    style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition:`right 0.5rem center`, backgroundRepeat:`no-repeat`, backgroundSize:`1.5em 1.5em`, paddingRight: '2.5rem'}}
                    value={selectedRegion} 
                    onChange={(e) => setSelectedRegion(e.target.value)}
                >
                    <option value="">전체 지역</option>
                    {["서울","부산","대구","인천","광주","대전","울산","세종","경기","강원","충북","충남","전북","전남","경북","경남","제주"].map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
                <button onClick={() => loadMarkers(selectedRegion)} className="search-btn">
                    <Search size={20}/> 검색
                </button>
            </div>
        </div>

        {/* 3. 메인 카드 (지도 + 리스트) */}
        <div className="main-card">
          
          {/* 좌측 리스트 (PC 버전) */}
          <div className="list-panel">
              <div className="list-header">
                  <h3 className="font-bold text-gray-800 text-lg">검색 결과</h3>
                  <span className="list-count-badge">{recommendList.length}개</span>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {recommendList.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 p-10 space-y-4">
                          <Search size={48} className="text-gray-200"/>
                          <p className="text-lg font-medium">검색 결과가 없습니다.</p>
                      </div>
                  ) : (
                      recommendList.map((item, idx) => (
                          <div key={idx} onClick={() => handleListClick(item)} className="list-item group">
                              <h4 className="store-name">{item.storeId}</h4>
                              <div className="mt-3 space-y-1.5">
                                  <p className="text-sm text-gray-500 flex items-start gap-2.5">
                                      <MapPin size={16} className="mt-0.5 text-gray-400 flex-shrink-0"/> 
                                      <span className="line-clamp-2">{item.address}</span>
                                  </p>
                                  <p className="text-sm text-gray-500 flex items-center gap-2.5">
                                      <Phone size={16} className="text-gray-400 flex-shrink-0"/> 
                                      <span className="font-medium text-teal-600/80">{item.phoneNumber || '전화번호 없음'}</span>
                                  </p>
                              </div>
                          </div>
                      ))
                  )}
              </div>
          </div>

          {/* 우측 지도 영역 */}
          <div className="map-section">
              <div ref={mapContainer} className="w-full h-full" style={{ width: '100%', height: '100%' }}></div>
              
              {/* 모바일 목록 보기 버튼 */}
              <div className="mobile-list-btn-wrapper">
                  <button className="mobile-list-btn">
                      <span className="flex items-center gap-2"><Navigation size={18} className="text-teal-500"/> 목록 보기</span>
                      <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm">{recommendList.length}개</span>
                  </button>
              </div>
          </div>
        </div>

      </div>
    </div>
  );
}
