package com.boot.controller;

import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.boot.dto.StoreLoginDTO;
import com.boot.service.StoreLoginService;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class StoreLoginController {

    @Autowired
    private StoreLoginService storeLoginService;

    // 로그인 페이지
    @GetMapping("/storeLogin")
    public String loginPage() {
        return "storeLogin"; // /WEB-INF/views/storeLogin.jsp
    }

    // 로그인 처리
    @PostMapping("/storeLoginYn")
    public String loginYn(@RequestParam("storeId") String storeId,
                          @RequestParam("password") String password,
                          @RequestParam(value = "saveId", required = false) String saveId,
                          HttpServletRequest request,
                          HttpServletResponse response,
                          RedirectAttributes redirectAttributes) {

        HttpSession session = request.getSession();

        // 로그인 실패 횟수 및 잠금 시간 관리
        Integer failCount = (Integer) session.getAttribute("loginFailCount");
        Long lockTime = (Long) session.getAttribute("lockTime");
        if (failCount == null) failCount = 0;

        // 잠금 상태 확인 (30초)
        if (lockTime != null) {
            long diff = (System.currentTimeMillis() - lockTime) / 1000;
            if (diff < 30) {
                long remain = 30 - diff;
                redirectAttributes.addFlashAttribute("loginFailMsg", "로그인 잠금 상태입니다. " + remain + "초 후 다시 시도하세요.");
                return "redirect:/storeLogin";
            } else {
                // 잠금 해제
                session.removeAttribute("lockTime");
                session.setAttribute("loginFailCount", 0);
                failCount = 0;
            }
        }

        HashMap<String, String> param = new HashMap<>();
        param.put("storeId", storeId);
        param.put("password", password);

        ArrayList<StoreLoginDTO> dtos = storeLoginService.storeLoginYn(param);

        // 로그인 검증
        if (dtos == null || dtos.isEmpty()) {
            // 아이디 없음 → 실패 횟수 증가
            failCount++;
            session.setAttribute("loginFailCount", failCount);

            if (failCount >= 5) {
                session.setAttribute("lockTime", System.currentTimeMillis());
                redirectAttributes.addFlashAttribute("loginFailMsg", "5회 이상 실패로 30초간 잠금되었습니다.");
            } else {
                redirectAttributes.addFlashAttribute("loginFailMsg", "아이디 또는 비밀번호가 틀렸습니다. (" + failCount + "/5)");
            }

            redirectAttributes.addFlashAttribute("loginFail", true);
            return "redirect:/storeLogin";
        } else {
            // 로그인 정보 존재 시
            StoreLoginDTO dto = dtos.get(0);

            if (password.equals(dto.getPassword())) {
                log.info("@@@ 로그인 성공 - storeId: {}", dto.getStoreId());

                // 세션 저장
                session.setAttribute("storeId", dto.getStoreId());
                session.setAttribute("ROLE", "STORE");

                // 아이디 저장 체크박스 처리
                if (saveId != null) {
                    Cookie cookie = new Cookie("storeSavedId", storeId);
                    cookie.setMaxAge(60 * 60 * 24 * 7); // 7일 유지
                    cookie.setPath("/");
                    response.addCookie(cookie);
                    log.info("@@@ 아이디 저장 쿠키 생성");
                } else {
                    Cookie cookie = new Cookie("storeSavedId", null);
                    cookie.setMaxAge(0);
                    cookie.setPath("/");
                    response.addCookie(cookie);
                    log.info("@@@ 아이디 저장 쿠키 삭제");
                }

                // 로그인 실패 관련 세션 초기화
                session.removeAttribute("loginFailCount");
                session.removeAttribute("lockTime");

                return "redirect:/main"; // 로그인 성공 후 메인으로 이동

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
                return "redirect:/storeLogin";
            }
        }
    }
}
