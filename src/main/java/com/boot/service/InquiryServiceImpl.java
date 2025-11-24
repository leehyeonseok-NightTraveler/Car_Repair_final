package com.boot.service;

import com.boot.dao.InquiryDAO;
import com.boot.dao.NoticeDAO;
import com.boot.dto.AccountDTO;
import com.boot.dto.Criteria;
import com.boot.dto.InquiryDTO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
public class InquiryServiceImpl implements InquiryService {

    @Autowired
    private SqlSession sqlSession;

    /**
     * 1. 문의 등록 처리
     */
    @Override
    public void writeProcess(HashMap<String, String> param) {
        InquiryDAO dao = sqlSession.getMapper(InquiryDAO.class);
        dao.writeProcess(param);
    }

    /**
     * 2. 사용자 문의 목록 조회
     */
    @Override
    public List<InquiryDTO> inquiryList(HashMap<String, String> param, Criteria cri) {
        InquiryDAO dao = sqlSession.getMapper(InquiryDAO.class);
        return dao.inquiryList(param, cri);
    }

    /**
     * 3. 관리자 문의 목록 조회
     */
    @Override
    public List<InquiryDTO> inquiryManageList(HashMap<String, String> param, Criteria cri) {
        InquiryDAO dao = sqlSession.getMapper(InquiryDAO.class);
        return dao.inquiryManageList(param, cri);
    }

    /**
     * 4. 문의 상세 조회
     */
    @Override
    public InquiryDTO inquiryView(HashMap<String, String> param) {
        InquiryDAO dao = sqlSession.getMapper(InquiryDAO.class);
        return dao.inquiryView(param);
    }

    /**
     * 5. 사용자 정보 조회
     */
    @Override
    public AccountDTO getUserInfo(String accountId) {
        InquiryDAO dao = sqlSession.getMapper(InquiryDAO.class);
        return dao.getUserInfo(accountId);
    }

    /**
     * 6. 관리자 답변 등록 처리
     */
    @Override
    public void replyProcess(HashMap<String, String> param) {
        InquiryDAO dao = sqlSession.getMapper(InquiryDAO.class);
        dao.replyProcess(param);
    }
   
    /**
     * 7. 사용자 문의 총 개수
     */
    @Override
    public int TotalInquiryUser(String loginId, Criteria cri) {
        InquiryDAO dao = sqlSession.getMapper(InquiryDAO.class);
        return dao.TotalInquiryUser(loginId, cri);
    }

    /**
     * 8. 전체 문의 총 개수 (관리자용)
     */
    @Override
    public int TotalInquiry(Criteria cri) {
        InquiryDAO dao = sqlSession.getMapper(InquiryDAO.class);
        return dao.TotalInquiry(cri);
    }

    @Override
    public void deleteInquiries(List<Long> inquiryIds) {
        InquiryDAO dao = sqlSession.getMapper(InquiryDAO.class);
        dao.deleteInquiries(inquiryIds);
    }

    @Override
    public List<InquiryDTO> selectByAccountId(String accountId) {
        InquiryDAO dao = sqlSession.getMapper(InquiryDAO.class);
        return dao.selectByAccountId(accountId);
    }
}
