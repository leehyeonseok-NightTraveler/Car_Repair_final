package com.boot.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.dao.LoginDAO;
import com.boot.dto.LoginDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    private SqlSession sqlSession;

    @Override
    public void register(LoginDTO accountDTO) {
        log.info("암호화 없이 원본 DTO를 DB로 전달합니다.");
        LoginDAO dao = sqlSession.getMapper(LoginDAO.class);
        dao.register(accountDTO);
    }

    @Override
    public ArrayList<LoginDTO> loginYn(HashMap<String, String> param) {
        LoginDAO dao = sqlSession.getMapper(LoginDAO.class);
        ArrayList<LoginDTO> list = dao.loginYn(param);

        if (list.isEmpty()) {
            log.warn("로그인 실패: 아이디 불일치");
            return null;
        }

        LoginDTO user = list.get(0); // 첫 번째 결과 사용

        // 상태값 체크 - 예외 대신 상태값 유지
        if ("PENDING".equalsIgnoreCase(user.getAccountStatus())) {
            log.warn("로그인 차단: 승인 대기 중인 계정");
            user.setAccountStatus("PENDING");
        } else if ("SUSPENDED".equalsIgnoreCase(user.getAccountStatus())) {
            log.warn("로그인 차단: 정지된 계정");
            user.setAccountStatus("SUSPENDED");
        } else if ("DELETED".equalsIgnoreCase(user.getAccountStatus())) {
            log.warn("로그인 차단: 탈퇴된 계정");
            user.setAccountStatus("DELETED");
        }

        log.info("로그인 시도 결과: {}, 상태 = {}", user.getAccountId(), user.getAccountStatus());
        return list;
    }
    
    @Override
    public LoginDTO findByAccountId(String accountId) {
        LoginDAO dao = sqlSession.getMapper(LoginDAO.class);
        return dao.findByAccountId(accountId);
    }

}
