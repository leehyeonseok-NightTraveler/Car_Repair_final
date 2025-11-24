package com.boot.dao;

import com.boot.dto.AccountDTO;
import com.boot.dto.Criteria;
import com.boot.dto.NoticeDTO;
import org.apache.ibatis.annotations.Param;

import java.util.HashMap;
import java.util.List;

public interface NoticeDAO {

    // 1. 공지사항 목록 조회 (페이징 포함)
    List<NoticeDTO> noticeList(
            @Param("param") HashMap<String, String> param,
            @Param("cri") Criteria cri
    );

    // 2. 공지사항 상세 조회
    NoticeDTO noticeView(@Param("param") HashMap<String, String> param);

    // 3. 공지사항 작성
    void writeProcess(@Param("param") HashMap<String, String> param);

    // 4. 공지사항 수정
    void modifyProcess(@Param("param") HashMap<String, String> param);

    // 5. 공지사항 삭제
    void deleteProcess(@Param("param") HashMap<String, String> param);

    // 6. 전체 공지사항 수 조회 (페이징용)
    int getTotalCount();

    // 7. 공지사항 조회수 증가
    void increaseViews(@Param("param") HashMap<String, String> param);

    // 8. 사용자 정보 조회
    AccountDTO getUserInfo(@Param("param") String accountId);
}
