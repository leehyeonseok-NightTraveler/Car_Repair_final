// src/main/java/com/boot/controller/InquiryController.java
package com.boot.controller;

import com.boot.dto.Criteria;
import com.boot.dto.InquiryDTO;
import com.boot.service.InquiryService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")

import javax.servlet.http.HttpSession;

@Controller
@Slf4j
@RequestMapping("/inquiry")
public class InquiryController {

    private final InquiryService inquiryService;

    // 1. 내 문의 내역
    @GetMapping("/inquiry_history")
    public Map<String, Object> inquiry_history(Criteria cri, HttpSession session) {
        String customer_id = (String) session.getAttribute("customer_id");
        if (customer_id == null) {
            return Map.of("redirect", "/login");
        }
        return inquiryService.inquiryHistory(cri, customer_id);
    }

    // 2. 관리자 문의 관리
    @GetMapping("/inquiry_manage")
    public Map<String, Object> inquiry_manage(Criteria cri, HttpSession session) {
        String role = (String) session.getAttribute("ROLE");
        if (!"ADMIN".equals(role)) {
            return Map.of("redirect", "/login");
        }
        return inquiryService.inquiryManage(cri);
    }

    // 3. 문의 상세보기
    @GetMapping("/inquiry_view")
    public Map<String, Object> inquiry_view(@RequestParam Long inquiry_no, HttpSession session) {
        String customer_id = (String) session.getAttribute("customer_id");
        if (customer_id == null) {
            return Map.of("redirect", "/login");
        }

        InquiryDTO inquiry = inquiryService.inquiryView(inquiry_no);
        String role = (String) session.getAttribute("ROLE");

        Map<String, Object> response = new HashMap<>();
        response.put("inquiryView", inquiry);
        response.put("role", role != null ? role : "USER");
        return response;
    }

    // 4. 문의 작성 페이지
    @GetMapping("/inquiry_write")
    public Map<String, Object> inquiry_write(HttpSession session) {
        if (session.getAttribute("customer_id") == null) {
            return Map.of("redirect", "/login");
        }
        return Map.of("role", session.getAttribute("ROLE"));
    }

    // 5. 문의 등록
    @PostMapping("/writeProcess")
    public ResponseEntity<String> writeProcess(@RequestParam Map<String, String> param, HttpSession session) {
        if (session.getAttribute("customer_id") == null) {
            return ResponseEntity.status(401).body("로그인 필요");
        }
        inquiryService.writeProcess(param, (String) session.getAttribute("customer_id"));
        return ResponseEntity.ok("success");
    }

    // 6. 답변 작성 페이지
    @GetMapping("/reply_write")
    public Map<String, Object> reply_write(@RequestParam Long inquiry_no, HttpSession session) {
        if (!"ADMIN".equals(session.getAttribute("ROLE"))) {
            return Map.of("redirect", "/login");
        }
        return Map.of(
                "reply", inquiryService.inquiryView(inquiry_no),
                "role", "ADMIN"
        );
    }

    // 7. 답변 저장
    @PostMapping("/replyProcess")
    public ResponseEntity<String> replyProcess(@RequestParam Map<String, String> param, HttpSession session) {
        if (!"ADMIN".equals(session.getAttribute("ROLE"))) {
            return ResponseEntity.status(403).body("권한 없음");
        }
        inquiryService.replyProcess(param);
        return ResponseEntity.ok("success");
    }

    // 8. 문의 삭제
    @PostMapping("/deleteProcess")
    public ResponseEntity<String> deleteProcess(@RequestBody Map<String, List<Long>> request, HttpSession session) {
        String role = (String) session.getAttribute("ROLE");
        if (role == null) {
            return ResponseEntity.status(401).body("로그인 필요");
        }
        inquiryService.deleteInquiries(request.get("inquiryIds"));
        return ResponseEntity.ok("success");
    }
}