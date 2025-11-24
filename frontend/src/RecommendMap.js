import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { MapPin, Search, Phone } from 'lucide-react';

export default function RecommendMap() {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [recommendList, setRecommendList] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const mapContainer = useRef(null);

  // 1. 지도 초기화 (수정됨: 지도가 로드될 때까지 기다림)
  useEffect(() => {
    const container = mapContainer.current;
    
    // 카카오 스크립트가 로드될 때까지 0.1초마다 검사
    const waitForKakao = setInterval(() => {
      if (window.kakao && window.kakao.maps) {
        clearInterval(waitForKakao); // 로드됐으면 타이머 멈춤
        
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 11
        };
        const kakaoMap = new window.kakao.maps.Map(container, options);
        setMap(kakaoMap);
        
        // 지도 뜬 뒤에 전체 데이터 로드
        loadMarkers(""); 
      }
    }, 100); // 0.1초마다 확인

    return () => clearInterval(waitForKakao);
  }, []);

  // 2. 데이터 불러오기
  const loadMarkers = async (region) => {
    try {
      // Spring Boot(8585)로 요청
      const response = await axios.get('http://localhost:8585/api/recommend', {
        params: { region: region }
      });
      const data = response.data;
      setRecommendList(data);
      
      // 마커 그리기
      drawMarkers(data);
      
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      // alert("서버 연결에 실패했습니다."); // 에러 메시지가 거슬리면 주석 처리
    }
  };

  // 3. 마커 그리기 함수
  const drawMarkers = (list) => {
    if (!map) return;
    const { kakao } = window;

    // 기존 마커 삭제
    markers.forEach(m => m.setMap(null));
    const newMarkers = [];
    const bounds = new kakao.maps.LatLngBounds();

    list.forEach(loc => {
        if (!loc.latitude || !loc.longitude) return;

        const position = new kakao.maps.LatLng(loc.latitude, loc.longitude);
        const marker = new kakao.maps.Marker({ position, map: map });

        // 마커 클릭 시 인포윈도우
        const iwContent = `
            <div style="padding:10px;font-size:12px;min-width:200px;">
                <b>${loc.storeId}</b><br/>
                ${loc.address}<br/>
                <span style="color:blue">${loc.phoneNumber || '-'}</span>
            </div>`;
        const infowindow = new kakao.maps.InfoWindow({ content: iwContent, removable: true });

        kakao.maps.event.addListener(marker, 'click', () => infowindow.open(map, marker));

        newMarkers.push(marker);
        bounds.extend(position);
    });

    setMarkers(newMarkers);
    if (list.length > 0) map.setBounds(bounds); 
  };

  // 리스트 항목 클릭 시 이동
  const handleListClick = (loc) => {
      if(!map) return;
      const { kakao } = window;
      const pos = new kakao.maps.LatLng(loc.latitude, loc.longitude);
      map.setLevel(4);
      map.panTo(pos);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      
      {/* 상단 검색바 */}
      <div className="bg-white p-4 shadow-sm flex justify-center gap-2 z-10">
        <select 
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={selectedRegion} 
            onChange={(e) => setSelectedRegion(e.target.value)}
        >
            <option value="">전체 지역</option>
            <option value="서울">서울</option>
            <option value="경기">경기</option>
            <option value="인천">인천</option>
            <option value="강원">강원</option>
            <option value="제주">제주</option>
            {/* 필요한 지역 추가 */}
        </select>
        <button 
            onClick={() => loadMarkers(selectedRegion)}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition"
        >
            <Search size={18}/> 검색
        </button>
      </div>

      {/* 메인 컨텐츠 (지도 + 리스트) */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* 좌측 리스트 패널 */}
        <div className="w-80 bg-white border-r overflow-y-auto hidden md:block shadow-lg z-10">
            <div className="p-4 bg-teal-50 border-b font-bold text-teal-700">
                검색 결과: {recommendList.length}개
            </div>
            {recommendList.length === 0 ? (
                <div className="p-10 text-center text-gray-400">결과가 없습니다.</div>
            ) : (
                recommendList.map((item, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => handleListClick(item)}
                        className="p-4 border-b hover:bg-gray-50 cursor-pointer transition"
                    >
                        <h4 className="font-bold text-gray-800 flex items-center gap-1">
                            <MapPin size={14} className="text-teal-500"/> {item.storeId}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 pl-5">{item.address}</p>
                        <p className="text-xs text-gray-400 mt-1 pl-5 flex items-center gap-1">
                            <Phone size={10}/> {item.phoneNumber || '전화번호 없음'}
                        </p>
                    </div>
                ))
            )}
        </div>

        {/* 지도 영역 */}
        <div className="flex-1 relative">
            <div ref={mapContainer} className="w-full h-full"></div>
        </div>
      </div>
    </div>
  );
}