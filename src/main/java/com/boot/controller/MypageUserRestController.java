package com.boot.controller;

import com.boot.dto.*;
import com.boot.service.InquiryService;
import com.boot.service.LoginService;
import com.boot.service.Mypage_Service;
import com.boot.service.Mypage_UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mypage/user")
public class MypageUserRestController {

    private final Mypage_UserService userService;
    private final Mypage_Service carService;
    private final InquiryService inquiryService;
    private final LoginService loginService;

    /** 🔹 React 마이페이지 정보 제공 */
    @GetMapping("/info")
    public ResponseEntity<?> getUserInfo(
            @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
            HttpSession session) {

        String customer_id = (String) session.getAttribute("accountId");

        if (customer_id == null) {
            return ResponseEntity.status(401).body("NOT_LOGIN");
        }

        // 1. 회원 기본 정보
        AccountDTO user = userService.getUserInfo(customer_id);
 
        // 2. 차량 리스트
        List<MypageDTO> carList = carService.selectCarList(customer_id);

        // 3. 문의 내역 (새 구조 반영)
        List<InquiryDTO> inquiryList = new ArrayList<>();
        PagingDTO pageMaker = null;

        try {
            Criteria cri = new Criteria();
            cri.setPageNum(pageNum);
            cri.setAmount(10);

            inquiryList = inquiryService.getInquiryListWithPaging(cri, customer_id);
            int total = inquiryService.getTotalUserInquiry(cri, customer_id);
            pageMaker = new PagingDTO(total, cri);

        } catch (Exception e) {
            log.error("마이페이지 문의 내역 조회 실패", e);
            // inquiryList = 빈값 유지
        }

        // 최종 묶어서 리턴(JSON)
        Map<String, Object> result = new HashMap<>();
        result.put("user", user);
        result.put("carList", carList);
        result.put("inquiryList", inquiryList);
        result.put("pageMaker", pageMaker);

        return ResponseEntity.ok(result);
    }



    /** 🔹 차량 등록 */
    @PostMapping("/addCar")
    public ResponseEntity<?> addCar(@RequestBody MypageDTO dto, HttpSession session) {
        String accountId = (String) session.getAttribute("accountId");
        if (accountId == null) return ResponseEntity.status(401).body("NOT_LOGIN");

        dto.setAccount_id(accountId);
        carService.insertCar(dto);

        return ResponseEntity.ok("SUCCESS");
    }

    /** 🔹 차량 삭제 */
    @DeleteMapping("/deleteCar/{carNumber}")
    public ResponseEntity<?> deleteCar(@PathVariable String carNumber, HttpSession session) {
        String accountId = (String) session.getAttribute("accountId");
        if (accountId == null) return ResponseEntity.status(401).body("NOT_LOGIN");

        carService.deleteCar(carNumber);
        return ResponseEntity.ok("SUCCESS");
    }

    /** 🔹 회원정보 수정 */
    @PostMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody AccountDTO dto, HttpSession session) {
        String accountId = (String) session.getAttribute("accountId");
        if (accountId == null) return ResponseEntity.status(401).body("NOT_LOGIN");

        dto.setAccountId(accountId);
        userService.updateUserInfo(dto);

        // 비밀번호 변경
        if (dto.getNewPassword() != null && !dto.getNewPassword().isEmpty()) {
            boolean ok = userService.updatePassword(accountId, dto.getCurrentPassword(), dto.getNewPassword());
            if (!ok) return ResponseEntity.ok("INVALID_PASSWORD");
        }

        return ResponseEntity.ok("SUCCESS");
    }
}
