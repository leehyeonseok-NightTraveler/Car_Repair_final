import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./notice.css";

function NoticeView() {
    const { notice_no } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [notice, setNotice] = useState(null);
    const [pageMaker, setPageMaker] = useState(null);
    const [role, setRole] = useState(""); // "ADMIN" or ""
    const [loading, setLoading] = useState(true);

    // 쿼리스트링에서 페이징 정보 추출 (당신이 원하는 ?pageNum= 방식!)
    const searchParams = new URLSearchParams(location.search);
    const pageNum = parseInt(searchParams.get("pageNum") || "1", 10);
    const amount = parseInt(searchParams.get("amount") || "10", 10);

    // 공지사항 불러오기 (당신이 원하는 URL 그대로!)
    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const res = await axios.get(`http://localhost:8484/api/notice_view/${notice_no}`, {
                    params: { pageNum, amount },
                    // withCredentials: true
                });

                setNotice(res.data.view);
                setPageMaker(res.data.pageMaker);
                setRole(res.data.role || "USER");
            } catch (err) {
                console.error("공지사항 로드 실패:", err);
                if (err.response?.status === 404) {
                    alert("삭제되었거나 존재하지 않는 공지사항입니다.");
                } else {
                    alert("공지사항을 불러올 수 없습니다.");
                }
                // 당신이 원하는 목록 URL로 이동!
                navigate("/notice_list", { replace: true });
            } finally {
                setLoading(false);
            }
        };

        fetchNotice();
    }, [notice_no, pageNum, amount, navigate]);

    // 목록으로 돌아가기 (당신이 원하는 방식!)
    const goToList = () => {
        const currentPage = pageMaker?.cri?.pageNum || pageNum;
        const currentAmount = pageMaker?.cri?.amount || amount;
        navigate(`/notice_list?pageNum=${currentPage}&amount=${currentAmount}`);
    };

    // 수정 페이지로 이동 (당신이 원하는 URL!)
    const goToModify = () => {
        navigate(`/notice_modify/${notice_no}?pageNum=${pageNum}&amount=${amount}`);
    };

    // 삭제 처리 (당신이 원하는 DELETE URL!)
    const deleteNotice = async () => {
        if (!window.confirm("정말로 이 공지사항을 삭제하시겠습니까?")) return;

        try {
            await axios.delete(`http://localhost:8484/api/notice_view/${notice_no}`, {
                withCredentials: true
            });

            alert("공지사항이 삭제되었습니다.");
            goToList();
        } catch (err) {
            const msg = err.response?.data?.message || "삭제 중 오류가 발생했습니다.";
            alert(msg);
        }
    };

    // 로딩 중
    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>공지사항을 불러오는 중...</p>
            </div>
        );
    }

    // 공지사항 없음
    if (!notice) {
        return (
            <div className="empty-container">
                <p>공지사항을 찾을 수 없습니다.</p>
                <button onClick={goToList} className="btn btn-list">목록으로</button>
            </div>
        );
    }

    return (
        <main id="notice-view-container" className="notice-view-container">
            {/* 제목 */}
            <section className="notice-header">
                <h2 className="notice-title">{notice.notice_title || "제목 없음"}</h2>
                <div className="notice-info">
                    <span className="notice-writer">작성자: {notice.notice_writer || "관리자"}</span>
                    <span className="notice-date">{notice.notice_created}</span>
                    <span className="notice-views">조회수: {notice.notice_views || 0}</span>
                </div>
                <hr className="notice-divider" />
            </section>

            {/* 본문 */}
            <article className="notice-body">
                <div
                    className="notice-content"
                    dangerouslySetInnerHTML={{ __html: notice.notice_content }}
                />
            </article>

            <hr className="notice-divider" />

            {/*/!* 버튼 그룹 *!/*/}
            {/*<section className="notice-button-group">*/}
            {/*    <div className="button-group">*/}
            {/*        /!* 관리자만 수정/삭제 버튼 보임 *!/*/}
            {/*        {role === "ADMIN" && (*/}
            {/*            <>*/}
            {/*                <button onClick={goToModify} className="btn btn-modify">*/}
            {/*                    수정*/}
            {/*                </button>*/}
            {/*                <button onClick={deleteNotice} className="btn btn-delete">*/}
            {/*                    삭제*/}
            {/*                </button>*/}
            {/*            </>*/}
            {/*        )}*/}
            {/*        <button onClick={goToList} className="btn btn-list">*/}
            {/*            목록*/}
            {/*        </button>*/}
            {/*    </div>*/}
            {/*</section>*/}
        </main>
    );
}

export default NoticeView;