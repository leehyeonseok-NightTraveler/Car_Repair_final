// src/pages/inquiry/InquiryWrite.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InquiryFloating from "../../components/common/InquiryFloating";
import "./Inquiry.css"

export default function InquiryWrite() {
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchPage = useCallback(async () => {
        try {
            const res = await axios.get("/api/inquiry_write", { withCredentials: true });
            if (res.data.redirect) {
                navigate(res.data.redirect);
                return;
            }
            setRole(res.data.role || "");
        } catch (err) {
            alert("페이지 로드 실패");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchPage();
    }, [fetchPage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        try {
            await axios.post("/api/writeProcess", new URLSearchParams(data), {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                withCredentials: true,
            });
            alert("문의가 등록되었습니다.");
            navigate("/inquiry/inquiry_history");
        } catch (err) {
            alert("등록 실패");
        }
    };

    if (loading) return <div>로딩 중...</div>;

    return (
        <main className="content">
            <InquiryFloating role={role} />

            <form onSubmit={handleSubmit} id="inquiry-form">
                <h2 className="form-title">문의 등록</h2>

                <div className="form-group">
                    <label>이름</label>
                    <input type="text" name="customer_name" required />
                </div>

                <div className="form-group">
                    <label>연락처</label>
                    <input type="tel" name="customer_phone" required />
                </div>

                <div className="form-group">
                    <label>이메일</label>
                    <input type="email" name="customer_email" required />
                </div>

                <div className="form-group">
                    <label>제목</label>
                    <input type="text" name="inquiry_title" required />
                </div>

                <div className="form-group">
                    <label>문의내용</label>
                    <textarea name="inquiry_content" rows="10" required></textarea>
                </div>

                <div className="form-actions">
                    <button type="submit" className="submit-button">등록</button>
                </div>
            </form>
        </main>
    );
}