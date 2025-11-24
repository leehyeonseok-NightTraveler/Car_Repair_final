package com.boot.controller;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.boot.service.AdminService; // AdminService 주입

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class AdminController {

    @Autowired
    private AdminService adminService; // AdminService 주입

    /**
     * 관리자 승급 페이지(JSP)를 엽니다.
     */
    @GetMapping("/promote_admin")
    public String promoteAdminForm(HttpSession session) {

        // [★중요★] 로그인 컨트롤러에서 저장한 세션 키("accountId")를 확인합니다.
        if (session.getAttribute("accountId") == null) {
            return "redirect:/login"; // 로그인 안 했으면 로그인 페이지로
        }

        log.info("@# GET /promote_admin (관리자 승급 페이지 열기)");
        return "promote_admin"; // /WEB-INF/views/promote_admin.jsp
    }

    /**
     * 관리자 키를 받아 승급을 처리합니다.
     */
    @PostMapping("/promoteAdminProc")
    public String promoteAdminProc(@RequestParam("adminKey") String adminKey, 
                                 HttpSession session, 
                                 RedirectAttributes rttr) {

        log.info("@# POST /promoteAdminProc (관리자 승급 처리)");

        // [★중요★] 로그인 컨트롤러에서 저장한 세션 키("accountId")를 사용합니다.
        String loginId = (String) session.getAttribute("accountId"); 
        if (loginId == null) {
            return "redirect:/login"; // 세션 만료
        }

        // AdminService를 호출하여 로직 처리
        boolean isSuccess = adminService.upgradeToAdmin(loginId, adminKey);

        if (isSuccess) {
            // [★중요★] if문이 true일 때 (키가 'abcd'일 때)
            // 3. 세션 정보도 'ADMIN'으로 갱신 (헤더 메뉴 변경을 위해)
            // (LoginController가 "ROLE"을 쓴다면 "ROLE"로, "role"을 쓴다면 "role"로 통일)
            session.setAttribute("ROLE", "ADMIN"); // LoginController에 맞춰 "ROLE" 사용

            rttr.addFlashAttribute("success_msg", "관리자 권한으로 승급되었습니다!");
            return "redirect:/main"; // 성공 시 메인 페이지로
        } else {
            // [★중요★] if문이 false일 때 (키가 'abcd'가 아니거나 DB 오류일 때)
            rttr.addFlashAttribute("error_msg", "관리자 키가 일치하지 않습니다.");
            return "redirect:/promote_admin";
        }
    }
    
    @GetMapping("/admin/exit")
    public String exitAdminMode(HttpSession session, RedirectAttributes rttr) {
        // 현재 세션에서 ROLE을 USER로 변경
        session.setAttribute("ROLE", "USER");

        // 안내 메시지
        rttr.addFlashAttribute("msg", "관리자 모드가 해제되었습니다.");

        // 메인 페이지나 일반 사용자 마이페이지로 리다이렉트
        return "redirect:/main";
    }
}