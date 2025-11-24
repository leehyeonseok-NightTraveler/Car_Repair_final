import axios from "axios";

const BASE_URL = "http://localhost:8484/faq"; 

// 1. 리스트 가져오기 (기존에 있던 것)
export const getFaqList = async (page = 1, amount = 10) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: { pageNum: page, amount: amount }
    });
    return response.data; 
  } catch (error) {
    console.error("FAQ 리스트 불러오기 실패:", error);
    throw error;
  }
};

// ★ 2. 상세 내용 가져오기 (이 부분이 없어서 에러가 난 겁니다!)
// 꼭 추가해주세요!
export const getFaqDetail = async (faqNo) => {
  try {
    // 백엔드 컨트롤러의 @GetMapping("/faq_view") 주소 호출
    const response = await axios.get("http://localhost:8484/faq_view", {
      params: { faq_no: faqNo }
    });
    return response.data;
  } catch (error) {
    console.error("FAQ 상세 불러오기 실패:", error);
    throw error;
  }
};