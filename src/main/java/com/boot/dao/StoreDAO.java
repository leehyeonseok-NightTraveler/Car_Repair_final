package com.boot.dao;

import org.apache.ibatis.annotations.Mapper;
import com.boot.dto.StoreDTO;

@Mapper // MyBatis가 이 인터페이스를 DAO(Mapper)로 인식
public interface StoreDAO {
    
    /**
     * 업체 회원가입 (tbl_store에 삽입)
     * @param storeDTO (암호화된 DTO 객체)
     */
    public void registerStore(StoreDTO storeDTO);
}