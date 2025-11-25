// src/main/java/com/boot/service/InquiryService.java
package com.boot.service;

import com.boot.dto.Criteria;
import com.boot.dto.InquiryDTO;
import java.util.List;
import java.util.Map;

public interface InquiryService {
    void writeProcess(Map<String, String> param, String customer_id);
    Map<String, Object> inquiryHistory(Criteria cri, String customer_id);
    Map<String, Object> inquiryManage(Criteria cri);
    InquiryDTO inquiryView(Long inquiry_no);
    void replyProcess(Map<String, String> param);
    void deleteInquiries(List<Long> inquiryIds);
}