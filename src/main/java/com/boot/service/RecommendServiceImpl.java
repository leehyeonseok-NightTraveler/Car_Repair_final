package com.boot.service;

import com.boot.dao.RecommendDAO;
import com.boot.dto.RecommendDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Slf4j
@Service
public class RecommendServiceImpl implements RecommendService {

    @Autowired
    private RecommendDAO recommendDAO;

    // JSON 캐시 (1회 로드 후 재사용)
    private static List<RecommendDTO> cachedList = null;

    @Override
    public ArrayList<RecommendDTO> selectMapList() {
        if (cachedList != null && !cachedList.isEmpty()) {
            return new ArrayList<>(cachedList); // 캐시 재사용
        }

        List<RecommendDTO> list = new ArrayList<>();
        String jsonPath = "static/data/전국자동차정비업체표준데이터.json";

        try {
            ClassPathResource resource = new ClassPathResource(jsonPath);
            if (!resource.exists()) {
                log.error("[RecommendService] JSON 파일을 찾을 수 없음: {}", jsonPath);
                return new ArrayList<>();
            }

            InputStreamReader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8);
            ObjectMapper mapper = new ObjectMapper();
            mapper.enable(JsonParser.Feature.ALLOW_UNQUOTED_CONTROL_CHARS);
            mapper.enable(JsonParser.Feature.ALLOW_BACKSLASH_ESCAPING_ANY_CHARACTER);

            JsonNode root = mapper.readTree(reader);
            JsonNode records = root.path("records");

            // "records" 노드 자동 탐색
            if (!records.isArray()) {
                for (Iterator<String> it = root.fieldNames(); it.hasNext();) {
                    String key = it.next();
                    JsonNode candidate = root.path(key);
                    if (candidate.isArray()) {
                        records = candidate;
                        break;
                    }
                }
            }

            int count = 0;
            for (JsonNode node : records) {
                if (!"1".equals(node.path("영업상태").asText(""))) continue; // 영업 중인 업체만

                String name = node.path("자동차정비업체명").asText("").trim();
                String addr = node.path("소재지도로명주소").asText("").trim();
                if (addr.isEmpty()) addr = node.path("소재지지번주소").asText("").trim();
                String provider = node.path("제공기관명").asText("").trim();
                String phone = node.path("전화번호").asText("").trim();
                String latStr = node.path("위도").asText("").trim();
                String lngStr = node.path("경도").asText("").trim();

                if (name.isEmpty() || latStr.isEmpty() || lngStr.isEmpty()) continue;

                try {
                    double lat = Double.parseDouble(latStr);
                    double lng = Double.parseDouble(lngStr);

                    RecommendDTO dto = new RecommendDTO();
                    dto.setStoreId(name);
                    dto.setAddress(addr);
                    dto.setPhoneNumber(phone);
                    dto.setLatitude(lat);
                    dto.setLongitude(lng);
                    dto.setProvider(provider); // ✅ 추가된 필드

                    list.add(dto);
                    count++;
                } catch (NumberFormatException ignored) {}
            }

            log.info("[RecommendService] JSON 로드 완료: 총 {}개 업체 로드됨", count);
            cachedList = list; // 캐시 저장

        } catch (Exception e) {
            log.error("[RecommendService] JSON 파싱 실패: {}", e.getMessage(), e);
        }

        return new ArrayList<>(list);
    }

    @Override
    public int insertCoordinate(RecommendDTO dto) {
        return recommendDAO.insertCoordinate(dto);
    }

    @Override
    public int selectListCount(RecommendDTO dto) {
        return recommendDAO.selectListCount(dto);
    }

    @Override
    public int updateCoordinate(RecommendDTO dto) {
        return recommendDAO.updateCoordinate(dto);
    }
}
