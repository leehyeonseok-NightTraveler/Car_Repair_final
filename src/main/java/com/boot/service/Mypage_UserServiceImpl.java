package com.boot.service;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.crypto.password.PasswordEncoder; // 1. PasswordEncoder import 삭제
import org.springframework.stereotype.Service;

import com.boot.dao.Mypage_UserDAO;
import com.boot.dto.AccountDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class Mypage_UserServiceImpl implements Mypage_UserService {

    @Autowired
    private Mypage_UserDAO dao;

    @Override
    public AccountDTO getUserInfo(String accountId) {
        return dao.getUserInfo(accountId);
    }

    @Override
    public int updateUserInfo(AccountDTO account) {
        return dao.updateUserInfo(account);
    }

    @Override
    public boolean updatePassword(String accountId, String currentPw, String newPw) {
        // 현재 비밀번호 조회
        String dbPassword = dao.getPasswordByAccountId(accountId);
        if (dbPassword == null || !dbPassword.equals(currentPw)) {
            return false;
        }

        // 새 비밀번호 업데이트
        dao.updatePassword(accountId, newPw);
        return true;
    }
}
