import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./notice.css";

function NoticeWrite() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    const navigate = useNavigate();

    // 1. 페이지 진입 시 권한 체크 (당신이 원하는 URL 그대로!)
    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axios.get("http://localhost:8484/api/notice_write/auth", {
                    withCredentials: true
                });
                setAuthChecked(true);
            } catch (err) {
                const msg = err.response?.data?.message || "관리자만 작성할 수 있습니다.";
                alert(msg);
                // 당신이 원하는 목록 URL로 이동!
                navigate("/notice_list", { replace: true });
            }
        };

        checkAuth();
    }, [navigate]);

    // 권한 체크 중 로딩
    if (!authChecked) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>권한을 확인하는 중...</p>
            </div>
        );
    }

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

        if (!window.confirm("공지사항을 등록하시겠습니까?")) return;

        setIsLoading(true);
        setMessage("");

        try {
            await axios.post(
                "http://localhost:8484/api/notice_write",  // 당신이 원하는 URL!
                { noticeTitle: title, noticeContent: content },
                { withCredentials: true }
            );

            alert("공지사항이 성공적으로 등록되었습니다.");
            // 당신이 원하는 목록 URL로 이동!
            navigate("/notice_list");
        } catch (err) {
            setMessage(err.response?.data?.message || "등록 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="notice-write-container">
            <h1 className="notice-write-title">공지사항 작성</h1>

            <form onSubmit={handleSubmit} className="notice-write-form">
                {/* JSP 테이블 구조 100% 재현 (당신이 좋아하는 방식!) */}
                <table className="notice-write-table">
                    <tbody>
                    <tr>
                        <th className="write-label">제목</th>
                    </tr>
                    <tr>
                        <td className="write-input">
                            <input
                                type="text"
                                id="notice-title"
                                className="input-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="공지사항 제목을 입력하세요"
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
                                    id="notice-content"
                                    className="textarea-content"
                                    rows="18"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="공지사항 내용을 입력하세요. HTML 태그 사용 가능합니다."
                                    disabled={isLoading}
                                    required
                                />
                        </td>
                    </tr>
                    </tbody>
                </table>

                {/* 메시지 */}
                {message && (
                    <div className={`result-message ${message.includes("성공") ? "success" : "error"}`}>
                        {message}
                    </div>
                )}

                {/* 버튼 그룹 (JSP 그대로!) */}
                <div className="modify-button-group">
                    <button
                        type="submit"
                        className="btn btn-submit"
                        disabled={isLoading}
                    >
                        {isLoading ? "등록 중..." : "등록하기"}
                    </button>
                    <button
                        type="button"
                        className="btn btn-cancel"
                        onClick={() => navigate("/notice_list")}
                        disabled={isLoading}
                    >
                        취소
                    </button>
                </div>
            </form>
        </main>
    );
}

export default NoticeWrite;