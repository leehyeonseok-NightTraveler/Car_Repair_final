package com.boot.controller;

import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/react/chat")
@CrossOrigin(origins = "http://localhost:5173") 
public class ChatbotController {

    // 💡 ChatClient 관련 코드는 모두 제거하고 Mock(규칙 기반)으로 작동합니다.

    @PostMapping
    public Map<String, String> chat(@RequestBody Map<String, String> payload) {
        String userMessage = payload.get("message");
        String reply = "";
        
        // [수정됨] 예약 페이지 대신 1:1 문의 페이지로 연결
        String inquiryLink = "<a href='/inquiry/history' target='_blank' style='color:#0066cc; font-weight:bold; text-decoration:underline;'>1:1 문의 페이지</a>";

        if (userMessage.contains("안녕")) {
            reply = "안녕하세요! 스피드모터스 정비 상담 AI입니다. 🛠️\n차량 점검이나 문의사항이 있으시면 말씀해주세요.";
        } else if (userMessage.contains("가격") || userMessage.contains("비용") || userMessage.contains("견적")) {
            // '예약' 대신 '상담원과 문의'로 유도
            reply = "💰 정확한 견적은 차량 정보 확인 후 상담이 필요합니다. " + inquiryLink + "를 통해 문의해 주세요.";
        } else if (userMessage.contains("영업") || userMessage.contains("시간")) {
            reply = "⏰ 영업 시간 안내\n평일: 09:00 ~ 19:00\n주말: 09:00 ~ 15:00\n(매주 일요일은 휴무입니다)";
        } else if (userMessage.contains("위치") || userMessage.contains("주소")) {
            reply = "📍 저희 정비소는 지도 페이지에 표시된 위치에 있습니다. 자세한 상담은 " + inquiryLink + "를 이용해주세요.";
        } else {
            // 일반 응답
            reply = "궁금한 사항은 언제든지 말씀해주시거나, " + inquiryLink + "를 통해 전문가와 상담하실 수 있습니다.";
        }
        
        Map<String, String> response = new HashMap<>();
        response.put("response", reply);
        
        return response;
    }
}