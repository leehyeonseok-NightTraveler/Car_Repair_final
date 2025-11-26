import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFaqList } from '../../api/faqApi';
import './faq.css';

const isAdmin = () => {
    return sessionStorage.getItem("ROLE") === 'ADMIN'; 
}

const FaqList = () => {
    const [faqs, setFaqs] = useState([]);
    const [pageMaker, setPageMaker] = useState({
        prev: false,
        next: false,
        startPage: 1,
        endPage: 1,
        cri: { pageNum: 1 }
    });
    
    const navigate = useNavigate();

    useEffect(() => {
        fetchData(1);
    }, []);

    const fetchData = async (pageNum) => {
        try {
            const data = await getFaqList(pageNum, 10);
            setFaqs(data.list || []);
            setPageMaker(data.pageMaker || { prev: false, next: false, startPage: 1, endPage: 1, cri: { pageNum: 1 } });
        } catch (err) {
            console.error("API 호출 오류:", err);
            alert("데이터를 불러오지 못했습니다.");
            setFaqs([]);
        }
    };

    const handleWriteClick = () => {
        if (isAdmin()) {
            navigate('/faq/write');
        } else {
            alert("FAQ 등록은 관리자만 가능합니다.");
        }
    };

    const renderPagination = () => {
        if (!pageMaker || !pageMaker.cri) return null;

        const pageNumbers = [];
        for (let i = pageMaker.startPage; i <= pageMaker.endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="pagination">
                {pageMaker.prev && (
                    <button onClick={() => fetchData(pageMaker.startPage - 1)}>
                        &lt; 이전
                    </button>
                )}

                {pageNumbers.map((num) => (
                    <button
                        key={num}
                        className={pageMaker.cri.pageNum === num ? 'active' : ''}
                        onClick={() => fetchData(num)}
                    >
                        {num}
                    </button>
                ))}

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
                {isAdmin() && ( 
                    <button onClick={handleWriteClick} className="write-button">
                        글쓰기
                    </button>
                )}
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
                    {!faqs || faqs.length === 0 ? (
                        <tr>
                            <td colSpan="3">게시글이 없습니다.</td>
                        </tr>
                    ) : (
                        faqs.map((faq) => (
                            <tr key={faq.faqNo}>
                                <td>{faq.faqNo}</td>
                                <td style={{ textAlign: 'left', paddingLeft: '20px' }}>
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

            {renderPagination()}

        </div>
    );
};

export default FaqList;