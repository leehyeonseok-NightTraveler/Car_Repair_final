package com.boot.controller;

import com.boot.dto.AccountDTO;
import com.boot.dto.Criteria;
import com.boot.dto.InquiryDTO;
import com.boot.dto.PagingDTO;
import com.boot.service.InquiryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;

@Controller
@Slf4j
@RequestMapping("/inquiry")
public class InquiryController {

    @Autowired
    private InquiryService service;

    /**
     * 1. 문의 작성 페이지 진입
     */
    @RequestMapping("/inquiry_write")
    public String inquiry_write(HttpSession session, Model model) {
        log.info("inquiryWrite()");

        // 로그인 여부 확인
        String userId = (String) session.getAttribute("accountId");
        String storeId = (String) session.getAttribute("storeId");
        String Role = (String) session.getAttribute("ROLE");

        if (userId == null && storeId == null) return "redirect:/login";

        // 사용자 역할 전달
        model.addAttribute("role", Role);

        return "inquiry/inquiry_write";
    }

    /**
     * 2. 문의 작성 처리
     */
    @RequestMapping("/writeProcess")
    public String writeProcess(@RequestParam HashMap<String, String> param, HttpSession session) {
        log.info("writeProcess()");

        // 로그인 정보 확인
        String userId = (String) session.getAttribute("accountId");
        String storeId = (String) session.getAttribute("storeId");
        String Role = (String) session.getAttribute("ROLE");

        if (userId == null && storeId == null) return "redirect:/login";

        // 사용자 유형에 따라 customer_id 설정
        if ("USER".equals(Role)) {
            param.put("customer_id", userId);
        } else {
            param.put("customer_id", storeId);
        }

        // 문의 등록 처리
        service.writeProcess(param);

        return "redirect:/inquiry/inquiry_history";
    }

    /**
     * 3. 사용자 문의 내역 조회
     */
    @RequestMapping("/inquiry_history")
    public String inquiry_history(@RequestParam HashMap<String, String> param, Model model,
                                  HttpSession session, Criteria cri) {
        log.info("inquiryHistory()");

        // 로그인 및 권한 확인
        String userId = (String) session.getAttribute("accountId");
        String storeId = (String) session.getAttribute("storeId");
        String Role = (String) session.getAttribute("ROLE");

        if (userId == null && storeId == null) return "redirect:/login";
        if ("ADMIN".equals(Role)) return "redirect:/inquiry/inquiry_manage";

        // 사용자 유형에 따라 customer_id 설정
        String loginId;
        if ("USER".equals(Role)) {
            param.put("customer_id", userId);
            loginId = userId;
        } else {
            param.put("customer_id", storeId);
            loginId = storeId;
        }

        // 문의 목록 조회
        List<InquiryDTO> inquiryList = service.inquiryList(param, cri);
        model.addAttribute("inquiryList", inquiryList);

        // 페이징 처리
        int total = service.TotalInquiryUser(loginId, cri);
        model.addAttribute("pageMaker", new PagingDTO(total, cri));

        model.addAttribute("role", Role);

        return "inquiry/inquiry_history";
    }

    /**
     * 4. 문의 상세 조회
     */
    @RequestMapping("/inquiry_view")
    public String inquiry_view(@RequestParam HashMap<String, String> param, Model model, HttpSession session) {
        log.info("inquiryView()");

        // 로그인 정보 확인
        String userId = (String) session.getAttribute("accountId");
        String storeId = (String) session.getAttribute("storeId");
        String Role = (String) session.getAttribute("ROLE");

        if (userId == null && storeId == null) return "redirect:/login";

        // 사용자 유형에 따라 customer_id 설정
        String loginId;
        if ("USER".equals(Role)) {
            param.put("customer_id", userId);
            loginId = userId;
        } else {
            param.put("customer_id", storeId);
            loginId = storeId;
        }

        // 문의 상세 조회
        InquiryDTO inquiryView = service.inquiryView(param);
        model.addAttribute("inquiryView", inquiryView);
        model.addAttribute("role", Role);

        return "inquiry/inquiry_view";
    }

    /**
     * 5. 관리자 답변 작성 페이지 진입
     */
    @RequestMapping("/reply_write")
    public String reply_write(@RequestParam HashMap<String, String> param, HttpSession session, Model model) {
        log.info("replyWrite()");

        // 관리자 권한 확인
        String Role = (String) session.getAttribute("ROLE");
        if (!"ADMIN".equals(Role)) return "redirect:/login";

        // 문의 정보 조회 후 답변 작성 페이지로 이동
        InquiryDTO inquiryView = service.inquiryView(param);
        model.addAttribute("reply", inquiryView);
        model.addAttribute("role", Role);

        return "inquiry/reply_write";
    }

    /**
     * 6. 관리자 답변 등록 처리
     */
    @RequestMapping("/replyProcess")
    public String replyProcess(@RequestParam HashMap<String, String> param, HttpSession session, RedirectAttributes attr) {
        log.info("replyProcess()");

        // 관리자 권한 확인
        String Role = (String) session.getAttribute("ROLE");
        if (!"ADMIN".equals(Role)) return "redirect:/login";

        // 답변 등록 처리
        service.replyProcess(param);

        // 상세 페이지로 리다이렉트
        attr.addAttribute("inquiry_no", param.get("inquiry_no"));

        return "redirect:/inquiry/inquiry_view";
    }

    /**
     * 7. 관리자 문의 관리 페이지
     */
    @RequestMapping("/inquiry_manage")
    public String inquiry_manage(@RequestParam HashMap<String, String> param, Model model,
                                 HttpSession session, Criteria cri) {
        log.info("inquiryManage()");

        // 관리자 권한 확인
        String Role = (String) session.getAttribute("ROLE");
        if (!"ADMIN".equals(Role)) return "redirect:/login";

        // 전체 문의 목록 조회
        List<InquiryDTO> inquiryManageList = service.inquiryManageList(param, cri);
        model.addAttribute("ManageList", inquiryManageList);

        // 페이징 처리
        // ⚠️ 수정: TotalInquiry 메서드에 Criteria 객체를 전달하여 검색 조건이 적용된 총 개수를 얻도록 합니다.
        int total = service.TotalInquiry(cri);
        model.addAttribute("pageMaker", new PagingDTO(total, cri));

        model.addAttribute("role", Role);

        return "inquiry/inquiry_manage";
    }

    @RequestMapping("/deleteProcess")
    public String deleteProcess(@RequestParam("deleteIds") List<Long> deleteIds) {
        service.deleteInquiries(deleteIds);
        return "redirect:/inquiry/inquiry_history";
    }
}