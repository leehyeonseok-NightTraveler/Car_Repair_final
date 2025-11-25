import axios from "axios";

// 1. 스프링 부트 서버 주소 (포트번호 8484 확인!)
const BASE_URL = "http://localhost:8484"; 

// 2. 목록 조회 (GET /faq?pageNum=...&amount=...)
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

// 3. 상세 내용 가져오기 (GET /faq/view/{faqNo})
export const getFaqDetail = async (faqNo) => {
  try {
    const response = await axios.get(`${BASE_URL}/faq/view/${faqNo}`);
    return response.data;
  } catch (error) {
    console.error("FAQ 상세 불러오기 실패:", error);
    throw error;
  }
};

// 4. 글쓰기 (CREATE: POST /faq)
export const writeFaq = async (faqData) => {
  try {
    const response = await axios.post(`${BASE_URL}/faq`, faqData);
    return response.data;
  } catch (error) {
    console.error("글쓰기 에러:", error);
    throw error;
  }
};

// 5. 글 수정하기 (UPDATE: PUT /faq/{faqNo})
// 💡 수정된 함수 시그니처: faqNo와 Body 데이터를 분리해서 받습니다.
export const modifyFaq = async (faqNo, faqData) => { 
  try {
    // PUT 메서드와 경로 변수, Body 데이터를 사용합니다.
    const response = await axios.put(`${BASE_URL}/faq/${faqNo}`, faqData);
    return response.data; 
  } catch (error) {
    console.error("글 수정 에러:", error);
    throw error;
  }
};

// 6. 글 삭제하기 (DELETE: DELETE /faq/{faqNo})
export const deleteFaq = async (faqNo) => {
  try {
    const response = await axios.delete(`${BASE_URL}/faq/${faqNo}`);
    return response.data; 
  } catch (error) {
    console.error("글 삭제 에러:", error);
    throw error;
  }
};