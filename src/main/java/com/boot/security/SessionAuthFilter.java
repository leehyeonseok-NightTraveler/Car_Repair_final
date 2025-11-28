package com.boot.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.*;
import java.io.IOException;

@Slf4j
@Component
public class SessionAuthFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain)
            throws ServletException, IOException {

        String uri = req.getRequestURI();
        String method = req.getMethod();

        // OPTIONS → 무조건 통과
        if ("OPTIONS".equalsIgnoreCase(method)) {
            chain.doFilter(req, res);
            return;
        }

        log.info("🔥 SessionAuthFilter 실행됨: {} {}", method, uri);

        // 공개 URL은 필터 제외
        if (isExcluded(uri)) {
            chain.doFilter(req, res);
            return;
        }

        HttpSession session = req.getSession(false);
        Object accountId = (session != null ? session.getAttribute("accountId") : null);

        log.info("   ▶ 세션 accountId={}", accountId);

        // 세션 없으면 차단
        if (accountId == null) {
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            res.setContentType("application/json;charset=UTF-8");
            res.getWriter().write("{\"success\":false,\"message\":\"로그인이 필요합니다.\"}");
            return;
        }

        chain.doFilter(req, res);
    }

    private boolean isExcluded(String uri) {

        // ---------------------------
        // 1) 정적 리소스 + 에러
        // ---------------------------
        if (uri.startsWith("/css/") ||
            uri.startsWith("/js/") ||
            uri.startsWith("/images/") ||
            uri.equals("/favicon.ico") ||
            uri.equals("/error")) {
            return true;
        }

        // ---------------------------
        // 2) React 공개 라우트
        // ---------------------------
        if (uri.equals("/") ||
            uri.startsWith("/recommend") ||

            uri.startsWith("/login") ||
            uri.startsWith("/storeLogin") ||
            uri.startsWith("/register") ||
            uri.startsWith("/registerstore") ||

            uri.startsWith("/findAccount") ||
            uri.startsWith("/findPW") ||
            uri.startsWith("/findOK") ||

            uri.startsWith("/notice/list") ||
            uri.startsWith("/notice/view") ||

            uri.startsWith("/faq") && !uri.contains("write") && !uri.contains("modify") && !uri.contains("delete") ||

            uri.startsWith("/guide") ||
            uri.startsWith("/autoSearch")) {
            return true;
        }

        // ---------------------------
        // 3) API 공개 엔드포인트
        // ---------------------------
        if (uri.startsWith("/api/login") ||
            uri.startsWith("/api/storeLogin") ||
            uri.startsWith("/api/logout") ||

            uri.startsWith("/api/notice/list") ||
            uri.startsWith("/api/notice/view") ||

            uri.startsWith("/api/faq/list") ||
            uri.startsWith("/api/faq/view")) {
            return true;
        }

        // ---------------------------
        // 그 외 /api/* 는 모두 보호
        // ---------------------------
        if (uri.startsWith("/api/")) {
            return false;
        }

        // ---------------------------
        // React 페이지 → 기본적으로 허용
        // 여기서 보호 판정은 프론트 ProtectedRoute가 담당
        // ---------------------------
        return true;
    }
}
