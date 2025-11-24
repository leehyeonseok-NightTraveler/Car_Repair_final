import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFaqDetail } from '../../api/faqApi';
import './FaqList.css';

const FaqView = () => {
  const { faqNo } = useParams();
  const navigate = useNavigate();
  const [faq, setFaq] = useState(null);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const data = await getFaqDetail(faqNo);
        setFaq(data);
      } catch (err) {
        alert("글을 불러오지 못했습니다.");
        navigate('/');
      }
    };
    loadDetail();
  }, [faqNo, navigate]);

  if (!faq) return <div>로딩중...</div>;

  return (
    <div className="faq-container">
      <h2>FAQ 상세 보기</h2>
      <table className="faq-table" style={{ marginTop: '20px' }}>
        <tbody>
          <tr>
            <th style={{ width: '20%' }}>번호</th>
            <td>{faq.faqNo}</td>
          </tr>
          <tr>
            <th>제목</th>
            <td>{faq.faqTitle}</td>
          </tr>
          <tr>
            <th>내용</th>
            <td style={{ height: '200px', verticalAlign: 'top', textAlign: 'left' }}>
              {faq.faqContent}
            </td>
          </tr>
        </tbody>
      </table>
      
      <div className="pagination">
        <button onClick={() => navigate('/')}>목록으로</button>
      </div>
    </div>
  );
};

export default FaqView;