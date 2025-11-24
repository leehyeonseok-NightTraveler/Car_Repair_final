package com.boot.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.boot.dao.FindAccountDAO;
import com.boot.dto.FindAccountDTO;

@Service
public class FindAccountServiceImpl implements FindAccountService{

	@Autowired
	private SqlSession sqlSession;
	
	@Autowired
	private FindAccountDAO dao;
	
	@Override
	public ArrayList<FindAccountDTO> findAccount(HashMap<String, String> param) {
		
		FindAccountDAO dao = sqlSession.getMapper(FindAccountDAO.class);
		ArrayList<FindAccountDTO>list = dao.findAccount(param);
		
		return list;
	}

	@Override
	public ArrayList<FindAccountDTO> findPW(HashMap<String, String> param) {
		
		FindAccountDAO dao = sqlSession.getMapper(FindAccountDAO.class);
		ArrayList<FindAccountDTO>list = dao.findPW(param);
		
		return list;
	}

	@Override
    public void newPW(String accountId, String password, String role) {
        dao.newPW(accountId, password, role);
    }

}
