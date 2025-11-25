import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./notice.css";

function NoticeList() {
    const [notices, setNotices] = useState([]);
    const [pageMaker, setPageMaker] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    // 세션에서 역할 가져오기
    // const userRole = sessionStorage.getItem("ROLE") || "";

    // URL 쿼리에서 현재 페이지 추출 (당신이 원하는 ?pageNum= 방식)
    const query = new URLSearchParams(location.search);
    const currentPage = parseInt(query.get("pageNum") || "1", 10);

    // 데이터 불러오기 (당신이 원하는 파라미터 이름 그대로!)
    const fetchNotices = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:8484/api/notice_list", {
                params: { pageNum: page, amount: 10 },
                // withCredentials: true
            });

            setNotices(res.data.list || []);
            setPageMaker(res.data.pageMaker);
        } catch (err) {
            console.error("공지사항 로드 실패:", err);
            alert("공지사항을 불러올 수 없습니다.");
            setNotices([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // 페이지 이동 (당신이 원하는 ?pageNum= 방식으로 URL 생성!)
    const goToPage = (page) => {
        if (page < 1) return;
        navigate(`?pageNum=${page}&amount=10`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // 처음 로드 + URL 변경 시 자동 리로드
    useEffect(() => {
        fetchNotices(currentPage);
    }, [currentPage, fetchNotices]);

    // 페이징 숫자 생성
    const pageNumbers = pageMaker
        ? Array.from(
            { length: pageMaker.endPage - pageMaker.startPage + 1 },
            (_, i) => pageMaker.startPage + i
        )
        : [];

    return (
        <main className="notice-list-container">
            {/* 제목 */}
            <section className="notice-header">
                <h1 className="notice-title">공지사항</h1>
            </section>

            {/* 로딩 */}
            {loading && (
                <div className="loading-message">
                    공지사항을 불러오는 중...
                </div>
            )}

            {/* 빈 데이터 */}
            {!loading && notices.length === 0 && (
                <div className="empty-message">
                    등록된 공지사항이 없습니다.
                </div>
            )}

            {/* 테이블 */}
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
                        {notices.map((notice) => (
                            <tr key={notice.notice_no} className="notice-row">
                                <td className="col-no">{notice.notice_no}</td>
                                <td className="col-title">
                                    {/* 당신이 원하는 상세보기 URL 그대로! */}
                                    <Link
                                        to={`/notice_view/${notice.notice_no}?pageNum=${currentPage}&amount=10`}
                                        className="notice-link"
                                    >
                                        {notice.notice_title}
                                    </Link>
                                </td>
                                <td className="col-writer">{notice.notice_writer || "관리자"}</td>
                                <td className="col-date">{notice.notice_created}</td>
                                <td className="col-views">{notice.notice_views || 0}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>
            )}

            {/* 페이징 */}
            {pageMaker && !loading && (
                <nav className="pagination-container" aria-label="공지사항 페이지 네비게이션">
                    <ul className="pagination-list">
                        {/* 이전 */}
                        {pageMaker.prev && (
                            <li className="pagination-item prev">
                                <button onClick={() => goToPage(pageMaker.startPage - 1)}>
                                    이전
                                </button>
                            </li>
                        )}

                        {/* 페이지 번호 */}
                        {pageNumbers.map((num) => (
                            <li
                                key={num}
                                className={`pagination-item ${currentPage === num ? "active" : ""}`}
                            >
                                <button onClick={() => goToPage(num)}>
                                    {num}
                                </button>
                            </li>
                        ))}

                        {/* 다음 */}
                        {pageMaker.next && (
                            <li className="pagination-item next">
                                <button onClick={() => goToPage(pageMaker.endPage + 1)}>
                                    다음
                                </button>
                            </li>
                        )}
                    </ul>
                </nav>
            )}

            {/*/!* 관리자 글쓰기 버튼 (당신이 원하는 URL 그대로!) *!/*/}
            {/*{userRole === "ADMIN" && (*/}
            {/*    <div className="notice-actions">*/}
            {/*        <Link to="/notice_write" className="btn-submit">*/}
            {/*            글쓰기*/}
            {/*        </Link>*/}
            {/*    </div>*/}
            {/*)}*/}
        </main>
    );
}

export default NoticeList;