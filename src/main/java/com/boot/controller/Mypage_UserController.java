package com.boot.controller;

import java.util.HashMap;
import java.util.List;
import javax.servlet.http.HttpSession;

import com.boot.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.boot.dto.AccountDTO;
import com.boot.dto.InquiryDTO;
import com.boot.dto.LoginDTO;
import com.boot.dto.MypageDTO;
import com.boot.service.InquiryService;
import com.boot.service.LoginService;
import com.boot.service.Mypage_UserService;
import com.boot.service.Mypage_Service;

@Controller
@RequestMapping("/mypage_user")
public class Mypage_UserController {

    @Autowired
    private Mypage_UserService userService; // 기존 계정 관련

    @Autowired
    private InquiryService inquiryService;

    @Autowired
    private LoginService loginService;

    @Autowired
    private Mypage_Service carService; // ✅ 차량 관련 서비스

    /** 마이페이지 메인 */
    @GetMapping
    public String viewMypage(@RequestParam HashMap<String, String> param, Criteria cri, HttpSession session, Model model, RedirectAttributes rttr) {
        String accountId = (String) session.getAttribute("accountId");

        if (accountId == null) {
            rttr.addFlashAttribute("error_msg", "로그인이 필요합니다.");
            return "redirect:/login";
        }

        LoginDTO loginUser = loginService.findByAccountId(accountId);
        if (loginUser == null || "DELETED".equalsIgnoreCase(loginUser.getAccountStatus())) {
            session.invalidate();
            rttr.addFlashAttribute("error_msg", "삭제된 계정으로 접근할 수 없습니다.");
            return "redirect:/login";
        }

        // 1. 회원 정보 조회
        AccountDTO userInfo = userService.getUserInfo(accountId);
        model.addAttribute("user", userInfo);

        // 로그인 및 권한 확인
        String userId = (String) session.getAttribute("accountId");
        String storeId = (String) session.getAttribute("storeId");
        String Role = (String) session.getAttribute("ROLE");

        // 사용자 유형에 따라 customer_id 설정
        String loginId;
        if ("USER".equals(Role)) {
            param.put("customer_id", userId);
            loginId = userId;
        } else {
            param.put("customer_id", storeId);
            loginId = storeId;
        }

        // 2. 차량 목록 조회
        List<MypageDTO> carList = carService.selectCarList(accountId);
        model.addAttribute("carList", carList);
        
        // 3. 1:1 문의 내역 조회
        List<InquiryDTO> inquiryList = inquiryService.selectByAccountId(accountId);
        model.addAttribute("inquiryList", inquiryList);

       // 페이징 처리
        int total = inquiryService.TotalInquiryUser(loginId, cri);
        model.addAttribute("pageMaker", new PagingDTO(total, cri));

        return "mypage/mypage_user";
    }
    
    /** 차량 등록 */
    @PostMapping("/addCar")
    public String addCar(HttpSession session, MypageDTO dto, RedirectAttributes rttr) {
        String accountId = (String) session.getAttribute("accountId");

        if (accountId == null) {
            rttr.addFlashAttribute("error_msg", "로그인이 필요합니다.");
            return "redirect:/login";
        }

        dto.setAccount_id(accountId);

        try {
            carService.insertCar(dto);
            rttr.addFlashAttribute("msg", "차량이 등록되었습니다.");
        } catch (Exception e) {
            rttr.addFlashAttribute("msg", "이미 등록된 차량번호이거나 오류가 발생했습니다.");
        }

        return "redirect:/mypage_user";
    }

    /** 차량 삭제 */
    @GetMapping("/deleteCar")
    public String deleteCar(@RequestParam("car_number") String carNumber,
                            HttpSession session,
                            RedirectAttributes rttr) {
        String accountId = (String) session.getAttribute("accountId");

        if (accountId == null) {
            rttr.addFlashAttribute("error_msg", "로그인이 필요합니다.");
            return "redirect:/login";
        }

        try {
            carService.deleteCar(carNumber);
            rttr.addFlashAttribute("msg", "차량이 삭제되었습니다.");
        } catch (Exception e) {
            rttr.addFlashAttribute("msg", "차량 삭제 중 오류가 발생했습니다.");
        }

        return "redirect:/mypage_user";
    }

    /** 회원정보 수정 */
    @GetMapping("/mypage_useredit")
    public String editProfile(HttpSession session, Model model) {
        String accountId = (String) session.getAttribute("accountId");
        if (accountId == null) return "redirect:/login";

        AccountDTO user = userService.getUserInfo(accountId);
        model.addAttribute("user", user);

        return "mypage/mypage_useredit";
    }

    /** 회원정보 수정 POST */
    @PostMapping("/update")
    public String updateProfile(AccountDTO dto, HttpSession session, RedirectAttributes rttr) {
        String accountId = (String) session.getAttribute("accountId");
        dto.setAccountId(accountId);

        int result = userService.updateUserInfo(dto);

        if (dto.getNewPassword() != null && !dto.getNewPassword().isEmpty()) {
            boolean pwChanged = userService.updatePassword(accountId, dto.getCurrentPassword(), dto.getNewPassword());
            if (!pwChanged) {
                rttr.addFlashAttribute("msg", "현재 비밀번호가 일치하지 않습니다.");
                return "redirect:/mypage_user";
            }
        }

        rttr.addFlashAttribute("msg", result > 0 ? "정보 수정 완료" : "수정 실패");
        return "redirect:/mypage_user";
    }
}
