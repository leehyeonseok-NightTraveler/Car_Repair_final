// src/pages/inquiry/InquiryView.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useLocation 제거, useParams 추가
import axios from "axios";
import InquiryFloating from "../../components/common/InquiryFloating";
import "./Inquiry.css"

export default function InquiryView() {
    const [inquiry, setInquiry] = useState({});
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // ⭐️ 수정: useParams를 사용하여 URL 파라미터에서 inquiryNo를 가져옵니다.
    // App.js 라우팅이 /inquiry_view/:inquiryNo 라고 가정합니다.
    const { inquiryNo } = useParams();

    const fetchView = useCallback(async () => {
        // ⭐️ 수정: inquiry_no 대신 inquiryNo 사용
        if (!inquiryNo) {
            navigate("/inquiry_history");
            return;
        }

        try {
            const res = await axios.get("/api/inquiry_view", {
                // ⭐️ 수정: 파라미터 이름 inquiryNo로 변경
                params: { inquiry_no: inquiryNo },
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
    }, [inquiryNo, navigate]); // 의존성 배열도 inquiryNo로 변경

    useEffect(() => {
        fetchView();
    }, [fetchView]);

    if (loading) return <div>로딩 중...</div>;
    // URL 파라미터가 유효하지 않은 경우를 대비해 inquiryNo를 확인하는 로직을 추가해도 좋습니다.
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

            {/* 관리자 답변 영역 */}
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
                        {/* ⭐️ 수정: 답변 작성 링크를 URL 파라미터 방식으로 변경 */}
                        <a
                            href={`/reply_write/${inquiry.inquiry_no}`}
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