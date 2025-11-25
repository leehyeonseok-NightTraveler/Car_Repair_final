// src/pages/inquiry/InquiryView.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import InquiryFloating from "../../components/common/InquiryFloating";
import "./Inquiry.css"

export default function InquiryView() {
    const [inquiry, setInquiry] = useState({});
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const inquiry_no = new URLSearchParams(location.search).get("inquiry_no");

    const fetchView = useCallback(async () => {
        if (!inquiry_no) {
            navigate("/inquiry/inquiry_history");
            return;
        }

        try {
            const res = await axios.get("/api/inquiry_view", {
                params: { inquiry_no },
                withCredentials: true,
            });

            if (res.data.redirect) {
                navigate(res.data.redirect);
                return;
            }

            setInquiry(res.data.inquiryView || {});
            setRole(res.data.role || "");
        } catch (err) {
            alert("문의 내용을 불러올 수 없습니다.");
        } finally {
            setLoading(false);
        }
    }, [inquiry_no, navigate]);

    useEffect(() => {
        fetchView();
    }, [fetchView]);

    if (loading) return <div>로딩 중...</div>;
    if (!inquiry.inquiry_no) return <div>문의가 존재하지 않습니다.</div>;

    return (
        <main id="inquiry-view-container" className="inquiry-view-container">
            <InquiryFloating role={role} />

            <section className="inquiry-header">
                <h2 className="inquiry-title">{inquiry.inquiry_title}</h2>
                <hr className="inquiry-divider" />
            </section>

            <article className="inquiry-body">
                <div
                    className="inquiry-content"
                    dangerouslySetInnerHTML={{ __html: inquiry.inquiry_content }}
                />
                <div className="inquiry-meta">
                    <span className="inquiry-date">{inquiry.inquiry_created}</span>
                </div>
            </article>

            {role === "ADMIN" ? (
                <section className="inquiry-reply">
                    <h3 className="reply-title">관리자 답변</h3>
                    {inquiry.reply_content ? (
                        <div
                            className="reply-content"
                            dangerouslySetInnerHTML={{ __html: inquiry.reply_content }}
                        />
                    ) : (
                        <p>아직 답변이 없습니다.</p>
                    )}
                    <div className="reply-button">
                        <a
                            href={`/inquiry/reply_write?inquiry_no=${inquiry.inquiry_no}`}
                            className="btn btn-primary"
                        >
                            {inquiry.reply_content ? "답변 수정" : "답변 작성"}
                        </a>
                    </div>
                </section>
            ) : inquiry.reply_content ? (
                <section className="inquiry-reply">
                    <h3 className="reply-title">관리자 답변</h3>
                    <div
                        className="reply-content"
                        dangerouslySetInnerHTML={{ __html: inquiry.reply_content }}
                    />
                </section>
            ) : null}
        </main>
    );
}