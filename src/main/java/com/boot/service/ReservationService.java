package com.boot.service;

import java.util.List;

import com.boot.dto.ReservationDTO;

public interface ReservationService {
	// ⭐️ [추가] 새로운 예약 등록
    public void registerReservation(ReservationDTO reservationDto);
    
    // 조회 (사용자별 목록)
    public List<ReservationDTO> getReservationsByAccountId(String accountId);
    
    // 상세 조회
    public ReservationDTO getReservation(int rsvNo);
    
    // 수정
    public boolean modifyReservation(ReservationDTO reservationDto);
    
    // 취소 (상태 변경)
    public boolean cancelReservation(int rsvNo);
    
}
