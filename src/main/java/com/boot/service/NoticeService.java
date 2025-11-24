package com.boot.service;

import com.boot.dto.AccountDTO;
import com.boot.dto.Criteria;
import com.boot.dto.NoticeDTO;

import java.util.HashMap;
import java.util.List;

public interface NoticeService {

    // 1. 공지사항 목록 조회 (페이징 포함)
    List<NoticeDTO> noticeList(HashMap<String, String> param, Criteria cri);

    // 2. 공지사항 상세 조회
    NoticeDTO noticeView(HashMap<String, String> param);

    // 3. 공지사항 작성
    void writeProcess(HashMap<String, String> param);

    // 4. 공지사항 수정
    void modifyProcess(HashMap<String, String> param);

    // 5. 공지사항 삭제
    void deleteProcess(HashMap<String, String> param);

    // 6. 공지사항 조회수 증가
    void increaseViews(HashMap<String, String> param);

    // 7. 전체 공지사항 수 조회 (페이징용)
    int getTotalCount();

    // 8. 사용자 정보 조회
    AccountDTO getUserInfo(String accountId);
}