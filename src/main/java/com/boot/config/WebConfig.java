package com.boot.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
    	
    	registry.addMapping("/api/login")
        .allowedOrigins("http://localhost:5173")
        .allowedMethods("POST")
        .allowCredentials(true);
    	
    	registry.addMapping("/api/storeLogin")
    	.allowedOrigins("http://localhost:5173")
    	.allowedMethods("POST")
    	.allowCredentials(true);
    	
    	registry.addMapping("/api/logout")
        .allowedOrigins("http://localhost:5173")
        .allowedMethods("GET")
        .allowCredentials(true);
    	
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowCredentials(false);
    }
}