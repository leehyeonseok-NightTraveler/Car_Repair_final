// src/common/Header.jsx
import React from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import "./mainpage.css";

const Header = () => {
    const location = useLocation();
    const role = sessionStorage.getItem("ROLE") || "";

	const handleLogout = async (e) => {
	    e.preventDefault();

	    try {
	        const res = await axios.get("http://localhost:8484/api/logout", {
	            withCredentials: true
	        });

	        if (res.data.success) {
	            sessionStorage.clear();
	            alert("로그아웃 되었습니다.");
	            window.location.href = "/";
	        }
	    } catch (err) {
	        console.error("로그아웃 오류:", err);
	    }
	};

    return (
        <>
            {/* 플로팅 아이콘 */}
            <div className="floating-icons">
                <a href="https://www.instagram.com/khieiorkr/" target="_blank" rel="noopener noreferrer">
                    <img src="https://img.icons8.com/fluent/48/000000/instagram-new.png" alt="인스타그램" />
                </a>
                <a href="https://www.youtube.com/@KH_academy" target="_blank" rel="noopener noreferrer">
                    <img src="https://img.icons8.com/color/48/youtube-play.png" alt="유튜브" />
                </a>
            </div>

            <header>
                <div className="inner">
                    <h1>
                        <Link to="/">MY CAR 정비소</Link>
                    </h1>

                    <ul id="gnb">
                        <li><Link to="/guide">꿀팁 가이드</Link></li>
                        <li><Link to="/recommend">주변 정비소</Link></li>

                        <li className="dropdown-parent">
                            <Link to="#">고객센터</Link>
                            <ul className="submenu">
                                <li>
                                    {role === "USER" || role === "STORE" ? (
                                        <Link to="/inquiry/history">1:1 문의</Link>
                                    ) : role === "ADMIN" ? (
                                        <Link to="/inquiry/manage">문의 관리</Link>
                                    ) : (
                                        <Link to="/login">1:1 문의</Link>
                                    )}
                                </li>
                                <li><Link to="/notice">공지사항</Link></li>
                                <li><Link to="/faq">FAQ</Link></li>
                            </ul>
                        </li>
                    </ul>

                    <ul className="util">
                        {role === "USER" && (
                            <>
                                <li><Link to="/mypage_user">마이페이지</Link></li>
                                <li><a href="#" onClick={handleLogout}>로그아웃</a></li>
                                <li className="admin-enter"><Link to="/promote_admin">관리자 전환</Link></li>
                            </>
                        )}
                        {role === "STORE" && (
                            <>
                                <li><Link to="/mypage_store">업체 마이페이지</Link></li>
                                <li><a href="#" onClick={handleLogout}>로그아웃</a></li>
                            </>
                        )}
                        {role === "ADMIN" && (
                            <>
                                <li><Link to="/mypage_admin">관리자 페이지</Link></li>
                                <li className="admin-enter"><Link to="/admin/exit">관리자 모드 해제</Link></li>
                            </>
                        )}
                        {!role && (
                            <>
                                <li><Link to="/login">로그인</Link></li>
                                <li><Link to="/register">회원가입</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </header>
        </>
    );
};

export default Header;
