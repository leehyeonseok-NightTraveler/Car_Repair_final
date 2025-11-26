package com.boot.controller;

import com.boot.dto.*;
import com.boot.service.InquiryService;
import com.boot.service.LoginService;
import com.boot.service.Mypage_Service;
import com.boot.service.Mypage_UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.*;

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

        String accountId = (String) session.getAttribute("accountId");

//        if (accountId == null) {
//            return ResponseEntity.status(401).body("NOT_LOGIN");
//        }

        // 회원 기본 정보
        AccountDTO user = userService.getUserInfo(accountId);

        // 차량 리스트
        List<MypageDTO> carList = carService.selectCarList(accountId);

        // 문의 내역 + 페이징
        Criteria cri = new Criteria(pageNum, 10);
        List<InquiryDTO> inquiryList = inquiryService.selectByAccountId(accountId);
        int total = inquiryService.TotalInquiryUser(accountId, cri);
        PagingDTO pageMaker = new PagingDTO(total, cri);

        // JSON 묶어서 전달
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
