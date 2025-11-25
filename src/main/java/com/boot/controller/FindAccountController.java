package com.boot.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.UUID;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.boot.dto.FindAccountDTO;
import com.boot.service.FindAccountService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@Slf4j
public class FindAccountController {

    @Autowired
    private FindAccountService service;

    @Autowired
    private JavaMailSender mailSender;


    @PostMapping("findAccount")
    public HashMap<String, Object> findAccount(@RequestBody HashMap<String, String> param) {

        HashMap<String, Object> result = new HashMap<>();

        String email = param.get("email");
        String phone = param.get("phone");

        ArrayList<FindAccountDTO> dtos = service.findAccount(param);

        if (dtos != null && !dtos.isEmpty()) {
            FindAccountDTO dbDto = dtos.get(0);

            if (phone.equals(dbDto.getPhoneNumber()) && email.equals(dbDto.getEmail())) {

                try {
                    // HTML 이메일 발송
                    MimeMessage message = mailSender.createMimeMessage();
                    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                    helper.setFrom("carrepair3team@gmail.com");
                    helper.setTo(email);
                    helper.setSubject("[MY CAR 정비소] 아이디 안내");

                    String htmlContent =
	                        """
	                        <html>
	                        <body style="font-family: '맑은 고딕', sans-serif; background-color:#f5f5f5; padding:20px;">
	                          <div style="max-width:600px; margin:auto; background-color:#fff; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.1); padding:30px;">
	                            <h2 style="color:#0078d4;">MY CAR 정비소</h2>
	                            <p>안녕하세요, <strong>MY CAR 정비소</strong>입니다.</p>
	                            <p>회원님의 아이디 정보는 아래와 같습니다.</p>
	                            <hr style="border:none; border-top:1px solid #ddd; margin:20px 0;">
	                            <p style="font-size:18px;">🔑 <strong>아이디:</strong> <span style="color:#0078d4;">%s</span></p>
	                            <hr style="border:none; border-top:1px solid #ddd; margin:20px 0;">
	                            <p style="font-size:14px; color:#555;">본 메일은 MY CAR 정비소 아이디 찾기 요청으로 자동 발송되었습니다.</p>
	                            <p style="font-size:14px; color:#999;">© 2025 MY CAR 정비소. All rights reserved.</p>
	                          </div>
	                        </body>
	                        </html>
	                        """.formatted(dbDto.getAccountId());

                    helper.setText(htmlContent, true);
                    mailSender.send(message);

                    result.put("success", true);
                    result.put("message", "이메일 발송 완료");
                    return result;

                } catch (MessagingException e) {
                    result.put("success", false);
                    result.put("message", "메일 전송 실패");
                    return result;
                }
            }
        }

        result.put("success", false);
        result.put("message", "입력 정보가 일치하지 않음");
        return result;
    }



    // 🔐 비밀번호 찾기 API
    @PostMapping("/findPw")
    public HashMap<String, Object> findPw(@RequestBody HashMap<String, String> param) {

        HashMap<String, Object> result = new HashMap<>();

        String email = param.get("email");
        String phone = param.get("phone");
        String accountId = param.get("accountId");

        ArrayList<FindAccountDTO> dtos = service.findPW(param);

        if (dtos != null && !dtos.isEmpty()) {

            FindAccountDTO dbDto = dtos.get(0);

            if (phone.equals(dbDto.getPhoneNumber()) && email.equals(dbDto.getEmail())
                    && accountId.equals(dbDto.getAccountId())) {

                try {
                    // 임시 비밀번호 생성
                    String tempPw = UUID.randomUUID().toString().substring(0, 10);
                    service.newPW(accountId, tempPw, dbDto.getRole());

                    MimeMessage message = mailSender.createMimeMessage();
                    MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                    helper.setFrom("carrepair3team@gmail.com");
                    helper.setTo(email);
                    helper.setSubject("[MY CAR 정비소] 임시 비밀번호 발급");

                    String htmlContent = """
						    <html>
						    <body style="font-family: Arial, sans-serif; background-color:#f9f9f9; padding:20px;">
						        <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; padding:30px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
						            <h2 style="color:#2C3E50; text-align:center;">🔐 임시 비밀번호 발급 안내</h2>
						            <p style="font-size:16px; color:#333;">
						                안녕하세요, <b>%s</b> 님.
						            </p>
						            <p style="font-size:16px; color:#333;">
						                요청하신 임시 비밀번호를 아래와 같이 발급해드렸습니다.<br>
						                로그인 후 반드시 비밀번호를 변경해주세요.
						            </p>
						            <div style="margin:20px 0; text-align:center;">
						                <div style="display:inline-block; background-color:#3498db; color:#fff; font-size:18px; padding:12px 24px; border-radius:8px;">
						                    임시 비밀번호: <b>%s</b>
						                </div>
						            </div>
						            <p style="color:#888; font-size:14px; text-align:center;">
						                ※ 본 메일은 발신 전용입니다. 문의사항은 홈페이지를 통해 접수해주세요.
						            </p>
						        </div>
						    </body>
						    </html>
						    """.formatted(dbDto.getAccountId(), tempPw);

                    helper.setText(htmlContent, true);
                    mailSender.send(message);

                    result.put("success", true);
                    result.put("message", "임시 비밀번호 발송 완료");
                    return result;

                } catch (MessagingException e) {
                    result.put("success", false);
                    result.put("message", "메일 전송 실패");
                    return result;
                }
            }
        }

        result.put("success", false);
        result.put("message", "입력 정보가 일치하지 않음");
        return result;
    }


}
