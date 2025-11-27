package com.boot.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boot.dto.StoreDTO;
import com.boot.service.StoreService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api") // 1. 공통 주소 /api
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // 리액트 허용
public class StoreController {

    private final StoreService storeService;

    // 2. 세부 주소 registerstore -> 최종 주소: /api/registerstore
    @PostMapping("/registerstore")
    public ResponseEntity<String> registerStore(@RequestBody StoreDTO dto) {
        
        boolean isSuccess = storeService.registerStore(dto);
        
        if (isSuccess) {
            // 리액트에서 response.text() === "success" 로 비교하므로 "success" 반환
            return ResponseEntity.ok("success");
        } else {
            return ResponseEntity.badRequest().body("fail");
        }
    }
}