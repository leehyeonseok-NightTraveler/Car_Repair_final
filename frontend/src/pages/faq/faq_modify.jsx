import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFaqDetail, modifyFaq } from '../../api/faqApi'; // 경로 확인 (../../api/faqApi)
import './faq.css'; // 스타일 재사용

const FaqModify = () => {
  const { faqNo } = useParams(); // URL에서 글번호 가져오기
  const navigate = useNavigate();

  const [faqTitle, setFaqTitle] = useState('');
  const [faqContent, setFaqContent] = useState('');

  // 1. 기존 글 내용 불러오기
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getFaqDetail(faqNo);
        setFaqTitle(data.faqTitle);
        setFaqContent(data.faqContent);
      } catch (err) {
        alert("데이터를 불러오지 못했습니다.");
        navigate('/faq');
      }
    };
    loadData();
  }, [faqNo, navigate]);

  // 2. 수정 완료 버튼 클릭
  const handleModify = async (e) => {
    e.preventDefault();

    try {
      const faqData = {
        faq_no: faqNo,
        faq_title: faqTitle,
        faq_content: faqContent
      };

      await modifyFaq(faqData);
      
      alert("글이 수정되었습니다.");
      navigate(`/faq/view/${faqNo}`); // 상세 페이지로 이동
    } catch (err) {
      console.error(err);
      alert("수정에 실패했습니다.");
    }
  };

  return (
    <div className="faq-container">
      <h2 style={{ textAlign: 'center', margin: '30px 0' }}>FAQ 수정하기</h2>
      <form onSubmit={handleModify} style={{ maxWidth: '800px', margin: '0 auto' }}>
        <table className="faq-table">
          <tbody>
            <tr>
              <th style={{ width: '20%' }}>제목</th>
              <td>
                <input 
                  type="text" 
                  value={faqTitle}
                  onChange={(e) => setFaqTitle(e.target.value)}
                  style={{ width: '95%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </td>
            </tr>
            <tr>
              <th>내용</th>
              <td>
                <textarea 
                  value={faqContent}
                  onChange={(e) => setFaqContent(e.target.value)}
                  style={{ width: '95%', height: '300px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ textAlign: 'center', marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>수정완료</button>
          <button type="button" onClick={() => navigate('/faq')} style={{ padding: '10px 20px', backgroundColor: '#aaa', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>취소</button>
        </div>
      </form>
    </div>
  );
};

export default FaqModify;