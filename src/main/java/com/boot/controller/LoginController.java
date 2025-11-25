package com.boot.controller;

import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boot.dto.LoginDTO;
import com.boot.service.LoginService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@Slf4j
public class LoginController {
    
    @Autowired
    private LoginService loginService;
	
    @PostMapping("/login")
    public HashMap<String, Object> login(
            @RequestBody HashMap<String, String> req,
            HttpServletRequest request,
            HttpServletResponse response) {

        String accountId = req.get("accountId");
        String password = req.get("password");
        boolean saveId = Boolean.parseBoolean(req.getOrDefault("saveId", "false"));

        log.info("@# Login API 호출 => {}", accountId);

        HashMap<String, Object> result = new HashMap<>();
        HttpSession session = request.getSession();

        // 조회
        HashMap<String, String> param = new HashMap<>();
        param.put("accountId", accountId);
        param.put("password", password);

        // 실패 횟수 확인
        Integer failCount = (Integer) session.getAttribute("loginFailCount");
        Long lockTime = (Long) session.getAttribute("lockTime");

        if (failCount == null) failCount = 0;

        // 🔒 로그인 잠금 확인 (30초)
        if (lockTime != null) {
            long diff = (System.currentTimeMillis() - lockTime) / 1000;
            if (diff < 30) {
                long remain = 30 - diff;
                result.put("success", false);
                result.put("message", "로그인 잠금 상태입니다. " + remain + "초 후 다시 시도하세요.");
                return result;
            } else {
                session.removeAttribute("lockTime");
                failCount = 0;
                session.setAttribute("loginFailCount", 0);
            }
        }

        ArrayList<LoginDTO> dtos = loginService.loginYn(param);

        // -----------------------------
        // ❌ 로그인 실패
        // -----------------------------
        if (dtos == null || dtos.isEmpty()) {

            failCount++;
            session.setAttribute("loginFailCount", failCount);

            if (failCount >= 5) {
                session.setAttribute("lockTime", System.currentTimeMillis());
                result.put("success", false);
                result.put("message", "5회 이상 실패로 30초간 잠금되었습니다.");
            } else {
                result.put("success", false);
                result.put("message", "아이디 또는 비밀번호가 틀렸습니다. (" + failCount + "/5)");
            }

            return result;
        }

        // 계정 조회 성공
        LoginDTO dto = dtos.get(0);

        // 계정 상태 체크
        if ("SUSPENDED".equals(dto.getAccountStatus())) {
            result.put("success", false);
            result.put("message", "정지된 계정입니다. 관리자에게 문의하세요.");
            return result;
        }
        if ("DELETED".equals(dto.getAccountStatus())) {
            result.put("success", false);
            result.put("message", "삭제된 계정입니다. 로그인할 수 없습니다.");
            return result;
        }

        // -----------------------------
        // ✔ 비밀번호 일치
        // -----------------------------
        if (password.equals(dto.getPassword())) {

            // 아이디 저장 쿠키 처리
            if (saveId) {
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

            // 로그인 성공 → 세션 저장
            session.setAttribute("accountId", dto.getAccountId());
            session.setAttribute("ROLE", dto.getAccountRole());

            // 실패 정보 초기화
            session.removeAttribute("loginFailCount");
            session.removeAttribute("lockTime");

            result.put("success", true);
            result.put("role", dto.getAccountRole());
            result.put("message", "로그인 성공");

            return result;
        }

        // -----------------------------
        // ❌ 비밀번호 불일치
        // -----------------------------
        failCount++;
        session.setAttribute("loginFailCount", failCount);

        if (failCount >= 5) {
            session.setAttribute("lockTime", System.currentTimeMillis());
            result.put("success", false);
            result.put("message", "5회 이상 실패로 30초간 잠금되었습니다.");
        } else {
            result.put("success", false);
            result.put("message", "비밀번호가 틀렸습니다. (" + failCount + "/5)");
        }

        return result;
    }

    // 로그아웃
    @GetMapping("/logout")
    public HashMap<String, Object> logout(HttpSession session) {

        session.invalidate();

        HashMap<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "로그아웃 완료");

        return result;
    }
}
