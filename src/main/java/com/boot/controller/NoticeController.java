package com.boot.controller;

import com.boot.dto.*;
import com.boot.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class NoticeController {

    private final NoticeService noticeService;

    // 1. 목록 - 당신이 원하는 URL 그대로!
    @GetMapping("/notice_list")
    public Map<String, Object> list(Criteria cri) {
        return Map.of(
                "list", noticeService.getNoticeList(cri),
                "pageMaker", new PagingDTO(noticeService.getTotalCount(cri), cri)
        );
    }

    // 2. 상세보기 - 당신이 원하는 /notice_view/123 그대로!
    @GetMapping("/notice_view/{no}")
    public Map<String, Object> detail(@PathVariable Long no, HttpSession session) {
        String role = (String) session.getAttribute("ROLE");

        // 일반 유저만 조회수 증가
        if (!"ADMIN".equals(role)) {
            noticeService.increaseViews(no);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("view", noticeService.getNoticeById(no));
        response.put("role", role != null ? role : "USER");
        response.put("pageMaker", null); // 필요시 페이징 정보 추가 가능
        return response;
    }

    // 3. 작성 권한 체크 - 당신이 원하는 URL 그대로!
    @GetMapping("/notice_write/auth")
    public ResponseEntity<Void> checkWriteAuth(HttpSession session) {
        if (!"ADMIN".equals(session.getAttribute("ROLE"))) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok().build();
    }

    // 4. 작성 처리 - 당신이 원하는 /notice_write 그대로!
    @PostMapping("/notice_write")
    public ResponseEntity<String> write(@RequestBody NoticeDTO notice, HttpSession session) {
        if (!"ADMIN".equals(session.getAttribute("ROLE"))) {
            return ResponseEntity.status(403).body("권한 없음");
        }
        noticeService.writeNotice(notice);
        return ResponseEntity.ok("success");
    }

    // 5. 수정 폼 데이터 불러오기 - 당신이 원하는 /notice_modify/123 그대로!
    @GetMapping("/notice/modify/{no}")
    public Map<String, Object> getModifyForm(@PathVariable Long no, Criteria cri, HttpSession session) {
        if (!"ADMIN".equals(session.getAttribute("ROLE"))) {
            throw new RuntimeException("권한 없음");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("notice", noticeService.getNoticeById(no));
        response.put("pageMaker", new PagingDTO(noticeService.getTotalCount(cri), cri));
        return response;
    }

    // 6. 수정 처리 - 당신이 원하는 /notice_modify/123 그대로!
    @PutMapping("/notice_modify/{no}")
    public ResponseEntity<String> modify(
            @PathVariable Long no,
            @RequestBody NoticeDTO notice,
            HttpSession session) {

        if (!"ADMIN".equals(session.getAttribute("ROLE"))) {
            return ResponseEntity.status(403).body("권한 없음");
        }

        notice.setNotice_no(no);
        noticeService.updateNotice(notice);
        return ResponseEntity.ok("success");
    }

    // 7. 삭제 - 당신이 원하는 /notice_view/123 로 DELETE!
    @DeleteMapping("/notice_view/{no}")
    public ResponseEntity<String> delete(@PathVariable Long no, HttpSession session) {
        if (!"ADMIN".equals(session.getAttribute("ROLE"))) {
            return ResponseEntity.status(403).body("권한 없음");
        }
        noticeService.deleteNotice(no);
        return ResponseEntity.ok("success");
    }
}