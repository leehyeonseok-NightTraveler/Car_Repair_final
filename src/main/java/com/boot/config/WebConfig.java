package com.boot.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        
        // 모든 경로(/**)에 대해 리액트 접속을 허용한다.
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173") // [중요] * 대신 정확한 주소 입력
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 모든 방식 허용
                .allowCredentials(true) // [중요] 로그인 정보(세션/쿠키) 허용
                .maxAge(3600); // 설정 캐시 시간 (1시간)
    }
}