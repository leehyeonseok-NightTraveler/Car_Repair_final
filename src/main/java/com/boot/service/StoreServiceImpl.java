package com.boot.service;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.crypto.password.PasswordEncoder; // 1. PasswordEncoder import 삭제
import org.springframework.stereotype.Service;

import com.boot.dao.StoreDAO; // 2. StoreDAO import
import com.boot.dto.StoreDTO; // 3. StoreDTO import

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class StoreServiceImpl implements StoreService {

    @Autowired
    private StoreDAO storeDAO; // 4. StoreDAO 주입

    // 5. PasswordEncoder 주입 부분 삭제

    @Override
    public void registerStore(StoreDTO storeDTO) { // 6. registerStore 메소드 구현
        log.info("암호화 없이 원본 StoreDTO를 DB로 전달합니다.");
        
        // 7. 암호화 로직 없음
        
        // 8. 폼에서 받은 DTO를 DAO로 그대로 전달하여 DB에 저장
        storeDAO.registerStore(storeDTO);
    }
}