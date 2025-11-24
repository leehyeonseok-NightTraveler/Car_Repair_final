package com.boot.controller;

import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.boot.dto.LoginDTO;
import com.boot.service.LoginService;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class LoginController {
    
    @Autowired
    private LoginService loginService;
	
    @PostMapping("/loginYn")
    public String loginYn(@RequestParam("accountId") String accountId,
                          @RequestParam("password") String password,
                          @RequestParam(value = "saveId", required = false) String saveId,
                          HttpServletRequest request,
                          HttpServletResponse response,
                          RedirectAttributes redirectAttributes) {
        log.info("@# accountId => {}", accountId);
        log.info("@# password => {}", password);
        
        HttpSession session = request.getSession();
        
        // 실패 횟수 및 잠금 확인
        Integer failCount = (Integer) session.getAttribute("loginFailCount");
        Long lockTime = (Long) session.getAttribute("lockTime");
        if (failCount == null) failCount = 0;

        if (lockTime != null) {
            long diff = (System.currentTimeMillis() - lockTime) / 1000;
            if (diff < 30) {
                long remain = 30 - diff;
                redirectAttributes.addFlashAttribute("loginFailMsg", "로그인 잠금 상태입니다. " + remain + "초 후 다시 시도하세요.");
                return "redirect:/login";
            } else {
                session.removeAttribute("lockTime");
                session.setAttribute("loginFailCount", 0);
                failCount = 0;
            }
        }

        // 로그인 시도
        HashMap<String, String> param = new HashMap<>();
        param.put("accountId", accountId);
        param.put("password", password);

        ArrayList<LoginDTO> dtos = loginService.loginYn(param);

        if (dtos == null || dtos.isEmpty()) {
            // 로그인 실패
            failCount++;
            session.setAttribute("loginFailCount", failCount);

            if (failCount >= 5) {
                session.setAttribute("lockTime", System.currentTimeMillis());
                redirectAttributes.addFlashAttribute("loginFailMsg", "5회 이상 실패로 30초간 잠금되었습니다.");
            } else {
                redirectAttributes.addFlashAttribute("loginFailMsg", "아이디 또는 비밀번호가 틀렸습니다. (" + failCount + "/5)");
            }

            redirectAttributes.addFlashAttribute("loginFail", true);
            return "redirect:/login";
        } else {
            LoginDTO dto = dtos.get(0);

            // 계정 상태 확인 (정지/삭제)
            String status = dto.getAccountStatus();
            if ("SUSPENDED".equals(status)) {
                redirectAttributes.addFlashAttribute("loginFailMsg", "정지된 계정입니다. 관리자에게 문의하세요.");
                redirectAttributes.addFlashAttribute("loginFail", true);
                return "redirect:/login";
            } else if ("DELETED".equals(status)) {
                redirectAttributes.addFlashAttribute("loginFailMsg", "삭제된 계정입니다. 로그인할 수 없습니다.");
                redirectAttributes.addFlashAttribute("loginFail", true);
                return "redirect:/login";
            }

            // 정상 로그인 시
            if (password.equals(dto.getPassword())) {
                String role = dto.getAccountRole();

                // 아이디 저장 체크박스
                if (saveId != null) {
                    Cookie cookie = new Cookie("savedId", accountId);
                    cookie.setMaxAge(60 * 60 * 24 * 7);
                    cookie.setPath("/");
                    response.addCookie(cookie);
                } else {
                    Cookie cookie = new Cookie("savedId", null);
                    cookie.setMaxAge(0);
                    cookie.setPath("/");
                    response.addCookie(cookie);
                }

                // 역할별 세션 처리
                session.setAttribute("accountId", accountId);
                session.setAttribute("ROLE", role);
                session.removeAttribute("loginFailCount");
                session.removeAttribute("lockTime");

                if ("ADMIN".equals(role)) {
                    return "redirect:/main";
                } else if ("USER".equals(role)) {
                    return "redirect:/main";
                } else {
                    redirectAttributes.addFlashAttribute("loginFailMsg", "권한이 올바르지 않습니다.");
                    return "redirect:/login";
                }

            } else {
                // 비밀번호 불일치
                failCount++;
                session.setAttribute("loginFailCount", failCount);

                if (failCount >= 5) {
                    session.setAttribute("lockTime", System.currentTimeMillis());
                    redirectAttributes.addFlashAttribute("loginFailMsg", "5회 이상 실패로 30초간 잠금되었습니다.");
                } else {
                    redirectAttributes.addFlashAttribute("loginFailMsg", "비밀번호가 틀렸습니다. (" + failCount + "/5)");
                }

                redirectAttributes.addFlashAttribute("loginFail", true);
                return "redirect:/login";
            }
        }
    }

    // 로그아웃
    @RequestMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        log.info("로그아웃 완료");
        return "redirect:/login";
    }
}
