// src/main/java/com/boot/controller/ChatbotController.java
package com.boot.controller;

import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = {"http://localhost:5173", "https://yourdomain.com"}, maxAge = 3600)
public class ChatbotController {

    private static final String INQUIRY_LINK = "<a href='/inquiry/history' target='_blank' class='text-blue-600 font-bold underline hover:text-blue-800'>1:1 문의 페이지</a>";

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, String> handleChat(@RequestBody Map<String, String> request) {
        String userMessage = request.getOrDefault("message", "").trim().toLowerCase();
        String reply = generateReply(userMessage);

        return Map.of("response", reply);
    }

    private String generateReply(String message) {
        if (message.contains("안녕") || message.contains("하이") || message.contains("hello")) {
            return "안녕하세요! 스피드모터스 AI 정비사입니다. 🚗\n차량 점검, 견적, 영업시간 등 무엇이든 물어보세요!";
        }

        if (message.contains("가격") || message.contains("비용") || message.contains("견적") || message.contains("얼마")) {
            return "정확한 견적은 차량 모델, 연식, 점검 항목에 따라 달라져요.\n" + INQUIRY_LINK + "에서 차량 정보를 남겨주시면 빠르게 답변드릴게요!";
        }

        if (message.contains("영업") || message.contains("시간") || message.contains("오픈") || message.contains("마감")) {
            return "영업시간 안내\n\n" +
                   "평일: 09:00 ~ 19:00\n" +
                   "토요일: 09:00 ~ 15:00\n" +
                   "일요일: 휴무\n\n" +
                   "전화 문의: 02-123-4567";
        }

        if (message.contains("위치") || message.contains("주소") || message.contains("어디")) {
            return "저희 정비소 위치는 홈페이지 지도에서 확인 가능해요!\n" +
                   "정확한 내비 안내는 " + INQUIRY_LINK + "로 문의 주세요.";
        }

        // 기본 응답
        return "좋은 질문 감사합니다!\n" +
               "더 정확한 상담을 원하시면 " + INQUIRY_LINK + "를 통해 전문 상담원과 바로 연결해 드릴게요.";
    }
}