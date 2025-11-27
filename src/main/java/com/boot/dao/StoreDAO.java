package com.boot.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import com.boot.dto.StoreDTO;

@Mapper
public interface StoreDAO {
    // 업체 등록 (성공 시 1 반환)
    int registerStore(StoreDTO dto);
    
    /**
     * 업체 회원가입 (tbl_store에 삽입)
     * @param storeDTO (암호화된 DTO 객체)
     */
    public void registerStore(StoreDTO storeDTO);
    
    List<StoreDTO> findAllStores();
    // 아이디 중복 체크 (필요시 사용)
    int checkId(String storeId);
}