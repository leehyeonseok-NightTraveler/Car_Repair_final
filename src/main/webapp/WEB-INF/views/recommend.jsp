<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="true"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title>MY CAR 정비소 찾기</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        html, body { margin:0; padding:0; height:100%; background:#f9f9fb; font-family: 'Malgun Gothic', sans-serif; }
        
        /* 헤더 여백 확보 */
        .content-wrapper { padding-top: 90px; min-height: 100vh; }

        /* 히어로 배너 */
        #hero-banner {
            width: 100%;
            height: 220px;
            background: linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), 
                        url('https://images.unsplash.com/photo-1543363363-c69e0303f83d?q=80&w=2070') center 35%/cover;
            display: flex; align-items: center; justify-content: center; text-align: center; color: white;
            margin-bottom: 30px;
        }
        .hero-content h2 { font-size: 2.5rem; font-weight: 800; margin:0; text-shadow: 0 3px 8px rgba(0,0,0,0.6); }
        .hero-content p { font-size: 1.2rem; margin-top: 12px; opacity: 0.95; }

        /* 필터 박스 */
        #filterBox {
            max-width: 1100px; margin: 0 auto 30px; text-align: center;
        }
        #filterBox select, #filterBox button {
            padding: 12px 18px; font-size: 15px; border-radius: 8px; border: 1px solid #ddd;
        }
        #filterBox button {
            background: #14b8a6; color: white; border: none; cursor: pointer;
        }
        #filterBox button:hover { background: #0d9488; }

        /* 메인 그리드 레이아웃 */
        .main-grid {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr;
            gap: 30px;
            padding: 0 20px;
        }
        @media (min-width: 1024px) {
            .main-grid { grid-template-columns: 1fr 500px; }
        }

        /* 왼쪽: 정비소 목록 */
        .shop-list {
            background: white;
            border-radius: 16px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.08);
            padding: 24px;
            max-height: 85vh;
            overflow-y: auto;
        }
        .shop-item {
            padding: 16px 0;
            border-bottom: 1px solid #eee;
        }
        .shop-item:last-child { border-bottom: none; }
        .shop-item h3 {
            margin: 0 0 8px; font-size: 17px; color: #1f2937;
        }
        .shop-item p {
            margin: 4px 0; font-size: 14px; color: #6b7280;
        }

        /* 오른쪽: 카카오 지도 (이게 핵심!) */
        .map-container {
            position: sticky;
            top: 90px;
            align-self: start;
        }
        #map {
            width: 100%;
            height: 780px;           /* 길쭉하고 예쁘게! */
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 50px rgba(0,0,0,0.18);
            border: 3px solid #e0e0e0;
        }
        @media (max-width: 1023px) {
            #map { height: 500px; margin-top: 20px; }
        }

        .empty-message { text-align:center; padding:40px; color:#999; font-size:15px; }
    </style>
</head>
<body>

<jsp:include page="/WEB-INF/views/header.jsp" />

<div class="content-wrapper">

    <!-- 히어로 배너 -->
    <div id="hero-banner">
        <div class="hero-content">
            <h2>신뢰할 수 있는 정비소 찾기</h2>
            <p>MY CAR 정비소가 검증한 전국 정비소를 한눈에 확인하세요</p>
        </div>
    </div>

    <!-- 지역 필터 -->
    <div id="filterBox">
        <label for="regionSelect"><strong>지역 선택:</strong></label>
        <select id="regionSelect">
            <option value="">전체</option>
            <option value="서울">서울특별시</option>
            <option value="부산">부산광역시</option>
            <option value="대구">대구광역시</option>
            <option value="인천">인천광역시</option>
            <option value="광주">광주광역시</option>
            <option value="대전">대전광역시</option>
            <option value="울산">울산광역시</option>
            <option value="세종">세종특별자치시</option>
            <option value="경기">경기도</option>
            <option value="강원">강원특별자치도</option>
            <option value="충북">충청북도</option>
            <option value="충남">충청남도</option>
            <option value="전북">전북특별자치도</option>
            <option value="전남">전라남도</option>
            <option value="경북">경상북도</option>
            <option value="경남">경상남도</option>
            <option value="제주">제주특별자치도</option>
        </select>
        <button onclick="filterMarkers()">검색하기</button>
    </div>

    <!-- 메인 그리드: 왼쪽 목록 + 오른쪽 지도 -->
    <div class="main-grid">
        <!-- 왼쪽: 정비소 목록 -->
        <div class="shop-list" id="shopList">
            <div class="empty-message">지역을 선택하고 검색해주세요</div>
        </div>

        <!-- 오른쪽: 카카오 지도 -->
        <div class="map-container">
            <div id="map"></div>
        </div>
    </div>
</div>

<script src="//dapi.kakao.com/v2/maps/sdk.js?appkey=0b4604468a48427fe628a6489a0547be"></script>
<script>
let map, markers = [], allData = [], currentInfowindow;
const shopListEl = document.getElementById('shopList');

function initMap() {
    const container = document.getElementById('map');
    map = new kakao.maps.Map(container, {
        center: new kakao.maps.LatLng(37.48, 127.05),
        level: 10
    });
    loadMarkers();
}

async function loadMarkers(region = "") {
    let url = '/api/recommend';
    if (region) url += '?region=' + encodeURIComponent(region);

    try {
        const res = await fetch(url);
        const data = await res.json();
        allData = data;
        renderShops(data);
    } catch (e) { console.error(e); }
}

function renderShops(list) {
    // 기존 마커 제거
    markers.forEach(m => m.setMap(null));
    markers = [];
    if (currentInfowindow) currentInfowindow.close();

    shopListEl.innerHTML = '';
    const bounds = new kakao.maps.LatLngBounds();

    if (list.length === 0) {
        shopListEl.innerHTML = '<div class="empty-message">검색 결과가 없습니다.</div>';
        return;
    }

    list.forEach(loc => {
        if (!loc.latitude || !loc.longitude) return;

        const pos = new kakao.maps.LatLng(loc.latitude, loc.longitude);
        const marker = new kakao.maps.Marker({ position: pos });
        marker.setMap(map);
        markers.push(marker);
        bounds.extend(pos);

        // 인포윈도우
        const iwContent = `
            <div style="padding:12px; min-width:220px; font-size:13px;">
                <strong style="font-size:15px;">${loc.storeId || '이름 없음'}</strong><br>
                ${loc.address || ''}<br>
                ${loc.phoneNumber || ''}
            </div>`;
        const infowindow = new kakao.maps.InfoWindow({ content: iwContent });

        // 목록 아이템
        const item = document.createElement('div');
        item.className = 'shop-item';
        item.innerHTML = `
            <h3>${loc.storeId || '이름 없음'}</h3>
            <p>${loc.address || '주소 없음'}</p>
            <p>${loc.phoneNumber || ''}</p>
        `;
        shopListEl.appendChild(item);

        // 클릭 이벤트 통합
        const openInfo = () => {
            if (currentInfowindow) currentInfowindow.close();
            infowindow.open(map, marker);
            currentInfowindow = infowindow;
            map.panTo(pos);
            map.setLevel(5);
        };
        kakao.maps.event.addListener(marker, 'click', openInfo);
        item.addEventListener('click', openInfo);
    });

    if (list.length > 0) map.setBounds(bounds);
}

function filterMarkers() {
    const region = document.getElementById('regionSelect').value;
    loadMarkers(region);
}

// 카카오맵 로드 대기
const check = setInterval(() => {
    if (window.kakao?.maps) {
        clearInterval(check);
        initMap();
    }
}, 100);
</script>

<jsp:include page="/WEB-INF/views/footer.jsp" />
</body>
</html>