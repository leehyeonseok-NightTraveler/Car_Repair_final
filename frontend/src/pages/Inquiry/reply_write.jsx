// src/pages/inquiry/ReplyWrite.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import InquiryFloating from "../../components/common/InquiryFloating";
import "./Inquiry.css"

export default function ReplyWrite() {
    const [reply, setReply] = useState({});
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const inquiry_no = new URLSearchParams(location.search).get("inquiry_no");

    const fetchReply = useCallback(async () => {
        try {
            const res = await axios.get("/api/reply_write", {
                params: { inquiry_no },
                withCredentials: true,
            });

            if (res.data.redirect) {
                navigate(res.data.redirect);
                return;
            }

            setReply(res.data.reply || {});
            setRole(res.data.role || "");
        } catch (err) {
            alert("문의 정보를 불러올 수 없습니다.");
        } finally {
            setLoading(false);
        }
    }, [inquiry_no, navigate]);

    useEffect(() => {
        fetchReply();
    }, [fetchReply]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try {
            await axios.post("/api/replyProcess", new URLSearchParams(data), {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                withCredentials: true,
            });
            alert("답변이 저장되었습니다.");
            navigate(`/inquiry/inquiry_view?inquiry_no=${inquiry_no}`);
        } catch (err) {
            alert("저장 실패");
        }
    };

    if (loading) return <div>로딩 중...</div>;

    return (
        <main className="inquiry-view-container">
            <InquiryFloating role={role} />

            <section className="inquiry-header">
                <h2 className="inquiry-title">{reply.inquiry_title}</h2>
                <hr className="inquiry-divider" />
            </section>

            <article className="inquiry-body">
                <div
                    className="inquiry-content"
                    dangerouslySetInnerHTML={{ __html: reply.inquiry_content }}
                />
                <div className="inquiry-meta">
                    <span className="inquiry-date">{reply.inquiry_created}</span>
                </div>
            </article>

            <form onSubmit={handleSubmit}>
                <input type="hidden" name="inquiry_no" value={reply.inquiry_no} />
                <section className="inquiry-reply">
                    <h3 className="reply-title">관리자 답변</h3>
                    <textarea
                        name="reply_content"
                        className="reply-content-area"
                        rows="10"
                        defaultValue={reply.reply_content || ""}
                        required
                    />
                </section>
                <div className="reply-submit">
                    <button type="submit" className="btn btn-primary">
                        {reply.reply_content ? "수정" : "답변"}
                    </button>
                </div>
            </form>
        </main>
    );
}