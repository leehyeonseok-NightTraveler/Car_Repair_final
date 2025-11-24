package com.boot.service;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.crypto.password.PasswordEncoder; // 1. PasswordEncoder import 삭제
import org.springframework.stereotype.Service;

import com.boot.dao.AccountDAO;
import com.boot.dto.AccountDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountDAO accountDAO;

    @Override
    public void register(AccountDTO accountDTO) {
        log.info("암호화 없이 원본 DTO를 DB로 전달합니다.");
        accountDAO.register(accountDTO);
    }
}