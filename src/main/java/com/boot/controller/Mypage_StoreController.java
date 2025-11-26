package com.boot.controller;

import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import com.boot.dto.StoreDTO;
import com.boot.service.Mypage_StoreService;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequestMapping("/mypage_store")
@Slf4j
public class Mypage_StoreController {

    @Autowired
    private Mypage_StoreService service;

    @GetMapping
    public String viewStoreMypage(HttpSession session, Model model) {
        String storeId = (String) session.getAttribute("storeId");
        if (storeId == null) return "redirect:/storelogin";
        model.addAttribute("store", service.getStoreInfo(storeId));
        return "mypage/mypage_store";
    }

    @GetMapping("/mypage_storeedit")
    public String editStorePage(HttpSession session, Model model) {
        String storeId = (String) session.getAttribute("storeId");
        if (storeId == null) return "redirect:/storelogin";
        model.addAttribute("store", service.getStoreInfo(storeId));
        return "mypage/mypage_storeedit";
    }

    @PostMapping("/update")
    public String updateStoreInfo(StoreDTO dto, HttpSession session,
                                  String currentPw, String newPw, String confirmPw,
                                  RedirectAttributes rttr) {
        String storeId = (String) session.getAttribute("storeId");
        dto.setStoreId(storeId);

        // 기본 정보 업데이트
        int infoResult = service.updateStoreInfo(dto);

        // 비밀번호 변경 처리
        boolean pwUpdated = false;
        if (newPw != null && !newPw.isBlank()) {
            if (!newPw.equals(confirmPw)) {
                rttr.addFlashAttribute("msg", "비밀번호가 일치하지 않습니다.");
                return "redirect:/mypage_store/store_edit";
            }
            pwUpdated = service.updatePassword(storeId, currentPw, newPw);
        }

        if (infoResult > 0 && pwUpdated) {
            rttr.addFlashAttribute("msg", "정보 및 비밀번호가 모두 수정되었습니다.");
        } else if (infoResult > 0) {
            rttr.addFlashAttribute("msg", "정보가 수정되었습니다.");
        } else {
            rttr.addFlashAttribute("msg", "수정 실패");
        }
        return "redirect:/mypage_store";
    }
}
