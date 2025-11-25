import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// 수정 및 삭제 API 함수를 함께 가져옵니다.
import { getFaqDetail, deleteFaq } from '../../api/faqApi'; 
import './faq.css';

const FaqView = () => {
  const { faqNo } = useParams();
  const navigate = useNavigate();
  const [faq, setFaq] = useState(null);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const data = await getFaqDetail(faqNo);
        
        // 데이터가 유효한지 검사
        if (!data) {
          throw new Error("API에서 유효한 데이터를 받지 못했습니다.");
        }
        
        setFaq(data);
        
      } catch (err) {
        console.error("FAQ 상세 정보를 불러오는 중 오류 발생:", err);
        alert("글을 불러오지 못했거나 데이터가 없습니다.");
        navigate('/faq');
      }
    };
    
    // faqNo 값이 유효한지 확인 후 로드 시작
    if (faqNo) {
      loadDetail();
    } else {
      console.warn("FAQ 번호(faqNo)가 유효하지 않아 목록으로 돌아갑니다.");
      navigate('/faq');
    }
    
  }, [faqNo, navigate]);

  // 수정 버튼 클릭 핸들러
  const handleModify = () => {
    // FAQ 수정 페이지로 이동. 라우터 설정에 맞게 경로를 확인하세요.
    navigate(`/faq/modify/${faqNo}`);
  };

  // 삭제 버튼 클릭 핸들러
  const handleDelete = async () => {
    if (window.confirm("정말로 이 FAQ 글을 삭제하시겠습니까?")) {
      try {
        // API 호출: 삭제 함수는 faqNo(문자열)를 받습니다.
        await deleteFaq(faqNo); 
        alert("글이 성공적으로 삭제되었습니다.");
        navigate('/faq'); // 삭제 후 목록 페이지로 이동
      } catch (err) {
        console.error("FAQ 삭제 실패:", err);
        alert("글 삭제에 실패했습니다.");
      }
    }
  };

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
            <tr>
              <th>내용</th>
              {/* 내용에 줄 바꿈이 포함되어 있을 경우를 대비해 whiteSpace: 'pre-wrap'을 유지합니다. */}
              <td style={{ height: '200px', verticalAlign: 'top', textAlign: 'left', whiteSpace: 'pre-wrap' }}>
                {faq.faqContent}
              </td>
            </tr>
          </tr>
        </tbody>
      </table>
      
      <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
        <button onClick={handleModify} style={{ backgroundColor: '#28a745', color: 'white' }}>수정</button> 
        <button onClick={handleDelete} style={{ backgroundColor: '#dc3545', color: 'white' }}>삭제</button> 
        <button onClick={() => navigate('/faq')}>목록으로</button>
      </div>
    </div>
  );
};

export default FaqView;