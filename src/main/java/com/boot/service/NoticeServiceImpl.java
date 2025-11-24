package com.boot.service;

import com.boot.dao.NoticeDAO;
import com.boot.dto.AccountDTO;
import com.boot.dto.Criteria;
import com.boot.dto.NoticeDTO;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
public class NoticeServiceImpl implements NoticeService {

    @Autowired
    private SqlSession sqlSession;

    /**
     * 1. 공지사항 목록 조회 (페이징 포함)
     */
    @Override
    public List<NoticeDTO> noticeList(HashMap<String, String> param, Criteria cri) {
        NoticeDAO dao = sqlSession.getMapper(NoticeDAO.class);
        return dao.noticeList(param, cri);
    }

    /**
     * 2. 공지사항 상세 조회
     */
    @Override
    public NoticeDTO noticeView(HashMap<String, String> param) {
        NoticeDAO dao = sqlSession.getMapper(NoticeDAO.class);
        return dao.noticeView(param);
    }

    /**
     * 3. 공지사항 작성
     */
    @Override
    public void writeProcess(HashMap<String, String> param) {
        NoticeDAO dao = sqlSession.getMapper(NoticeDAO.class);
        dao.writeProcess(param);
    }

    /**
     * 4. 공지사항 수정
     */
    @Override
    public void modifyProcess(HashMap<String, String> param) {
        NoticeDAO dao = sqlSession.getMapper(NoticeDAO.class);
        dao.modifyProcess(param);
    }

    /**
     * 5. 공지사항 삭제
     */
    @Override
    public void deleteProcess(HashMap<String, String> param) {
        NoticeDAO dao = sqlSession.getMapper(NoticeDAO.class);
        dao.deleteProcess(param);
    }

    /**
     * 6. 공지사항 조회수 증가
     */
    @Override
    public void increaseViews(HashMap<String, String> param) {
        NoticeDAO dao = sqlSession.getMapper(NoticeDAO.class);
        dao.increaseViews(param);
    }

    /**
     * 7. 전체 공지사항 수 조회 (페이징용)
     */
    @Override
    public int getTotalCount() {
        NoticeDAO dao = sqlSession.getMapper(NoticeDAO.class);
        return dao.getTotalCount();
    }

    /**
     * 8. 사용자 정보 조회
     */
    @Override
    public AccountDTO getUserInfo(String accountId) {
        NoticeDAO dao = sqlSession.getMapper(NoticeDAO.class);
        return dao.getUserInfo(accountId);
    }
}