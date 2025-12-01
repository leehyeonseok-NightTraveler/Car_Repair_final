import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './StoreReservation.css'; // 작성하신 CSS 파일 임포트

const StoreReservation = () => {
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // URL 파라미터 또는 세션에서 ID 가져오기
    const { storeId: paramId } = useParams();
    const sessionId = sessionStorage.getItem("ACCOUNT_ID");
    const storeId = paramId || sessionId || ""; 

    // 예약 목록 조회
    const fetchReservations = async () => {
        if (!storeId) {
            alert("업체 ID를 찾을 수 없습니다.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8484/api/store/reservations/${storeId}`);
            setReservations(response.data);
        } catch (error) {
            console.error("데이터 로딩 실패:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, [storeId]);

    // 상태 변경 핸들러 (승인, 거절, 정비완료)
    const handleStatus = async (rsvNo, newStatus) => {
        let action = '';
        if (newStatus === 'APPROVED') action = '승인';
        else if (newStatus === 'CANCELED') action = '거절';
        else if (newStatus === 'COMPLETED') action = '정비 완료 처리';

        if (!window.confirm(`정말 이 예약을 ${action}하시겠습니까?`)) return;

        try {
            await axios.put(`http://localhost:8484/api/store/reservation/${rsvNo}/status`, {
                status: newStatus
            });
            alert(`예약이 ${action}되었습니다.`);
            fetchReservations(); // 목록 새로고침
        } catch (error) {
            console.error("상태 변경 실패:", error);
            alert("처리 중 오류가 발생했습니다.");
        }
    };

    // 날짜 포맷
    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        const date = new Date(dateStr);
        return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')} ` +
               `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
    };

    // 뱃지 UI 반환
    const getBadge = (status) => {
        if (status === 'APPROVED') return <span className="badge confirm">승인됨</span>;
        if (status === 'CANCELED') return <span className="badge cancel">취소됨</span>;
        if (status === 'COMPLETED') return <span className="badge complete">정비완료</span>;
        return <span className="badge pending">대기중</span>;
    };

    return (
        <div className="store-rsv-container">
            <h2>🛠️ 정비 예약 관리 (업체용)</h2>
            
            <p style={{textAlign: 'right', color: '#888', fontSize: '14px'}}>
                관리 대상 ID: <strong>{storeId}</strong>
            </p>

            <div className="table-wrapper">
                <table className="store-rsv-table">
                    <thead>
                        <tr>
                            <th>NO</th>
                            <th>예약일시</th>
                            <th>고객명 (연락처)</th>
                            <th>차종 / 서비스</th>
                            <th>요청사항</th>
                            <th>상태</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="7" className="center-msg">로딩중...</td></tr>
                        ) : reservations.length === 0 ? (
                            <tr><td colSpan="7" className="center-msg">접수된 예약 내역이 없습니다.</td></tr>
                        ) : (
                            reservations.map((item) => (
                                <tr key={item.rsvNo}>
                                    <td>{item.rsvNo}</td>
                                    <td>{formatDate(item.rsvDate)}</td>
                                    <td>
                                        <div className="cust-name">{item.customerName}</div>
                                        <div className="cust-phone">{item.customerPhone}</div>
                                    </td>
                                    <td>
                                        <div className="car-model">{item.carModel}</div>
                                        <div className="svc-type">{item.serviceType}</div>
                                    </td>
                                    <td className="memo-box">{item.requestMemo || "-"}</td>
                                    <td>{getBadge(item.status)}</td>
                                    <td>
                                        {/* 1. 대기(PENDING) 상태 */}
                                        {item.status === 'PENDING' && (
                                            <div className="btns">
                                                <button className="btn-ok" onClick={() => handleStatus(item.rsvNo, 'APPROVED')}>승인</button>
                                                <button className="btn-no" onClick={() => handleStatus(item.rsvNo, 'CANCELED')}>거절</button>
                                            </div>
                                        )}
                                        
                                        {/* 2. 예약 확정(APPROVED) 상태 -> 인라인 스타일 제거됨, CSS 클래스 사용 */}
                                        {item.status === 'APPROVED' && (
                                            <button 
                                                className="btn-complete" 
                                                onClick={() => handleStatus(item.rsvNo, 'COMPLETED')}
                                            >
                                                정비 완료
                                            </button>
                                        )}

                                        {/* 3. 완료/취소 상태 */}
                                        {(item.status === 'CANCELED' || item.status === 'COMPLETED') && (
                                            <span className="done-txt">처리됨</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StoreReservation;