import React, {useEffect, useState, useCallback} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import axios from "axios";
import InquiryFloating from "../../components/common/InquiryFloating";
import Pagination from "../../components/common/Pagination";
import "./InquiryHistory.css";

export default function InquiryHistory() {
    const [inquiryList, setInquiryList] = useState([]);
    const [pageMaker, setPageMaker] = useState(null);
    const [role, setRole] = useState(sessionStorage.getItem("ROLE") || "");
    const [loading, setLoading] = useState(true);
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedNos, setSelectedNos] = useState([]); // 상태와 상태 설정 함수

    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const currentPage = parseInt(query.get("pageNum") || "1", 10);
    const type = query.get("type") || "";

    const fetchInquiries = useCallback(async () => {
        setLoading(true);
        try {
            const params = {pageNum: currentPage, amount: 10};
            if (type) params.type = type;

            const res = await axios.get("/api/inquiry/history", {params, withCredentials: true});

            if (res.data.redirect) {
                navigate(res.data.redirect);
                return;
            }

            setInquiryList(res.data.inquiryList || []);
            setPageMaker(res.data.pageMaker);
            if (res.data.role) setRole(res.data.role);
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

    const handleTypeChange = (e) => {
        const newType = e.target.value;
        navigate(newType ? `?pageNum=1&type=${newType}` : `?pageNum=1`);
    };

    const toggleDelete = () => {
        setDeleteMode(!deleteMode);
        if (!deleteMode) setSelectedNos([]);
    };

    const deleteSelected = async () => {
        // confirm()은 window.confirm()을 사용하므로, 실제 서비스에서는 커스텀 모달로 대체해야 합니다.
        if (!window.confirm("선택한 문의를 정말 삭제하시겠습니까?")) return;
        try {
            await axios.post("/api/inquiry/deleteProcess", {inquiryNos: selectedNos}, {withCredentials: true});
            alert("삭제되었습니다.");
            setDeleteMode(false);
            // 🚨 수정: selectedNos() 대신 setSelectedNos([]) 사용
            setSelectedNos([]);
            fetchInquiries();
        } catch (err) {
            alert(err.response?.data?.message || "삭제에 실패했습니다.");
        }
    };

    const toggleSelect = (id) => {
        // 🚨 수정: selectedNos() 대신 setSelectedNos() 사용
        setSelectedNos(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    return (
        <>
            <InquiryFloating/>

            <main className="history-page">
                <div className="history-container">

                    <header className="history-header">
                        <h1 className="history-title">문의 내역</h1>
                    </header>

                    <div className="history-filter">
                        <select value={type} onChange={handleTypeChange}>
                            <option value="">전체</option>
                            <option value="답변대기">답변대기</option>
                            <option value="답변완료">답변완료</option>
                        </select>
                    </div>

                    {loading && <div className="history-loading">문의 내역을 불러오는 중...</div>}
                    {!loading && inquiryList.length === 0 && <div className="history-empty">문의 내역이 없습니다.</div>}

                    {!loading && inquiryList.length > 0 && (
                        <>
                            <div className="history-table-wrapper">
                                <table className="history-table">
                                    <thead>
                                    <tr>
                                        <th>번호</th>
                                        <th>제목</th>
                                        <th>작성자</th>
                                        <th>작성일</th>
                                        <th>상태</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {inquiryList.map(item => (
                                        <tr key={item.inquiry_no}>
                                            <td className="history-col-no">
                                                {deleteMode && (
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedNos.includes(item.inquiry_no)}
                                                        onChange={() => toggleSelect(item.inquiry_no)}
                                                    />
                                                )}
                                                {item.inquiry_no}
                                            </td>
                                            <td className="history-col-title">
                                                <Link to={`/inquiry/view/${item.inquiry_no}`}>
                                                    {item.inquiry_title}
                                                </Link>
                                            </td>
                                            <td className="history-col-name">{item.customer_name}</td>
                                            <td className="history-col-date">{item.inquiry_created}</td>
                                            <td className="history-col-status">
                                                    <span
                                                        className={`status-badge ${item.inquiry_status === "답변대기" ? "waiting" : "completed"}`}>
                                                        {item.inquiry_status}
                                                    </span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>

                                </table>
                            </div>

                            {(role === "USER" || role === "STORE") && (
                                <div className="history-actions">
                                    <button onClick={toggleDelete} className="btn-outline">
                                        {deleteMode ? "삭제 취소" : "문의 삭제"}
                                    </button>
                                    {deleteMode && selectedNos.length > 0 && (
                                        <button onClick={deleteSelected} className="btn-danger">
                                            선택 삭제 ({selectedNos.length}개)
                                        </button>
                                    )}
                                </div>
                            )}

                            <div className="history-pagination">
                                <Pagination pageMaker={pageMaker} goToPage={goToPage} currentPage={currentPage}/>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </>
    );
}