// src/main/java/com/boot/service/InquiryServiceImpl.java
package com.boot.service;

import com.boot.dao.InquiryDAO;
import com.boot.dto.Criteria;
import com.boot.dto.InquiryDTO;
import com.boot.dto.PagingDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InquiryServiceImpl implements InquiryService {

    private final InquiryDAO dao;

    @Override
    public void writeProcess(Map<String, String> param, String customer_id) {
        param.put("customer_id", customer_id);
        dao.writeProcess(param);
    }

    @Override
    public Map<String, Object> inquiryHistory(Criteria cri, String customer_id) {
        Map<String, Object> param = new HashMap<>();
        param.put("customer_id", customer_id);
        param.put("cri", cri);

        List<InquiryDTO> inquiryList = dao.inquiryList(param);
        int total = dao.TotalInquiryUser(customer_id);

        Map<String, Object> result = new HashMap<>();
        result.put("inquiryList", inquiryList);
        result.put("pageMaker", new PagingDTO(total, cri));
        result.put("role", "USER");  // 실제 세션에서 가져오도록 수정 예정
        return result;
    }

    @Override
    public Map<String, Object> inquiryManage(Criteria cri) {
        List<InquiryDTO> ManageList = dao.inquiryManageList(cri);
        int total = dao.TotalInquiry(cri);

        Map<String, Object> result = new HashMap<>();
        result.put("ManageList", ManageList);
        result.put("pageMaker", new PagingDTO(total, cri));
        result.put("role", "ADMIN");
        return result;
    }

    @Override
    public InquiryDTO inquiryView(Long inquiry_no) {
        return dao.inquiryView(inquiry_no);
    }

    @Override
    public void replyProcess(Map<String, String> param) {
        dao.replyProcess(param);
    }

    @Override
    public void deleteInquiries(List<Long> inquiryIds) {
        if (inquiryIds != null && !inquiryIds.isEmpty()) {
            dao.deleteInquiries(inquiryIds);
        }
    }
}