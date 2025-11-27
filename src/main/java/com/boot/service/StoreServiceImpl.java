package com.boot.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.dao.StoreDAO;
import com.boot.dto.StoreDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class StoreServiceImpl implements StoreService {

    @Autowired
    private StoreDAO storeDAO;

    @Override
    public boolean registerStore(StoreDTO dto) {
        log.info("업체 가입 요청 데이터: " + dto);

        // 1. 영업 시간 문자열 조합 (예: "평일 09시 ~ 18시")
        // 리액트에서 빈 값이 올 수도 있으므로 간단한 체크
        String combinedTime = "";
        if (dto.getDayType() != null && dto.getStartTime() != null) {
            combinedTime = String.format("%s %s시 ~ %s시", 
                    dto.getDayType(), dto.getStartTime(), dto.getEndTime());
        }
        
        // 2. 조합된 시간을 DTO에 담기 (DB의 opening_hours 컬럼에 들어감)
        dto.setOpeningHours(combinedTime);

        // 3. DB 저장 실행
        try {
            int result = storeDAO.registerStore(dto);
            return result > 0; // 1개 이상 저장되면 true
        } catch (Exception e) {
            log.error("DB 저장 중 에러 발생", e);
            return false;
        }
    }

	@Override
	public List<StoreDTO> getAllStores() {
		return storeDAO.findAllStores(); // DAO 메서드 호출
	}
}