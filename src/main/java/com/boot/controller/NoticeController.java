package com.boot.controller;

import com.boot.dto.AccountDTO;
import com.boot.dto.Criteria;
import com.boot.dto.NoticeDTO;
import com.boot.dto.PagingDTO;
import com.boot.service.NoticeService;
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

/**
 * 공지사항 관련 컨트롤러
 */
@Controller
@Slf4j
@RequestMapping("/notice")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    /**
     * 1. 공지사항 목록 페이지
     */
    @RequestMapping("/notice_list")
    public String noticeList(@RequestParam HashMap<String, String> param, Criteria cri,
                             Model model, HttpSession session) {
        log.info("noticeList()");

        // 사용자 역할 확인 (관리자 여부)
        String Role = (String) session.getAttribute("ROLE");
        if ("ADMIN".equals(Role)) {
            model.addAttribute("role", Role);
        }

        // 공지사항 목록 조회
        List<NoticeDTO> noticeList = noticeService.noticeList(param, cri);
        model.addAttribute("list", noticeList);

        // 페이징 처리 정보 추가
        int total = noticeService.getTotalCount();
        model.addAttribute("pageMaker", new PagingDTO(total, cri));

        return "notice/notice_list";
    }

    /**
     * 2. 공지사항 상세 보기
     */
    @RequestMapping("/notice_view")
    public String noticeView(@RequestParam HashMap<String, String> param, Criteria cri,
                             Model model, HttpSession session) {
        log.info("noticeView()");

        // 사용자 역할 확인
        String Role = (String) session.getAttribute("ROLE");
        if ("ADMIN".equals(Role)) {
            model.addAttribute("role", Role);
        }

        // 조회수 증가 처리
        noticeService.increaseViews(param);

        // 공지사항 상세 정보 조회
        NoticeDTO noticeView = noticeService.noticeView(param);
        int total = noticeService.getTotalCount();

        // 모델에 데이터 추가
        model.addAttribute("view", noticeView);
        model.addAttribute("pageMaker", new PagingDTO(total, cri));

        return "notice/notice_view";
    }

    /**
     * 3. 공지사항 작성 페이지 이동 (로그인 필요)
     */
    @RequestMapping("/notice_write")
    public String noticeWrite(HttpSession session) {
        log.info("notice_write()");

        // 관리자가 경우 작성 불가
        String Role = (String) session.getAttribute("ROLE");
        if (!"ADMIN".equals(Role)) return "redirect:/login";

        return "notice/notice_write";
    }

    /**
     * 4. 공지사항 작성 처리
     */
    @RequestMapping("/writeProcess")
    public String writeProcess(@RequestParam HashMap<String, String> param, HttpSession session) {
        log.info("writeProcess()");

        // 관리자가 아닐 경우 작성 불가
        String Role = (String) session.getAttribute("ROLE");
        if (!"ADMIN".equals(Role)) return "redirect:/login";

        // 공지사항 등록 처리
        noticeService.writeProcess(param);

        return "redirect:/notice/notice_list";
    }

    /**
     * 5. 공지사항 수정 페이지 이동
     */
    @RequestMapping("/notice_modify")
    public String noticeModify(@RequestParam HashMap<String, String> param, Criteria cri,
                               Model model, HttpSession session) {
        log.info("noticeModify()");

        // 관리자가 아닐 경우 수정 불가
        String Role = (String) session.getAttribute("ROLE");
        if (!"ADMIN".equals(Role)) return "redirect:/login";

        // 수정할 공지사항 정보 조회
        NoticeDTO noticeModify = noticeService.noticeView(param);
        model.addAttribute("modify", noticeModify);

        // 페이징 정보 추가
        int total = noticeService.getTotalCount();
        model.addAttribute("pageMaker", new PagingDTO(total, cri));

        return "notice/notice_modify";
    }

    /**
     * 6. 공지사항 수정 처리
     */
    @RequestMapping("/modifyProcess")
    public String modify(@RequestParam HashMap<String, String> param,
                         RedirectAttributes attr, HttpSession session) {
        log.info("modifyProcess()");

        // 관리자가 아닐 경우 수정 불가
        String Role = (String) session.getAttribute("ROLE");
        if (!"ADMIN".equals(Role)) return "redirect:/login";

        // 수정 처리
        noticeService.modifyProcess(param);

        // 페이지 정보 유지
        attr.addAttribute("pageNum", param.get("pageNum"));
        attr.addAttribute("amount", param.get("amount"));

        return "redirect:/notice/notice_list";
    }

    /**
     * 7. 공지사항 삭제 처리
     */
    @RequestMapping("/deleteProcess")
    public String deleteProcess(@RequestParam HashMap<String, String> param,
                                RedirectAttributes attr, HttpSession session) {
        log.info("deleteProcess()");

        // 관리자가 아닐 경우 삭제 불가
        String Role = (String) session.getAttribute("ROLE");
        if (!"ADMIN".equals(Role)) return "redirect:/login";

        // 삭제 처리
        noticeService.deleteProcess(param);

        // 페이지 정보 유지
        attr.addAttribute("pageNum", param.get("pageNum"));
        attr.addAttribute("amount", param.get("amount"));

        return "redirect:/notice/notice_list";
    }
}