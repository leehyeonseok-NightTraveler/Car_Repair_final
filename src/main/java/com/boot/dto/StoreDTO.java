package com.boot.dto;

import lombok.Data;

@Data
public class StoreDTO {
    // 1. DB 테이블(tbl_store)과 일치하는 필드
    private String storeId;      // store_id
    private String password;     // password
    private String storeName;    //업체명
    private String email;        // email
    private String phoneNumber;  // phone_number
    private String address;      // address
    private String description;  // description
    private String openingHours; // opening_hours (DB 저장용)
    
    // 위도, 경도는 리액트에서 아직 안 보내므로 비워둡니다 (나중에 지도 API 쓸 때 사용)
    private Double latitude;
    private Double longitude;

    // 2. 리액트 폼에서만 받아오는 임시 필드 (DB 저장 X, 서비스에서 조합용)
    private String dayType;      // "평일"
    private String startTime;    // "09"
    private String endTime;      // "18"
}