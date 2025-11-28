import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './reservationhistory.css'; 

// ⭐️ 예약 상태 코드를 한국어로 변환하는 함수 추가
const translateStatus = (status) => {
    switch (status) {
        case 'PENDING':
            return '승인 대기';
        case 'APPROVED':
            return '예약 확정';
        case 'REJECTED':
            return '예약 거절';
        case 'CANCELLED':
            return '예약 취소';
        case 'COMPLETED':
            return '정비 완료';
        default:
            return status;
    }
};


const ReservationHistory = () => {
    const navigate = useNavigate();
    
    // 🔑 예약 목록 상태
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 🌟 사용자 ID 가져오기 (로그인 상태 확인)
    const accountId = sessionStorage.getItem('ACCOUNT_ID');

    useEffect(() => {
        // 1. 로그인 체크: ID가 없으면 로그인 페이지로 리다이렉트
        if (!accountId) {
            alert("예약 내역을 조회하려면 로그인이 필요합니다.");
            navigate('/login');
            return;
        }

        const fetchReservations = async () => {
            try {
                // ⭐️ 백엔드 API 호출: GET /api/reservation/user/{accountId}
                const response = await axios.get(`http://localhost:8484/api/reservation/user/${accountId}`);
                
                setReservations(response.data);
                setIsLoading(false);
            } catch (err) {
                console.error("예약 내역 조회 실패:", err);
                // 500 에러 등의 경우 메시지 표시
                setError("예약 내역을 불러오는 중 서버 오류가 발생했습니다.");
                setIsLoading(false);
            }
        };

        fetchReservations();
    }, [accountId, navigate]);

    // ----------------------
    // 뷰 렌더링 로직
    // ----------------------
    if (isLoading) {
        return <div className="history-container"><h2>예약 내역</h2><p>예약 내역을 불러오는 중...</p></div>;
    }

    if (error) {
        return <div className="history-container error"><h2>예약 내역</h2><p style={{color: 'red'}}>오류: {error}</p></div>;
    }

    return (
        <div className="history-container">
            <h2>나의 정비 예약 내역</h2>
            
            {reservations.length === 0 ? (
                <p className="no-data">등록된 예약 내역이 없습니다.</p>
            ) : (
                <table className="reservation-table">
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>정비소</th>
                            <th>예약 일시</th>
                            <th>차량 모델</th>
                            <th>서비스 종류</th>
                            <th>상태</th>
                            <th>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map((rsv, index) => (
                            <tr key={rsv.rsvNo}> 
                                <td>{rsv.rsvNo}</td>
                                <td>{rsv.storeName || '정보 없음'}</td> 
                                <td>{new Date(rsv.rsvDate).toLocaleString('ko-KR')}</td>
                                <td>{rsv.carModel}</td>
                                <td>{rsv.serviceType}</td>
                                
                                {/* ⭐️ 상태를 한글로 변환하여 표시 */}
                                <td>{translateStatus(rsv.status)}</td> 
                                
                                <td>
                                    {/* ⭐️ 버튼 표시 조건도 한글 함수를 사용하거나 PENDING 상태를 그대로 사용 */}
                                    {rsv.status === 'PENDING' && ( 
                                        <>
                                            <button className="btn-modify">수정</button>
                                            <button className="btn-cancel">취소</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ReservationHistory;