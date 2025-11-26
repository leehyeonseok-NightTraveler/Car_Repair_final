// src/pages/inquiry/InquiryHistory.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import InquiryFloating from "../../components/common/InquiryFloating";
import Pagination from "../../components/common/Pagination";
import "./Inquiry.css"

export default function InquiryHistory() {
    const [inquiryList, setInquiryList] = useState([]);
    const [pageMaker, setPageMaker] = useState(null);
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const currentPage = parseInt(query.get("pageNum") || "1", 10);
    const type = query.get("type") || ""; // W or C

    const fetchInquiries = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/inquiry_history", {
                params: { pageNum: currentPage, amount: 10, type },
                withCredentials: true,
            });

            if (res.data.redirect) {
                navigate(res.data.redirect);
                return;
            }

            // 너의 백엔드 키 이름에 정확히 맞춤!
            setInquiryList(res.data.inquiryList || []);
            setPageMaker(res.data.pageMaker);
            setRole(res.data.role || "");
        } catch (err) {
            alert("문의 내역을 불러올 수 없습니다.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, type, navigate]);

    useEffect(() => {
        fetchInquiries();
    }, [fetchInquiries]);

    const goToPage = (page) => {
        const params = new URLSearchParams();
        params.set("pageNum", page);
        if (type) params.set("type", type);
        navigate(`?${params.toString()}`);
    };

    const toggleDelete = () => {
        setDeleteMode(!deleteMode);
        setSelectedIds([]);
    };

    const deleteSelected = async () => {
        if (!confirm("선택한 문의를 삭제하시겠습니까?")) return;

        try {
            await axios.post("/api/deleteProcess", {
                inquiryIds: selectedIds
            }, { withCredentials: true });

            alert("삭제되었습니다.");
            setDeleteMode(false);
            setSelectedIds([]);
            fetchInquiries();
        } catch (err) {
            alert("삭제 실패");
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const newType = e.target.type.value;
        navigate(`?pageNum=1&type=${newType}`);
    };

    return (
        <main id="inquiry-history-container" className="inquiry-history-container">
            <InquiryFloating />

            <div className="content">
                <section className="inquiry-header">
                    <h1 className="inquiry-title">문의 내역</h1>
                    <hr className="inquiry-divider" />
                </section>

                <form onSubmit={handleSearch} className="inquiry-search-form">
                    <select name="type" defaultValue={type}>
                        <option value="">전체</option>
                        <option value="W">답변대기</option>
                        <option value="C">답변완료</option>
                    </select>
                    <button type="submit">검색</button>
                </form>

                {loading && <div className="loading">로딩 중...</div>}
                {!loading && inquiryList.length === 0 && <div className="empty">문의 내역이 없습니다.</div>}

                {!loading && inquiryList.length > 0 && (
                    <>
                        <table className="inquiry-table">
                            <thead>
                            <tr>
                                <th>번호</th>
                                <th>제목</th>
                                <th>작성일</th>
                                <th>상태</th>
                            </tr>
                            </thead>
                            <tbody>
                            {inquiryList.map(item => (
                                <tr key={item.inquiry_no}>
                                    <td>
                                        {deleteMode && (
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(item.inquiry_no)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedIds(prev => [...prev, item.inquiry_no]);
                                                    } else {
                                                        setSelectedIds(prev => prev.filter(id => id !== item.inquiry_no));
                                                    }
                                                }}
                                            />
                                        )}
                                        {item.inquiry_no}
                                    </td>
                                    <td className="title-cell">
                                        <Link to={`/inquiry_view?inquiry_no=${item.inquiry_no}`}>
                                            {item.inquiry_title}
                                        </Link>
                                    </td>
                                    <td>{item.inquiry_created}</td>
                                    <td className={`status ${item.inquiry_status === "답변대기" ? "waiting" : "completed"}`}>
                                        {item.inquiry_status}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {(role === "USER" || role === "STORE") && (
                            <div className="inquiry-actions">
                                <button type="button" onClick={toggleDelete} className="btn-outline">
                                    {deleteMode ? "취소" : "문의 삭제"}
                                </button>
                                {deleteMode && selectedIds.length > 0 && (
                                    <button type="button" onClick={deleteSelected} className="btn-danger">
                                        선택 삭제 ({selectedIds.length})
                                    </button>
                                )}
                            </div>
                        )}

                        <Pagination pageMaker={pageMaker} goToPage={goToPage} currentPage={currentPage} />
                    </>
                )}
            </div>
        </main>
    );
}