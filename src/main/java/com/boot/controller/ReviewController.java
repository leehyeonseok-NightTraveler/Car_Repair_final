package com.boot.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.boot.dto.ReviewDTO;
import com.boot.service.ReviewService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
public class ReviewController {

	private final ReviewService service;

	@PostMapping("/add")
	public ResponseEntity<?> addReview(@RequestBody ReviewDTO dto, HttpSession session) {

	    String loginId = (String) session.getAttribute("accountId");
	    if (loginId == null) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                             .body("로그인 후 이용해주세요.");
	    }

	    dto.setAccountId(loginId); // 여기서 accountId 자동 설정

	    service.insertReview(dto, loginId);

	    return ResponseEntity.ok("리뷰 등록 완료");
	}

    @PostMapping("/update")
    public ResponseEntity<?> updateReview(@RequestBody ReviewDTO dto, HttpSession session) {
        String accountId = (String) session.getAttribute("accountId");
        service.updateReview(dto, accountId);
        return ResponseEntity.ok("리뷰 수정 완료");
    }

    @GetMapping("/store/{storeId}")
    public List<ReviewDTO> getStoreReviews(@PathVariable String storeId) {
        return service.getStoreReviews(storeId);
    }
    
}
