// src/main/java/com/boot/dao/InquiryDAO.java
package com.boot.dao;

import com.boot.dto.Criteria;
import com.boot.dto.InquiryDTO;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.Map;

@Mapper
public interface InquiryDAO {

    void writeProcess(Map<String, String> param);

    List<InquiryDTO> inquiryList(Map<String, Object> param);        // customer_id + cri
    List<InquiryDTO> inquiryManageList(Criteria cri);

    InquiryDTO inquiryView(Long inquiry_no);

    void replyProcess(Map<String, String> param);

    int TotalInquiry(Criteria cri);
    int TotalInquiryUser(String loginId);

    void deleteInquiries(List<Long> inquiryIds);
}