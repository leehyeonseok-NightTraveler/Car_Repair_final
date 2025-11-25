import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./notice.css";

function NoticeModify() {
    const { notice_no } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);

    // 쿼리스트링에서 페이징 정보 추출 (당신 스타일 그대로!)
    const searchParams = new URLSearchParams(location.search);
    const pageNum = parseInt(searchParams.get("pageNum") || "1", 10);
    const amount = parseInt(searchParams.get("amount") || "10", 10);

    // 수정할 공지사항 데이터 불러오기 (당신이 원하는 URL 그대로)
    useEffect(() => {
        const fetchNotice = async () => {
            try {
                const res = await axios.get(`http://localhost:8484/api/notice/modify/${notice_no}`, {
                    params: { pageNum, amount },
                    // withCredentials: true
                });

                const notice = res.data.notice;
                setTitle(notice.noticeTitle || "");
                setContent(notice.noticeContent || "");
                setDataLoading(false);
            } catch (err) {
                if (err.response?.status === 403) {
                    alert("관리자만 수정할 수 있습니다.");
                } else if (err.response?.status === 404) {
                    alert("존재하지 않는 공지사항입니다.");
                } else {
                    alert("공지사항을 불러오지 못했습니다.");
                }
                navigate("/notice_list", { replace: true });
            }
        };

        fetchNotice();
    }, [notice_no, pageNum, amount, navigate]);

    // 수정 처리 (당신이 원하는 URL 그대로!)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setMessage("제목을 입력해주세요.");
            document.getElementById("notice-title")?.focus();
            return;
        }
        if (!content.trim()) {
            setMessage("내용을 입력해주세요.");
            document.getElementById("notice-content")?.focus();
            return;
        }

        if (!window.confirm("공지사항을 수정하시겠습니까?")) return;

        setIsLoading(true);
        setMessage("");

        try {
            await axios.put(
                `http://localhost:8484/api/notice_modify/${notice_no}`,  // 당신이 원하는 URL!
                { noticeTitle: title, noticeContent: content },
                { withCredentials: true }
            );

            alert("공지사항이 성공적으로 수정되었습니다.");
            // 수정 후 → 당신이 원하는 상세보기 URL로 이동
            navigate(`/notice_view/${notice_no}?pageNum=${pageNum}&amount=${amount}`);
        } catch (err) {
            setMessage(err.response?.data?.message || "수정 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    // 취소 → 당신이 원하는 목록 URL
    const goToList = () => {
        navigate(`/notice_list?pageNum=${pageNum}&amount=${amount}`);
    };

    // 로딩 중
    if (dataLoading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>공지사항을 불러오는 중...</p>
            </div>
        );
    }

    return (
        <main id="notice-modify-container" className="notice-modify-container">
            <h1 className="notice-write-title">공지사항 수정</h1>

            <form onSubmit={handleSubmit} id="notice-modify-form" className="notice-modify-form">
                {/* 기존 JSP 테이블 구조 100% 그대로 재현 */}
                <table id="notice-write-table" className="notice-write-table">
                    <tbody>
                    <tr>
                        <th className="modify-label">제목</th>
                    </tr>
                    <tr>
                        <td className="modify-input">
                            <input
                                type="text"
                                name="notice_title"
                                className="input-title"
                                id="notice-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="제목을 입력하세요"
                                maxLength="100"
                                disabled={isLoading}
                                required
                            />
                        </td>
                    </tr>
                    <tr>
                        <th className="write-label">내용</th>
                    </tr>
                    <tr>
                        <td className="write-input">
                                <textarea
                                    name="notice_content"
                                    className="textarea-content"
                                    id="notice-content"
                                    rows="18"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="내용을 입력하세요"
                                    disabled={isLoading}
                                    required
                                />
                        </td>
                    </tr>
                    </tbody>
                </table>

                {/* JSP 그대로 hidden input */}
                <input type="hidden" name="notice_no" value={notice_no} />
                <input type="hidden" name="pageNum" value={pageNum} />
                <input type="hidden" name="amount" value={amount} />

                {/* 결과 메시지 */}
                {message && (
                    <div id="result-message" className={`result-message ${message.includes("성공") ? "success" : "error"}`}>
                        {message}
                    </div>
                )}

                {/* 버튼 그룹 (JSP 그대로) */}
                <div id="modify-button-group" className="modify-button-group">
                    <button
                        type="submit"
                        className="btn btn-submit"
                        id="btn-submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "수정 중..." : "수정"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-cancel"
                        id="btn-cancel"
                        onClick={goToList}
                        disabled={isLoading}
                    >
                        취소
                    </button>
                </div>
            </form>
        </main>
    );
}

export default NoticeModify;