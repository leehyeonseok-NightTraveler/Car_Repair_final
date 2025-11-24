import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../../components/common/Header.jsx";
import Footer from "../../components/common/Footer.jsx";      // ← 이게 진짜 헤더 컴포넌트!
import "../../components/common/mainpage.css";
import "./notice.css";

function NoticeList() {
    const [notices, setNotices] = useState([]);
    const [pageMaker, setPageMaker] = useState(null);
    const [loading, setLoading] = useState(true);

    // 로그인한 사용자 role 가져오기 (세션 스토리지 or context에서)
    const userRole = sessionStorage.getItem("ROLE") || "";

    const fetchNotices = (page = 1) => {
        setLoading(true);
        axios.get(`http://localhost:8484/api/notice_list?page=${page}`)
            .then(response => {
                setNotices(response.data.list);
                setPageMaker(response.data.pageMaker);
                setLoading(false);
            })
            .catch(error => {
                console.error("데이터 불러오기 실패:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const handlePageClick = (pageNum) => {
        fetchNotices(pageNum);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            {/* 여기서 헤더가 보입니다! */}
            <Header />

            {/* 실제 컨텐츠 영역 */}
            <main className="notice-list-container">
                {/* 제목 */}
                <section className="notice-header">
                    <h1 className="notice-title">공지사항</h1>
                    <hr className="notice-divider" />
                </section>

                {/* 로딩 중 표시 */}
                {loading && (
                    <div style={{ textAlign: "center", padding: "50px" }}>
                        <p>공지사항을 불러오는 중...</p>
                    </div>
                )}

                {/* 테이블 */}
                {!loading && notices.length === 0 && (
                    <div style={{ textAlign: "center", padding: "50px", color: "#777" }}>
                        등록된 공지사항이 없습니다.
                    </div>
                )}

                {!loading && notices.length > 0 && (
                    <section className="notice-table-wrapper">
                        <table className="notice-table">
                            <thead>
                            <tr>
                                <th className="col-no">번호</th>
                                <th className="col-title">제목</th>
                                <th className="col-writer">작성자</th>
                                <th className="col-date">작성일</th>
                                <th className="col-views">조회수</th>
                            </tr>
                            </thead>
                            <tbody>
                            {notices.map(notice => (
                                <tr key={notice.notice_no} className="notice-row">
                                    <td className="notice-no">{notice.notice_no}</td>
                                    <td className="notice-title-cell">
                                        <Link
                                            to={`/notice/${notice.notice_no}`}
                                            className="notice-link"
                                        >
                                            {notice.notice_title}
                                        </Link>
                                    </td>
                                    <td className="notice-writer">{notice.notice_writer}</td>
                                    <td className="notice-date">{notice.notice_created}</td>
                                    <td className="notice-views">{notice.notice_views}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </section>
                )}

                {/* 페이징 */}
                {pageMaker && !loading && (
                    <nav className="pagination-container">
                        <ul className="pagination-list">
                            {pageMaker.prev && (
                                <li className="pagination-item prev">
                                    <button
                                        className="pagination-link"
                                        onClick={() => handlePageClick(pageMaker.startPage - 1)}
                                    >
                                        이전
                                    </button>
                                </li>
                            )}

                            {Array.from(
                                { length: pageMaker.endPage - pageMaker.startPage + 1 },
                                (_, i) => {
                                    const num = pageMaker.startPage + i;
                                    return (
                                        <li
                                            key={num}
                                            className={`pagination-item ${
                                                pageMaker.cri.pageNum === num ? "active" : ""
                                            }`}
                                        >
                                            <button
                                                className="pagination-link"
                                                onClick={() => handlePageClick(num)}
                                            >
                                                {num}
                                            </button>
                                        </li>
                                    );
                                }
                            )}

                            {pageMaker.next && (
                                <li className="pagination-item next">
                                    <button
                                        className="pagination-link"
                                        onClick={() => handlePageClick(pageMaker.endPage + 1)}
                                    >
                                        다음
                                    </button>
                                </li>
                            )}
                        </ul>
                    </nav>
                )}

                {/* 관리자 전용 글쓰기 버튼 */}
                {userRole === "ADMIN" && (
                    <div className="notice-actions">
                        <Link to="/notice/write">
                            <button className="btn btn-submit">글쓰기</button>
                        </Link>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}

export default NoticeList;