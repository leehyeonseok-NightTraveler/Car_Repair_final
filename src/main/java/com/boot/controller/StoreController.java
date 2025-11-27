package com.boot.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam; // [★ 1. import 추가]
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.boot.dto.StoreDTO;
import com.boot.service.StoreService; 

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/stores")
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
public class StoreController {

    @Autowired
    private StoreService storeService;

    // ... (registerStoreForm 메소드는 그대로) ...
    @GetMapping("/registerstore")
    public String registerStoreForm() {
        log.info("@# GET /registerstore (업체 회원가입 페이지 열기)");
        return "registerstore";
    }

    /**
     * [★ 2. 메소드 시그니처 수정]
     * StoreDTO가 받지 못하는 3개의 파라미터를 @RequestParam으로 직접 받습니다.
     */
    @PostMapping("/registerstoreProc")
    public String registerStoreProc(StoreDTO storeDTO, 
                                  @RequestParam("dayType") String dayType,
                                  @RequestParam("startTime") String startTime,
                                  @RequestParam("endTime") String endTime,
                                  RedirectAttributes rttr) {
        
        log.info("@# POST /registerstoreProc (업체 회원가입 처리)");
        
        // [★ 3. 로직 추가] 3개의 파라미터를 "평일 09:00 - 18:00" 형태로 조립
        String openingHours = dayType + " " + startTime + " - " + endTime;
        
        // [★ 4. DTO에 조립된 문자열 삽입]
        storeDTO.setOpeningHours(openingHours);

        log.info("@# 완성된 Store DTO ===> " + storeDTO);
        
        try {
            // 서비스는 수정할 필요 없이 그대로 DTO를 받아서 처리
            storeService.registerStore(storeDTO);
            
        } catch (Exception e) {
            log.error("!!! 업체 회원가입 실패: " + e.getMessage());
            rttr.addFlashAttribute("error_msg", "가입 실패 (아이디/이메일/연락처 중복)");
            return "redirect:/registerstore"; 
        }

        rttr.addFlashAttribute("success_msg", "업체 회원가입이 완료되었습니다. 로그인해주세요.");
        return "redirect:/login"; 
    }

    /**
     * GET /api/stores : 예약 가능한 정비소 목록 조회 (프론트엔드 Reservation 컴포넌트에서 호출)
     */
    @GetMapping
    public ResponseEntity<List<StoreDTO>> getStoreList() {
        List<StoreDTO> stores = storeService.getAllStores();
        
        // 목록이 비어있으면 204 No Content 대신 빈 배열과 200 OK를 반환하여 프론트 처리가 용이하도록 합니다.
        return ResponseEntity.ok(stores); 
    }
}