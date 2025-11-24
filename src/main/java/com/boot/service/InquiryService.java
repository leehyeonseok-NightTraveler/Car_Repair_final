package com.boot.service;

import com.boot.dto.AccountDTO;
import com.boot.dto.Criteria;
import com.boot.dto.InquiryDTO;
import org.apache.ibatis.annotations.Param;

import java.util.HashMap;
import java.util.List;

public interface InquiryService {

    // 1. 문의 등록 처리
    void writeProcess(HashMap<String, String> param);

    // 2. 사용자 문의 목록 조회 (페이징 포함)
    List<InquiryDTO> inquiryList(HashMap<String, String> param, Criteria cri);

    // 3. 관리자 문의 목록 조회 (페이징 포함)
    List<InquiryDTO> inquiryManageList(HashMap<String, String> param, Criteria cri);

    // 4. 문의 상세 조회
    InquiryDTO inquiryView(HashMap<String, String> param);

    // 5. 사용자 정보 조회
    AccountDTO getUserInfo(String accountId);

    // 6. 관리자 답변 등록 처리
    void replyProcess(HashMap<String, String> param);

    // 7. 사용자 문의 총 개수 (페이징용)
    int TotalInquiryUser(String loginId, Criteria cri);

    // 8. 전체 문의 총 개수 (관리자용 페이징)
    int TotalInquiry(Criteria cri);

    // 9. 선택된 문의 일괄 삭제
    void deleteInquiries(@Param("inquiryIds") List<Long> inquiryIds);

    // 문의 확인용
    List<InquiryDTO> selectByAccountId(String accountId);
}
