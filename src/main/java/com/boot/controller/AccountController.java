package com.boot.controller;

import com.boot.dto.AccountDTO;
import com.boot.service.AccountService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@Slf4j
public class AccountController {

    
    @GetMapping("/main")
    public String showMainPage() {
        // ViewResolver가 /WEB-INF/views/main.jsp로 매핑함
        return "main";
    }
    
    
//-------------------회원가입 컨트롤러-----------------------

    @Autowired
    private AccountService accountService;

    /**
    * 회원가입 페이지(JSP)를 여는 메소드
    */
    @GetMapping("/register")
    public String registerForm() {
    log.info("@# GET /register (회원가입 페이지 열기)");
    return "register"; // /WEB-INF/views/register.jsp
    }

    /**
    * 회원가입 폼 데이터를 받아서 처리하는 메소드
    */
    @PostMapping("/registerProc")
    public String registerProc(AccountDTO accountDTO, RedirectAttributes rttr) {
    log.info("@# POST /registerProc (회원가입 처리)");
            
            try {
                accountService.register(accountDTO);
                
            } catch (Exception e) {
                // [중요] DB의 UNIQUE 제약조건 위배 시 (중복 아이디, 이메일, 폰)
                log.error("!!! 회원가입 실패: " + e.getMessage());
                rttr.addFlashAttribute("error_msg", "가입 실패 (아이디/이메일/휴대폰 번호 중복)");
                return "redirect:/register"; // 실패 시 다시 회원가입 폼으로
            }

            // 회원가입 성공 시
            rttr.addFlashAttribute("success_msg", "회원가입 성공!");
            return "redirect:/login"; // (로그인 페이지 경로로 리다이렉트)
        }
        
        // (로그인 페이지가 없다면 임시로 /login 경로 추가)
        @GetMapping("/login")
        public String loginPage() {
            return "login"; // /WEB-INF/views/login.jsp
        }
    }
