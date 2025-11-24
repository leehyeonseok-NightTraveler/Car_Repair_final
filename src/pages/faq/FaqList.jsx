import React, { useEffect, useState } from 'react';
import { getFaqList } from '../../api/faqApi';
import './FaqList.css'; // ★ 방금 만든 CSS 파일 임포트!
import { Link } from 'react-router-dom';

const FaqList = () => {
  const [faqs, setFaqs] = useState([]);
  const [pageMaker, setPageMaker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData(1);
  }, []);

  const fetchData = async (pageNum) => {
    try {
      // 아까 수정한대로 파라미터 전달
      const data = await getFaqList(pageNum, 10);
      setFaqs(data.list);
      setPageMaker(data.pageMaker);
      setLoading(false);
    } catch (err) {
      alert("데이터를 불러오지 못했습니다.");
      setLoading(false);
    }
  };

  if (loading) return <div>로딩중...</div>;

  return (
    <div className="faq-container">
      <h2>FAQ 게시판</h2>
      
      {/* 테이블 형태로 변경 */}
      <table className="faq-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자/내용</th> {/* 필요에 따라 컬럼 조정 */}
          </tr>
        </thead>
      <tbody>
            {faqs.map((faq) => (
                <tr key={faq.faqNo}>
                <td>{faq.faqNo}</td>
                <td style={{textAlign: 'left', paddingLeft: '20px'}}>
                    {/* ★ 제목을 Link로 감싸서 클릭하면 이동하게 변경 */}
                    <Link to={`/faq/view/${faq.faqNo}`} style={{ textDecoration: 'none', color: 'black', fontWeight: 'bold' }}>
                        {faq.faqTitle}
                    </Link>
                </td>
                <td>{faq.faqContent}</td>
                </tr>
            ))}
        </tbody>
      </table>

      {/* 페이징 버튼 */}
      <div className="pagination">
        {pageMaker && pageMaker.prev && (
          <button onClick={() => fetchData(pageMaker.startPage - 1)}>이전</button>
        )}
        
        {/* 페이지 번호 반복문은 복잡하니 일단 이전/다음만 구현 */}
        
        {pageMaker && pageMaker.next && (
          <button onClick={() => fetchData(pageMaker.endPage + 1)}>다음</button>
        )}
      </div>
    </div>
  );
};

export default FaqList;