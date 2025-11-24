import axios from "axios";

// 1. 스프링 부트 서버 주소 (포트번호 8484 확인!)
const BASE_URL = "http://localhost:8484"; 

// 2. 목록 조회 (GET)
export const getFaqList = async (page = 1, amount = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/faq`, {
      params: { pageNum: page, amount: amount }
    });
    return response.data; 
  } catch (error) {
    console.error("FAQ 리스트 불러오기 실패:", error);
    throw error;
  }
};

// 3. 상세 내용 가져오기 (GET)
export const getFaqDetail = async (faqNo) => {
  try {
    const response = await axios.get(`${BASE_URL}/faq_view`, {
      params: { faq_no: faqNo }
    });
    return response.data;
  } catch (error) {
    console.error("FAQ 상세 불러오기 실패:", error);
    throw error;
  }
};

// 4. 글쓰기 (POST)
export const writeFaq = async (faqData) => {
  try {
    // Controller의 @PostMapping("/faq_write_action") 호출
    const response = await axios.post(`${BASE_URL}/faq_write_action`, faqData);
    return response.data;
  } catch (error) {
    console.error("글쓰기 에러:", error);
    throw error;
  }
};

// 5. 글 수정하기 (POST)
export const modifyFaq = async (faqData) => {
  try {
    // Controller의 @PostMapping("/faq_modify_action") 호출
    const response = await axios.post(`${BASE_URL}/faq_modify_action`, faqData);
    return response.data;
  } catch (error) {
    console.error("글 수정 에러:", error);
    throw error;
  }
};

// 6. 글 삭제하기 (POST)
export const deleteFaq = async (faqNo) => {
  try {
    // Controller의 @PostMapping("/faq_delete") 호출
    // 삭제할 번호를 JSON 형태로 보냄 { "faq_no": 123 }
    const response = await axios.post(`${BASE_URL}/faq_delete`, { faq_no: faqNo });
    return response.data;
  } catch (error) {
    console.error("글 삭제 에러:", error);
    throw error;
  }
};