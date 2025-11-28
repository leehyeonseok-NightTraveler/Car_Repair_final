/* eslint-disable no-unused-vars */
// src/common/Header.jsx
import React, { useState, useEffect } from 'react'; // React Hook 추가
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AutoSearch from "../../pages/AutoSearch/autoSearch.jsx";
import "./mainpage.css";

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate(); // 페이지 이동용 훅
    
    // [수정] 상태값(State)으로 관리해야 화면이 즉시 바뀝니다.
    const [role, setRole] = useState(sessionStorage.getItem("ROLE") || "");

    // 페이지 이동할 때마다 세션 확인 (로그인 상태 갱신)
    useEffect(() => {
        setRole(sessionStorage.getItem("ROLE") || "");
    }, [location]); // 주소가 바뀔 때마다 실행

    // [로그아웃 처리]
    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get("http://localhost:8484/api/logout", { withCredentials: true });
            if (res.data.success) {
                sessionStorage.clear();
                setRole(""); // 상태 초기화
                alert("로그아웃 되었습니다.");
                window.location.href = "/";
            }
        } catch (err) {
            console.error("로그아웃 오류:", err);
        }
    };

    // [관리자 모드 해제 처리]
    const handleExitAdmin = async (e) => {
        e.preventDefault();
        if (!window.confirm("관리자 모드를 해제하시겠습니까?")) return;

        try {
            const res = await axios.get("http://localhost:8484/api/admin/exit", { withCredentials: true });
            if (res.data.success) {
                alert("관리자 모드가 해제되었습니다.");
                sessionStorage.setItem("ROLE", "USER");
                setRole("USER"); // 화면 즉시 갱신
                window.location.href = "/";
            } else {
                alert(res.data.message || "해제 실패");
            }
        } catch (err) {
            console.error("관리자 해제 오류:", err);
            sessionStorage.setItem("ROLE", "USER");
            setRole("USER");
            window.location.href = "/";
        }
    };

    return (
        <>
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

                    {/* 로고 */}
                    <h1>
                        <Link to="/">MY CAR 정비소</Link>
                    </h1>
					
					{/* 검색창 영역 */}
					<div>
	                      <AutoSearch placeholder="검색어 입력하세요" />
	                 </div>
                    <ul id="gnb">
                        <li><Link to="/guide">꿀팁 가이드</Link></li>
                        <li><Link to="/recommend">주변 정비소</Link></li>
                        <li>
                            <Link to={role ? "/Reservation" : "/login"}>예약</Link> 
                        </li>
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
                                <li><Link to="/notice/list">공지사항</Link></li>
                                <li><Link to="/faq">FAQ</Link></li>
                            </ul>
                        </li>
                    </ul>

                    <ul className="util">
                        {/* 1. 일반 유저일 때 */}
                        {role === "USER" && (
                            <>
                                <li><Link to="/mypage/user">마이페이지</Link></li>
                                <li><a href="#" onClick={handleLogout}>로그아웃</a></li>
                                <li className="admin-enter"><Link to="/admin/promote">관리자 전환</Link></li>
                            </>
                        )}
                        
                        {/* 2. 업체일 때 */}
                        {role === "STORE" && (
                            <>
                                <li><Link to="/mypage/store">업체 마이페이지</Link></li>
                                <li><a href="#" onClick={handleLogout}>로그아웃</a></li>
                            </>
                        )}
                        
                        {/* 3. 관리자일 때 (해제 버튼 보여주기) */}
                        {role === "ADMIN" && (
                            <>
                                <li><Link to="/mypage/admin">관리자 페이지</Link></li>
                                <li><a href="#" onClick={handleLogout}>로그아웃</a></li>
                                <li className="admin-enter">
                                    <a href="#" onClick={handleExitAdmin} style={{color:'#dc3545', fontWeight:'bold'}}>
                                        관리자 해제
                                    </a>
                                </li>
                            </>
                        )}
                        
                        {/* 4. 로그인 안 했을 때 */}
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