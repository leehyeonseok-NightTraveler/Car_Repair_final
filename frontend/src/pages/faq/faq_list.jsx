// src/pages/faq/FaqList.jsx (혹은 faq_list.jsx)
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFaqList } from '../../api/faqApi'; // 경로 확인 필요
import './faq.css';

const FaqList = () => {
  // ⭐️ [수정 1] faqs를 반드시 빈 배열 []로 초기화합니다. (undefined 오류 방지)
  const [faqs, setFaqs] = useState([]);
  const [pageMaker, setPageMaker] = useState({
    prev: false,
    next: false,
    startPage: 1,
    endPage: 1,
    cri: { pageNum: 1 }
  }); 
  
  const navigate = useNavigate();

  // 처음 렌더링 될 때 1페이지 불러오기
  useEffect(() => {
    fetchData(1);
  }, []);

  // 데이터 가져오는 함수
  const fetchData = async (pageNum) => {
    try {
      // 백엔드에 pageNum을 보냄
      const data = await getFaqList(pageNum, 10);
      
      console.log("받은 데이터:", data); // 데이터 구조 확인용 로그
      
      // data.list나 data.pageMaker가 undefined일 경우를 대비해 OR 연산자로 기본값 지정
      setFaqs(data.list || []);       // 게시글 리스트 저장 (null/undefined이면 []로 설정)
      setPageMaker(data.pageMaker || { prev: false, next: false, startPage: 1, endPage: 1, cri: { pageNum: 1 } }); // 페이징 정보 저장
    } catch (err) {
      console.error("API 호출 오류:", err); // API 호출 실패 시 에러 로그
      alert("데이터를 불러오지 못했습니다.");
      setFaqs([]); // 에러 시 빈 배열로 설정하여 화면 깨짐 방지
    }
  };

  // 페이지 번호 버튼을 만드는 함수
  const renderPagination = () => {
    // pageMaker가 유효하지 않으면 null 반환
    if (!pageMaker || !pageMaker.cri) return null;

    const pageNumbers = [];
    for (let i = pageMaker.startPage; i <= pageMaker.endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        {/* 1. 이전 버튼 */}
        {pageMaker.prev && (
          <button onClick={() => fetchData(pageMaker.startPage - 1)}>
            &lt; 이전
          </button>
        )}

        {/* 2. 페이지 번호 반복 출력 */}
        {pageNumbers.map((num) => (
          <button
            key={num}
            className={pageMaker.cri.pageNum === num ? 'active' : ''}
            onClick={() => fetchData(num)}
          >
            {num}
          </button>
        ))}

        {/* 3. 다음 버튼 */}
        {pageMaker.next && (
          <button onClick={() => fetchData(pageMaker.endPage + 1)}>
            다음 &gt;
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="faq-container">
      <h2>FAQ 게시판</h2>
      
      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button onClick={() => navigate('/faq/write')}>글쓰기</button>
      </div>

      <table className="faq-table">
        <thead>
          <tr>
            <th style={{ width: '10%' }}>번호</th>
            <th style={{ width: '60%' }}>제목</th>
            <th style={{ width: '30%' }}>작성자/내용</th>
          </tr>
        </thead>
        <tbody>
          {/* ⭐️ [수정 2] faqs가 undefined이거나 빈 배열일 때 처리 (97행 오류 방지) */}
          {!faqs || faqs.length === 0 ? (
            <tr>
              <td colSpan="3">게시글이 없습니다.</td>
            </tr>
          ) : (
            faqs.map((faq) => (
              <tr key={faq.faqNo}>
                <td>{faq.faqNo}</td>
                <td style={{textAlign: 'left', paddingLeft: '20px'}}>
                  <Link to={`/faq/view/${faq.faqNo}`} style={{ textDecoration: 'none', color: 'black' }}>
                    {faq.faqTitle}
                  </Link>
                </td>
                {/* ⚠️ faqContent를 테이블에 그대로 보여주는 것은 보안상, UI상 좋지 않으니 작성자 등으로 변경을 고려해보세요. */}
                <td>{faq.faqContent}</td> 
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 페이징 버튼 렌더링 함수 호출 */}
      {renderPagination()}

    </div>
  );
};

export default FaqList;