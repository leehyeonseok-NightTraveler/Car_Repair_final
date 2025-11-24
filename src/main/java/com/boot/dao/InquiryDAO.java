package com.boot.dao;

import com.boot.dto.AccountDTO;
import com.boot.dto.Criteria;
import com.boot.dto.InquiryDTO;
import java.util.HashMap;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface InquiryDAO {

    // 1. 사용자 문의 등록
    void writeProcess(@Param("param") HashMap<String, String> param);

    // 2. 사용자 문의 목록 조회 (페이징 포함)
    List<InquiryDTO> inquiryList(@Param("param") HashMap<String, String> param,
                                 @Param("cri") Criteria cri);

    // 3. 관리자 문의 목록 조회 (페이징 포함)
    List<InquiryDTO> inquiryManageList(@Param("param") HashMap<String, String> param,
                                       @Param("cri") Criteria cri);

    // 4. 문의 상세 조회
    InquiryDTO inquiryView(@Param("param") HashMap<String, String> param);

    // 5. 사용자 정보 조회
    AccountDTO getUserInfo(@Param("accountId") String accountId);

    // 6. 관리자 답변 등록
    void replyProcess(@Param("param") HashMap<String, String> param);

    // 7. 사용자 문의 총 개수 (페이징용)
    int TotalInquiryUser(@Param("loginId") String loginId, Criteria cri);

    // 8. 전체 문의 총 개수 (관리자용 페이징)
    int TotalInquiry(@Param("cri") Criteria cri);

    // 9. 선택된 문의 일괄 삭제
    void deleteInquiries(@Param("inquiryIds") List<Long> inquiryIds);

    // 문의 확인용
    List<InquiryDTO> selectByAccountId(@Param("accountId") String accountId);
}
