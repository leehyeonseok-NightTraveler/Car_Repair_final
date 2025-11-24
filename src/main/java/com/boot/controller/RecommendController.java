package com.boot.controller;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.boot.dto.RecommendDTO;
import com.boot.service.RecommendService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class RecommendController {

    @Autowired
    private RecommendService recommendService;

    // ==============================
    // 가이드 페이지
    // ==============================
    @GetMapping("/gaide") public String gaide() { return "gaide"; }
    @GetMapping("/gaide-1") public String gaide1() { return "gaide-1"; }
    @GetMapping("/gaide-2") public String gaide2() { return "gaide-2"; }
    @GetMapping("/gaide-3") public String gaide3() { return "gaide-3"; }
    @GetMapping("/gaide-4") public String gaide4() { return "gaide-4"; }

    // ==============================
    // 지도 페이지
    // ==============================
    @GetMapping("/recommend")
    public String showRecommendPage() {
        return "recommend";
    }

    // ==============================
    // JSON API (지역 필터 + 동적 제한)
    // ==============================
    @GetMapping("/api/recommend")
    @ResponseBody
    public List<RecommendDTO> getRecommendData(
            @RequestParam(value = "region", required = false) String region) {

        List<RecommendDTO> list = recommendService.selectMapList();
        int maxCount = 0;
        String limitReason = "";

        // 지역 필터링
        if (region != null && !region.isEmpty()) {
            String r = region.trim();

            // 매핑 딕셔너리 (축약형 + 정식 명칭 + 자치도/자치시 포함)
            Map<String, List<String>> regionMap = Map.ofEntries(
                Map.entry("서울", List.of("서울", "서울특별시")),
                Map.entry("부산", List.of("부산", "부산광역시")),
                Map.entry("대구", List.of("대구", "대구광역시")),
                Map.entry("인천", List.of("인천", "인천광역시")),
                Map.entry("광주", List.of("광주", "광주광역시")),
                Map.entry("대전", List.of("대전", "대전광역시")),
                Map.entry("울산", List.of("울산", "울산광역시")),
                Map.entry("세종", List.of("세종", "세종특별자치시", "세종시")),
                Map.entry("경기", List.of("경기", "경기도")),
                Map.entry("강원", List.of("강원", "강원도", "강원특별자치도")),
                Map.entry("충북", List.of("충북", "충청북도")),
                Map.entry("충남", List.of("충남", "충청남도")),
                Map.entry("전북", List.of("전북", "전라북도", "전북특별자치도")),
                Map.entry("전남", List.of("전남", "전라남도")),
                Map.entry("경북", List.of("경북", "경상북도")),
                Map.entry("경남", List.of("경남", "경상남도")),
                Map.entry("제주", List.of("제주", "제주특별자치도", "제주도"))
            );

            List<String> variants = regionMap.getOrDefault(r, List.of(r));

            list.removeIf(dto -> {
                String addr = dto.getAddress();
                if (addr == null) return true;
                // variants 중 하나라도 포함되면 통과
                boolean match = variants.stream().anyMatch(addr::contains);
                return !match;
            });

            log.info("[RecommendController] 지역 필터 적용됨: {} / 결과 수: {}", region, list.size());

            // 데이터 과다 시 제한
            if (list.size() > 2000) {
                maxCount = 2000;
                list = list.subList(0, maxCount);
                limitReason = " (지역 데이터 과다로 2000개 제한)";
            }
        } else {
            // 전체 보기 시 제한 (1000개)
            if (list.size() > 1000) {
                maxCount = 1000;
                list = list.subList(0, maxCount);
                limitReason = " (전체 로딩 시 1000개 제한)";
            }
        }

        log.info("API 호출 완료: 총 {}개 반환{}", list.size(), limitReason);
        return list;
    }
}
