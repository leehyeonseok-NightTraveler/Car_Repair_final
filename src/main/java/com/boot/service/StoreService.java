package com.boot.service;

import com.boot.dto.StoreDTO;

public interface StoreService {
    
    /**
     * 업체 회원가입 로직 (비밀번호 암호화 포함)
     * @param storeDTO
     */
    public void registerStore(StoreDTO storeDTO);
}