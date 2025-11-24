	import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFaqList } from '../../api/faqApi'; // 경로 확인(../faq/FaqList.jsx라면 ../../api)
import './faq.css';

const FaqList = () => {
  const [faqs, setFaqs] = useState([]);
  const [pageMaker, setPageMaker] = useState({
    prev: false,
    next: false,
    startPage: 1,
    endPage: 1,
    cri: { pageNum: 1 }
  }); // 초기값 설정 (에러 방지)
  
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
      
      console.log("받은 데이터:", data); // 확인용 로그
      setFaqs(data.list);       // 게시글 리스트 저장
      setPageMaker(data.pageMaker); // 페이징 정보 저장
    } catch (err) {
      console.error(err);
      alert("데이터를 불러오지 못했습니다.");
    }
  };

  // 페이지 번호 버튼을 만드는 함수
  const renderPagination = () => {
    if (!pageMaker) return null;

    const pageNumbers = [];
    // startPage부터 endPage까지 숫자를 배열에 담음 (예: [1, 2, 3, 4, 5])
    for (let i = pageMaker.startPage; i <= pageMaker.endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination">
        {/* 1. 이전 버튼 (prev가 true일 때만 보임) */}
        {pageMaker.prev && (
          <button onClick={() => fetchData(pageMaker.startPage - 1)}>
            &lt; 이전
          </button>
        )}

        {/* 2. 페이지 번호 반복 출력 */}
        {pageNumbers.map((num) => (
          <button
            key={num}
            // 현재 페이지(cri.pageNum)와 같으면 'active' 클래스 추가 (파란색)
            className={pageMaker.cri && pageMaker.cri.pageNum === num ? 'active' : ''}
            onClick={() => fetchData(num)}
          >
            {num}
          </button>
        ))}

        {/* 3. 다음 버튼 (next가 true일 때만 보임) */}
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
          {/* 리스트가 비어있을 경우 처리 */}
          {faqs.length === 0 ? (
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
                <td>{faq.faqContent}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ★ 페이징 버튼 렌더링 함수 호출 */}
      {renderPagination()}

    </div>
  );
};

export default FaqList;