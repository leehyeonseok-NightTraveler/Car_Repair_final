package com.boot.controller;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.boot.dto.FaQDTO;
import com.boot.dto.Criteria;
import com.boot.dto.PageDTO;
import com.boot.service.FaqService;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
public class FaqController {
	
	@Autowired
	private FaqService service;
	
	@RequestMapping("/faq")
	public String faq(Criteria cri, Model model) {
		log.info("@# faq()");
		log.info("@# cri=>"+cri);
		
		ArrayList<FaQDTO> list = service.listWithPaging(cri);
		int total = service.getTotalCount(cri);
		log.info("@# total=>"+total);
		
		model.addAttribute("list", list);
		model.addAttribute("pageMaker", new PageDTO(total, cri));
		
		return "faq";
	}
	@RequestMapping("/faq_view")
	public String faq_view(@RequestParam("faq_no") int faq_no, Model model) {
	    log.info("@# faq_view() with no: " + faq_no);
	    FaQDTO faqDto = service.contentView(faq_no);
	    
	    
	    model.addAttribute("faq", faqDto);
	    return "faq_view"; 
	}
	@RequestMapping("/faq_write")
    public String faq_write(@RequestParam HashMap<String, String> param) {
        log.info("faq_write()");
        
        return "faq_write";
    }
	
	@RequestMapping(value="/faq_write_action", method=RequestMethod.POST)
	public String faq_write_action(@RequestParam HashMap<String, String> param, RedirectAttributes rttr) {
	    log.info("@# faq_write_action - DB 저장 요청");
	    
	    // ... (기존 DB 처리 로직) ...
	    service.writeFaq(param); 
	    
	    return "redirect:faq";
	}
	
	@RequestMapping(value="/faq_write", method=RequestMethod.GET)
	public String faq_write_view() {
	    log.info("@# faq_write_view()");
	    return "faq_write"; // faq_write.jsp 반환
	}
	
   @RequestMapping("/faq_modify_action")
    public String faq_modify_action(@RequestParam HashMap<String, String> param, RedirectAttributes rttr) {
	   log.info("@# faq_modify_action()");
		
		service.modifyFaq(param);
		
		rttr.addAttribute("pageNum", param.get("pageNum"));
		rttr.addAttribute("amount", param.get("amount"));
		
		return "redirect:faq";
    }
   @RequestMapping("/faq_modify") 
   public String faq_modify_view(@RequestParam("faq_no") int faq_no, Model model) {
       log.info("@# faq_modify_view()" + faq_no);

       FaQDTO faqDto = service.contentView(faq_no); 

       model.addAttribute("faq", faqDto);

       return "faq_modify"; 
   }
   @RequestMapping(value="/faq_delete", method=RequestMethod.POST) 
   public String faq_delete(
           @RequestParam HashMap<String, String> param, 
           RedirectAttributes rttr) {
   	
   	log.info("@# faq_delete() with param: " + param);
   	
       String faqNoStr = param.get("faq_no");
       if (faqNoStr == null || faqNoStr.isEmpty()) {
           rttr.addAttribute("pageNum", param.get("pageNum"));
           rttr.addAttribute("amount", param.get("amount"));
           return "redirect:faq"; 
       }
       
   	service.deleteFaq(param);
   	
   	
   	return "redirect:faq";
   }
}









