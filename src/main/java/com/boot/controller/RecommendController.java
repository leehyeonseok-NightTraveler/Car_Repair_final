package com.boot.controller;

import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.boot.dto.RecommendDTO;
import com.boot.service.RecommendService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController // 화면(JSP) 대신 데이터(JSON) 반환
@RequestMapping("/api/recommend")
@CrossOrigin(origins = "http://localhost:3000") // React 포트 허용
public class RecommendController {

    @Autowired
    private RecommendService recommendService;

    @GetMapping
    public List<RecommendDTO> getRecommendData(@RequestParam(value = "region", required = false) String region) {
        
        // 1. DB에서 모든 데이터 가져오기
        List<RecommendDTO> list = recommendService.selectMapList();

        // 2. 지역 필터링 로직 (기존 로직 유지)
        if (region != null && !region.isEmpty()) {
            String r = region.trim();
            
            // 지역명 매핑 (축약어 -> 전체 명칭)
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

            // 주소에 해당 지역명이 포함되지 않으면 리스트에서 제거
            list.removeIf(dto -> {
                String addr = dto.getAddress();
                if (addr == null) return true;
                return variants.stream().noneMatch(addr::contains);
            });
        }

        // 3. 데이터 개수 제한 (기존 로직 유지)
        int maxCount = (region != null && !region.isEmpty()) ? 2000 : 1000;
        if (list.size() > maxCount) {
            list = list.subList(0, maxCount);
        }

        return list; // JSON 데이터 반환
    }
}