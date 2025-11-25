// src/pages/inquiry/InquiryManage.jsx
import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import InquiryFloating from "../../components/common/InquiryFloating";
import Pagination from "../../components/common/Pagination";
import "./Inquiry.css"

export default function InquiryManage() {
    const [list, setList] = useState([]);
    const [pageMaker, setPageMaker] = useState(null);
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const currentPage = parseInt(query.get("pageNum") || "1", 10);
    const type = query.get("type") || "";

    const fetchManage = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/inquiry_manage", {
                params: { pageNum: currentPage, amount: 10, type },
                withCredentials: true,
            });

            if (res.data.redirect) {
                navigate(res.data.redirect);
                return;
            }

            setList(res.data.ManageList || []);
            setPageMaker(res.data.pageMaker);
            setRole(res.data.role || "");
        } catch (err) {
            alert("문의 목록을 불러올 수 없습니다.");
        } finally {
            setLoading(false);
        }
    }, [currentPage, type, navigate]);

    useEffect(() => {
        fetchManage();
    }, [fetchManage]);

    const goToPage = (page) => {
        const params = new URLSearchParams();
        params.set("pageNum", page);
        if (type) params.set("type", type);
        navigate(`?${params.toString()}`);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const newType = e.target.type.value;
        navigate(`?pageNum=1&type=${newType}`);
    };

    return (
        <main className="inquiry-history-container">
            <InquiryFloating role={role} />

            <div className="content">
                <section className="inquiry-header">
                    <h1 className="inquiry-title">문의 관리</h1>
                    <hr className="inquiry-divider" />
                </section>

                <form onSubmit={handleSearch}>
                    <select name="type" defaultValue={type}>
                        <option value="">--</option>
                        <option value="W">답변대기</option>
                        <option value="C">답변완료</option>
                    </select>
                    <button type="submit">Search</button>
                </form>

                {loading && <div>로딩 중...</div>}
                {!loading && list.length === 0 && <div>문의가 없습니다.</div>}

                {!loading && list.length > 0 && (
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
                            {list.map((item) => (
                                <tr key={item.inquiry_no}>
                                    <td>{item.inquiry_no}</td>
                                    <td>
                                        <Link to={`/inquiry/inquiry_view?inquiry_no=${item.inquiry_no}`}>
                                            {item.inquiry_title}
                                        </Link>
                                    </td>
                                    <td>{item.inquiry_created}</td>
                                    <td className={`status-cell ${item.inquiry_status}`}>
                                        {item.inquiry_status === "Y" ? "답변완료" : "답변대기"}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <Pagination pageMaker={pageMaker} goToPage={goToPage} currentPage={currentPage} />
                    </>
                )}
            </div>
        </main>
    );
}