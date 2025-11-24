package com.boot.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.boot.dao.Mypage_StoreDAO;
import com.boot.dto.StoreDTO;

@Service
public class Mypage_StoreServiceImpl implements Mypage_StoreService {

    @Autowired
    private Mypage_StoreDAO dao;

    @Override
    public StoreDTO getStoreInfo(String storeId) {
        return dao.getStoreInfo(storeId);
    }

    @Override
    public int updateStoreInfo(StoreDTO dto) {
        return dao.updateStoreInfo(dto);
    }

    @Override
    public boolean updatePassword(String storeId, String currentPw, String newPw) {
        String dbPw = dao.getPasswordById(storeId);
        if (dbPw != null && dbPw.equals(currentPw)) {
            dao.updatePassword(storeId, newPw);
            return true;
        }
        return false;
    }
}
