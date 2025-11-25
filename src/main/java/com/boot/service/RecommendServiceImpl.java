package com.boot.service;

import com.boot.dao.RecommendDAO;
import com.boot.dto.RecommendDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

@Service
public class RecommendServiceImpl implements RecommendService {

    private static final Logger log = LoggerFactory.getLogger(RecommendServiceImpl.class);

    @Autowired
    private RecommendDAO recommendDAO;

    private static final String API_URL = "http://api.data.go.kr/openapi/tn_pubr_public_auto_maintenance_company_api";
    // 선생님이 주신 키 그대로 사용
    private static final String SERVICE_KEY = "70b7922fdc9383cc00f4e2eff94586827d6da02aa4f7a995758fdcbac1917018";

    private static List<RecommendDTO> cachedList = null;

    @Override
    public ArrayList<RecommendDTO> selectMapList() {
        // 디버깅을 위해 캐시 기능 잠시 끔 (계속 요청 보내보게)
        // if (cachedList != null && !cachedList.isEmpty()) { return new ArrayList<>(cachedList); }

        List<RecommendDTO> list = new ArrayList<>();

        try {
            String urlStr = String.format("%s?serviceKey=%s&pageNo=1&numOfRows=1000&type=json", API_URL, SERVICE_KEY);
            URI uri = new URI(urlStr);

            RestTemplate restTemplate = new RestTemplate();
            String response = restTemplate.getForObject(uri, String.class);

            // 🚨 [중요] 공공데이터가 뭐라고 대답했는지 콘솔에 찍어봅니다!
            log.info("=============================================");
            log.info("📢 [공공데이터 API 응답 원본]: \n{}", response);
            log.info("=============================================");

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            // 만약 에러 메시지가 왔다면 여기서 걸러냄
            if (root.has("response") && root.path("response").has("header")) {
                String resultCode = root.path("response").path("header").path("resultCode").asText();
                if (!"00".equals(resultCode)) {
                    log.error("🚨 API 호출 실패! 결과 코드: {}", resultCode);
                    return new ArrayList<>();
                }
            }

            JsonNode items = root.path("response").path("body").path("items");

            if (items.isArray()) {
                for (JsonNode node : items) {
                    String latStr = node.path("latitude").asText().trim();
                    String lngStr = node.path("longitude").asText().trim();

                    if (latStr.isEmpty() || lngStr.isEmpty()) continue;

                    try {
                        RecommendDTO dto = new RecommendDTO();
                        // 필드명 매핑 (API 변수명 -> DTO 변수명)
                        dto.setStoreId(node.path("inspofcNm").asText());       
                        
                        String addr = node.path("rdnmadr").asText();
                        if (addr == null || addr.isEmpty()) addr = node.path("lnmadr").asText();
                        dto.setAddress(addr);

                        String phone = node.path("institutionPhoneNumber").asText();
                        if(phone.isEmpty()) phone = node.path("phoneNumber").asText();
                        dto.setPhoneNumber(phone);
                        
                        dto.setLatitude(Double.parseDouble(latStr));
                        dto.setLongitude(Double.parseDouble(lngStr));
                        dto.setProvider("공공데이터포털");

                        list.add(dto);
                    } catch (Exception e) { continue; }
                }
            }
            cachedList = list; 

        } catch (Exception e) {
            log.error("❌ 데이터 처리 중 에러 발생: {}", e.getMessage());
            // e.printStackTrace(); // 에러 로그가 너무 길면 주석 처리
        }

        return new ArrayList<>(list);
    }

    @Override public int insertCoordinate(RecommendDTO dto) { return recommendDAO.insertCoordinate(dto); }
    @Override public int selectListCount(RecommendDTO dto) { return recommendDAO.selectListCount(dto); }
    @Override public int updateCoordinate(RecommendDTO dto) { return recommendDAO.updateCoordinate(dto); }
}